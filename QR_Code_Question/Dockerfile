# 1단계: React 앱 빌드
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install

COPY . .

# 환경 변수 (백엔드 API 주소)
ENV VITE_API_URL=http://localhost:8000

RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
