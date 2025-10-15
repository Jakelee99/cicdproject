# DB 연결 설정
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite 데이터베이스 연결 URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/data.db"

# 엔진생성(DB 파일 연결)
# engine : DB와 실제 연결을 관리
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 세션 생성기 (DB 연결 유지))
# SessionLocal : DB 연결 세션(CRUD 시마다 생성)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORM용 기본 클래스
# 모델들이 생속 받는 기본 클래스
Base = declarative_base()