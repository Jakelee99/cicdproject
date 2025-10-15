# 테이블 모델 정의
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from .database import Base


class Question(Base):
    # 실제 DB에 저장될 테이블 이름
    __tablename__ = "questions"

    # DB 컬럼 정의
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    
    # 기본생성시간 자동 기록
    created_at = Column(DateTime, default=datetime.utcnow)
