import type { SubstackArticle, SubstackPostsResponse } from "~/types/articles";

const SUBSTACK_API_BASE = "https://api.substackapi.dev";
const PUBLICATION_URL = "circuitnation.substack.com";

function getSubstackApiKey(): string | undefined {
  return process.env.VITE_SUBSTACK_API_KEY;
}

export async function getSubstackArticles(
  limit = 5,
): Promise<SubstackArticle[]> {
  const apiKey = getSubstackApiKey();
  if (!apiKey) {
    console.error("Missing environment variable: VITE_SUBSTACK_API_KEY");
    return [];
  }

  const url = new URL(`${SUBSTACK_API_BASE}/posts/latest`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("publication_url", PUBLICATION_URL);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-API-Key": apiKey },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Substack articles: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as SubstackPostsResponse;
    return payload.data ?? [];
  } catch (error) {
    console.error("Error fetching Substack articles:", error);
    return [];
  }
}
