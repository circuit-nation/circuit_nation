import { adminFetch } from "./admin-api.server";
import type { EventLocation, GlobeEvent } from "~/types/events";

export async function getUpcomingEvents(limit = 3): Promise<GlobeEvent[]> {
  const payload = await adminFetch<{ data: GlobeEvent[] }>(
    "/api/events/upcoming",
    { limit: String(limit) },
  );
  return payload?.data ?? [];
}

export async function getEventLocations(): Promise<EventLocation[]> {
  const payload = await adminFetch<{ data: EventLocation[] }>(
    "/api/events/locations",
  );
  return payload?.data ?? [];
}
