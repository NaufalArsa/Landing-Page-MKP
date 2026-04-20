const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export type UserInfo = {
  id: number;
  username: string;
  displayName: string;
  role: "admin" | "humas" | "sdm";
};

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  imageUrl: string | null;
  category: string | null;
  status: "draft" | "published" | "archived";
  uploaderId: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<UserInfo>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => apiFetch<UserInfo>("/auth/me"),
};

export const newsApi = {
  list: (status?: string) =>
    apiFetch<NewsItem[]>(`/news${status ? `?status=${status}` : ""}`),
  get: (id: number) => apiFetch<NewsItem>(`/news/${id}`),
  create: (data: Partial<NewsItem>) =>
    apiFetch<NewsItem>("/news", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<NewsItem>) =>
    apiFetch<NewsItem>(`/news/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<{ message: string }>(`/news/${id}`, { method: "DELETE" }),
};
