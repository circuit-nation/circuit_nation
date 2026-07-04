function getAdminConfig() {
  const baseUrl = process.env.VITE_CN_API_URL;
  const token = process.env.VITE_CN_API_TOKEN;
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

export async function adminFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  const config = getAdminConfig();
  if (!config) {
    console.error("Missing VITE_CN_API_URL or VITE_CN_API_TOKEN");
    return null;
  }

  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.token}` },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error(`adminFetch ${path} failed:`, error);
    return null;
  }
}
