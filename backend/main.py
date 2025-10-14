from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 데이터 저장용 (임시 메모리)
questions = []

# 질문 데이터 형식 정의
class Question(BaseModel):
    content: str

# health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# 질문 등록 API (POST)
@app.post("/questions")
def create_question(q: Question):
    questions.append(q.content)
    return {"message": "질문이 등록되었습니다", "total_questions": len(questions)}

# 질문 목록 조회 API (GET)
@app.get("/questions")
def get_questions():
    return {"questions": questions}
