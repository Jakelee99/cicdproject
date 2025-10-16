from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

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
