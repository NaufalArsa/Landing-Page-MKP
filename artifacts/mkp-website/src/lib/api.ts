const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const headers = new Headers(init?.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers,
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
  create: (data: Partial<NewsItem> | FormData) =>
    apiFetch<NewsItem>("/news", { method: "POST", body: data instanceof FormData ? data : JSON.stringify(data) }),
  update: (id: number, data: Partial<NewsItem> | FormData) =>
    apiFetch<NewsItem>(`/news/${id}`, { method: "PUT", body: data instanceof FormData ? data : JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<{ message: string }>(`/news/${id}`, { method: "DELETE" }),
};
