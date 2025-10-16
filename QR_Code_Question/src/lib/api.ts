import axios from "axios";

const sanitizeUrl = (url: string) => url.replace(/\/$/, "");

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return sanitizeUrl(envUrl);
  }

  if (typeof window !== "undefined") {
    const current = new URL(window.location.origin);

    // 기본적으로 프런트 포트(5173 등)를 백엔드 포트(8000)로 치환
    const backendPort = "8000";

    // 80/443처럼 기본 포트라면 명시적으로 8000 지정
    if (!current.port || current.port === "80" || current.port === "443") {
      return `${current.protocol}//${current.hostname}:${backendPort}`;
    }

    return `${current.protocol}//${current.hostname}:${backendPort}`;
  }

  return "http://localhost:8000";
};

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
