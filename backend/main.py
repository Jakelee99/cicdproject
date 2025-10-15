from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from . import models
from .database import SessionLocal, engine

# DB 테이블 생성
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Code Question API")

# CORS 설정 (React 앱과 통신 허용)
origins = [
    "http://localhost:5173", # React 개발 서버
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# Health Check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# 질문등록 (Post)
@app.post("/questions")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = models.Question(content=question.content)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return {"message": "질문이 등록되었습니다", "id": new_question.id}

# 질문목록(Get)
@app.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(models.Question).order_by(models.Question.created_at.desc()).all()
    return [
        {"id": q.id, "content": q.content, "created_at": q.created_at}
        for q in questions
    ]
