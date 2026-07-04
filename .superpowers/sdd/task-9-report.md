# Task 9 Report: cn-client admin API client + server fetchers

**Branch:** `feat/cn-client-backend-integration`  
**Date:** 2026-06-27  
**Status:** Complete

## Summary

Implemented shared admin API fetch helper and domain-specific server fetchers for articles, events, and social wall. Updated YouTube fetcher to send Bearer auth. Added/updated TypeScript types to match admin API response shapes. Did **not** wire `home.tsx` (deferred to Task 10).

## Files Created

| File | Purpose |
|------|---------|
| `app/lib/admin-api.server.ts` | Shared `adminFetch<T>()` with `VITE_CN_API_URL` + `VITE_CN_API_TOKEN` |
| `app/lib/articles.server.ts` | `getArticles(limit)` → `GET /api/articles` |
| `app/lib/events.server.ts` | `getUpcomingEvents(limit)`, `getEventLocations()` |
| `app/lib/social-wall.server.ts` | `getSocialWallSlots()` → `GET /api/social-wall` |
| `app/types/events.ts` | `GlobeEvent`, `EventLocation` |
| `app/types/social-wall.ts` | `SocialWallSlot`, `SocialWallSlotId`, `SOCIAL_WALL_SLOT_IDS` |

## Files Modified

| File | Change |
|------|--------|
| `app/types/articles.ts` | Added `Article` type matching admin API shape |
| `app/lib/youtube.server.ts` | Added `Authorization: Bearer ${VITE_CN_API_TOKEN}` header |
| `app/lib/substack.server.ts` | Added `@deprecated` JSDoc pointing to `articles.server.ts` |

## Environment Variables

| Variable | Usage |
|----------|-------|
| `VITE_CN_API_URL` | Base URL for admin public API (e.g. `https://admin.circuitnation.com`) |
| `VITE_CN_API_TOKEN` | Bearer token for client API auth (`CN_CLIENT_API_TOKEN` on admin side) |

## API Endpoints Consumed

| Fetcher | Endpoint | Auth |
|---------|----------|------|
| `getArticles` | `GET /api/articles?limit=N` | Bearer |
| `getUpcomingEvents` | `GET /api/events/upcoming?limit=N` | Bearer |
| `getEventLocations` | `GET /api/events/locations` | Bearer |
| `getSocialWallSlots` | `GET /api/social-wall` | Bearer |
| `getYoutubeVideos` | `GET /youtube/videos?limit=N` | Bearer (rewrite to `/api/youtube/videos`) |

## Not Wired (Task 10)

- `app/routes/home.tsx` — still uses `getSubstackArticles`
- `app/components/home/posts.tsx` — still uses `SubstackArticle`
- `app/components/home/globe.tsx` — still uses hardcoded `UPCOMING_EVENTS`
- `app/components/home/social-wall.tsx` — not yet connected to `getSocialWallSlots`

## Verification

```bash
npm run typecheck
```

**Result:** Pre-existing project errors only (missing `convex/_generated` modules, route `+types`). No TypeScript errors in Task 9 files.

## Commit

```
feat(cn-client): admin API fetchers with Bearer token auth
```
