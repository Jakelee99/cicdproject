# 1단계: Python 런타임 환경
FROM python:3.11-slim

# 2단계: 작업 디렉터리 설정
WORKDIR /app

# 3단계: 종속성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4단계: 전체 소스 복사
COPY . .

# 5단계: FastAPI 실행 포트
EXPOSE 8000

# 6단계: FastAPI 실행 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
