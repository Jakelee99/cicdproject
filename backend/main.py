from datetime import datetime, time, timedelta, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

try:
    from backend import models
    from backend.database import SessionLocal, engine
except ImportError:
    import models  # type: ignore
    from database import SessionLocal, engine  # type: ignore

# DB 테이블 생성
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Code Question API")
scheduler = AsyncIOScheduler()

# CORS 설정 (React 앱과 통신 허용)
origins = [
    "http://localhost:5173",  #React 개발 서버 
    "http://127.0.0.1:5173",
    "http://3.39.242.66:5173",
    "http://3.39.242.66"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용된 origin만 접근 가능
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용(Get, Post등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# 의존성 주입 (DB 세션)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic 모델 (요청 바디 검증용)
class QuestionCreate(BaseModel):
    content: str


KST = timezone(timedelta(hours=9))


def prune_old_questions(db: Session) -> None:
    """한국 시간 기준 자정이 지나면 이전 날짜 질문을 제거."""
    now_kst = datetime.now(KST)
    start_of_today_kst = datetime.combine(now_kst.date(), time.min, tzinfo=KST)
    start_of_today_utc = start_of_today_kst.astimezone(timezone.utc).replace(tzinfo=None)

    deleted = (
        db.query(models.Question)
        .filter(models.Question.created_at < start_of_today_utc)
        .delete(synchronize_session=False)
    )
    if deleted:
        db.commit()


def run_scheduled_cleanup() -> None:
    db = SessionLocal()
    try:
        prune_old_questions(db)
    finally:
        db.close()


@app.on_event("startup")
def start_scheduler() -> None:
    # 컨테이너가 새로 올라올 때마다 모든 질문을 초기화
    db = SessionLocal()
    try:
        db.query(models.Question).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()

    if not scheduler.running:
        scheduler.add_job(
            run_scheduled_cleanup,
            CronTrigger(hour=0, minute=0, timezone=KST),
            id="daily_cleanup",
            replace_existing=True,
        )
        scheduler.start()


@app.on_event("shutdown")
def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)

# Health Check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# 질문등록 (Post)
@app.post("/questions")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    prune_old_questions(db)
    new_question = models.Question(content=question.content)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return {"message": "질문이 등록되었습니다", "id": new_question.id}

# 질문목록(Get)
@app.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    prune_old_questions(db)
    questions = db.query(models.Question).order_by(models.Question.created_at.desc()).all()
    return [
        {"id": q.id, "content": q.content, "created_at": q.created_at}
        for q in questions
    ]
