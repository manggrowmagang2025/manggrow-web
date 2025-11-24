const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8000/api";
const TOKEN_KEY = "manggrow_token";

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAssetUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:8000";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  skipAuth?: boolean;
  body?: any;
};

export async function apiFetch<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: HeadersInit = options.headers ? { ...options.headers } : {};
  const body = options.body;

  const isFormData = body instanceof FormData;
  if (body && !isFormData && typeof body !== "string") {
    options.body = JSON.stringify(body);
  }

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  headers["Accept"] = headers["Accept"] || "application/json";

  const token = !options.skipAuth ? getStoredToken() : null;
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) return null as T;
  try {
    return await response.json();
  } catch {
    return null as T;
  }
}
