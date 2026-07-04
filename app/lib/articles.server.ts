import { adminFetch } from "./admin-api.server";
import type { Article } from "~/types/articles";

type ArticlesResponse = { data: Article[] };

export async function getArticles(limit = 5): Promise<Article[]> {
  const payload = await adminFetch<ArticlesResponse>("/api/articles", {
    limit: String(limit),
  });
  return payload?.data ?? [];
}
