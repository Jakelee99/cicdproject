# 1단계: Python 런타임 환경
FROM python:3.11-slim

# 2단계: 기본 환경 변수 및 작업 디렉터리
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

# 3단계: 패키지 의존성 설치
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# 4단계: 애플리케이션 소스 복사
COPY . .

# 5단계: FastAPI 실행 포트
EXPOSE 8000

# 6단계: FastAPI 실행 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
