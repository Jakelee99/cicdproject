# 1단계: React 앱 빌드
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm ci

COPY . .

# 환경 변수 (백엔드 API 주소) - 기본값은 비워 두고 필요 시 build arg로 주입
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

#  2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine
ENV NODE_ENV=production
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
