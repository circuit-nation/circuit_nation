export type Articles = {
  blog_id: string;
  title: string;
  first_paragraph: string;
  first_image: string;
  content_type: string;
  published_time: string;
  like_count: number;
  bookmark_count: number;
  tags: string[];
};

export type SubstackCoverImage = {
  original: string;
  small: string;
  medium?: string;
  large?: string;
  og?: string;
};

export type SubstackArticle = {
  slug: string;
  url: string;
  title: string;
  description: string;
  excerpt: string;
  reading_time_minutes: number;
  date: string;
  likes: number;
  paywall?: boolean;
  author?: string;
  cover_image: SubstackCoverImage;
  cover_image_color_palette?: {
    vibrant: string;
    light_vibrant: string;
    dark_vibrant: string;
    muted: string;
    light_muted: string;
    dark_muted: string;
  };
};

export type SubstackPostsResponse = {
  data: SubstackArticle[];
  metadata: {
    timestamp?: number;
    source?: string;
    publication_url: string;
    posts_count: number;
    offset: number;
    limit: number;
  };
};
