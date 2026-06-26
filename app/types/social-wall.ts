export const SOCIAL_WALL_SLOT_IDS = [
  "row1-horizontal-yt",
  "row1-post-top",
  "row1-post-bottom",
  "row1-vertical-ig",
  "row2-vertical-yt",
  "row2-post-top",
  "row2-post-bottom",
  "row2-horizontal-substack",
] as const;

export type SocialWallSlotId = (typeof SOCIAL_WALL_SLOT_IDS)[number];

export type SocialWallSlot = {
  _id: string;
  slotId: SocialWallSlotId;
  platform: "yt" | "reddit" | "ig" | "substack";
  title: string;
  subtitle: string;
  url: string;
  thumbnailUrl: string;
  hasPlay: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
