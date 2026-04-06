export const API_BASE = "https://joaocunha.flashnetbrasil.com.br/api/v1";

export const getToken = () => localStorage.getItem("token") || "";

let refreshing: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const rt = localStorage.getItem("refresh_token");
  if (!rt) return null;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: rt }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data.access_token;
}

export async function api(path: string, opts: RequestInit = {}): Promise<Response> {
  const doFetch = (token: string) =>
    fetch(`${API_BASE}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...opts.headers,
      },
    });

  let res = await doFetch(getToken());

  if (res.status === 401) {
    if (!refreshing) {
      refreshing = tryRefresh().finally(() => { refreshing = null; });
    }
    const newToken = await refreshing;
    if (!newToken) {
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }
    res = await doFetch(newToken);
  }

  return res;
}
