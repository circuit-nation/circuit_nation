import { adminFetch } from "./admin-api.server";
import type { SocialWallSlot } from "~/types/social-wall";

export async function getSocialWallSlots(): Promise<SocialWallSlot[]> {
  const payload = await adminFetch<{ data: SocialWallSlot[] }>(
    "/api/social-wall",
  );
  return payload?.data ?? [];
}
