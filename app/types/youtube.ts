export type YoutubeVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationSeconds: number;
  viewCount: number;
  publishedAt: string;
  url: string;
};

export type YoutubeVideosResponse = {
  data?: YoutubeVideo[];
};
