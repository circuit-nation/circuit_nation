import type { YoutubeVideo, YoutubeVideosResponse } from "~/types/youtube";

function getCnApiUrl(): string | undefined {
  return process.env.VITE_CN_API_URL;
}

export async function getYoutubeVideos(limit = 5): Promise<YoutubeVideo[]> {
  const baseUrl = getCnApiUrl();
  if (!baseUrl) {
    console.error("Missing environment variable: VITE_CN_API_URL");
    return [];
  }

  const url = new URL("/youtube/videos", baseUrl);
  url.searchParams.set("limit", String(limit));

  try {
    const token = process.env.VITE_CN_API_TOKEN;
    if (!token) {
      console.error("Missing environment variable: VITE_CN_API_TOKEN");
      return [];
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch YouTube videos: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as YoutubeVideosResponse;
    return payload.data ?? [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}
