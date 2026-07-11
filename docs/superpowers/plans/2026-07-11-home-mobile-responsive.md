# Home Landing Mobile Responsive + Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Circuit Nation home landing use uniform `py-24` section rhythm and a solid mobile layout (cards scale cleanly; testimonials become a shadcn carousel below `md`).

**Architecture:** Extract shared landing section/container class constants, apply them across every home section rendered by `app/routes/home.tsx`, add the shadcn Carousel primitive, then switch testimonials to masonry-on-desktop / carousel-on-mobile. Card and grid components get explicit `< md` collapse rules so thumbs, CTAs, and metric tiles do not overflow.

**Tech Stack:** React Router 7, Tailwind CSS v4, existing CN design tokens (`--cn-*`), shadcn/ui Carousel (Embla via `embla-carousel-react`), existing `cnCardClass` / home section components.

## Global Constraints

- **Design read:** Redesign-preserve of the Circuit Nation motorsport home landing for fans on phone and tablet; keep the dark red-accent visual language; do not invent a new aesthetic.
- **Dials:** `DESIGN_VARIANCE: 7` / `MOTION_INTENSITY: 5` / `VISUAL_DENSITY: 4` (match existing; only add carousel motion on mobile testimonials).
- **Section vertical rhythm:** Every content `<section>` used on home MUST use `py-24` (via shared constant). Exceptions: `LandingNav` (fixed header), `RaceMarquee` (thin strip), `LandingFooter` (compact footer).
- **Container gutters:** Shared container MUST use `px-4 md:px-8` (replace mixed `px-8` / `max-sm:px-4` / `px-4 md:p-0`).
- **Breakpoint for testimonials carousel:** `< md` (768px) = Carousel; `md+` = existing CSS columns masonry.
- **Brand accent stays** `#ff2d2d` / `text-cn-accent`. No new accent colors.
- **No em-dash (`—` or `–`)** in any user-visible copy touched by this work (footer currently has one).
- **No new test runner.** This repo has no Vitest/Playwright. Verification gates are: (1) `rg` checks for forbidden padding classes, (2) `npm run typecheck`, (3) manual viewport checklist at 375 / 768 / 1280.
- **Do not rewrite copy** except footer em-dash fix and CTA wrap fixes (shorten label only if a button wraps at 375px).
- **Unused home modules** (`proof.tsx`, `collab.tsx`, `amas.tsx`) are out of scope unless imported into `home.tsx` later.

## File Structure

| File | Responsibility |
|------|----------------|
| `app/components/home/landing-shell.ts` | Shared `landingSectionClass` + `landingContainerClass` constants |
| `app/components/ui/carousel.tsx` | shadcn Carousel primitive (created by CLI) |
| `app/components/home/testimonials.tsx` | Masonry desktop + Carousel mobile; `py-24` + shared container |
| `app/components/home/hero.tsx` | Shared container; metric grid mobile `row-span` fix; keep hero `py-12` (visual opener, not a content band) |
| `app/components/home/metric-card.tsx` | Mobile-safe featured span + padding scale |
| `app/components/home/about.tsx` | `py-24` + shared container |
| `app/components/home/globe.tsx` | Shared container; tighter mobile gap |
| `app/components/home/posts.tsx` | Shared shell; compact cards stack on mobile |
| `app/components/home/videos.tsx` | Shared shell; compact cards stack on mobile |
| `app/components/home/social-wall.tsx` | Shared shell |
| `app/components/home/join.tsx` | Shared shell; platform cards + CTA wrap safety |
| `app/components/home/footer.tsx` | Em-dash removal; mobile stack alignment |
| `app/components/ui/card.tsx` | Optional: softer `cnCardClass` padding on small screens only if needed after card tasks |
| `package.json` | Gains `embla-carousel-react` when carousel is added |

### Current spacing audit (home.tsx tree)

| Component | Current section class | Target |
|-----------|----------------------|--------|
| `hero.tsx` | `py-12` | Keep `py-12` (hero exception) |
| `globe.tsx` | `py-24` | `landingSectionClass` |
| `about.tsx` | `pt-12 pb-24` | `landingSectionClass` |
| `posts.tsx` | `py-24` | `landingSectionClass` |
| `videos.tsx` | `py-12` | `landingSectionClass` |
| `testimonials.tsx` | `pt-[30px] pb-[130px]` | `landingSectionClass` |
| `social-wall.tsx` | `py-12` | `landingSectionClass` |
| `join.tsx` | `py-12` | `landingSectionClass` |

---

### Task 1: Shared landing shell constants

**Files:**
- Create: `app/components/home/landing-shell.ts`
- Modify: none yet (consumed in later tasks)

**Interfaces:**
- Consumes: nothing
- Produces:
  - `landingSectionClass: "py-24"`
  - `landingContainerClass: "max-w-(--cn-maxw) mx-auto px-4 md:px-8 relative z-2"`

- [ ] **Step 1: Create the shell module**

```ts
/** Shared vertical rhythm for home content sections. */
export const landingSectionClass = "py-24";

/** Shared max-width + horizontal gutters for home section interiors. */
export const landingContainerClass =
  "max-w-(--cn-maxw) mx-auto px-4 md:px-8 relative z-2";
```

- [ ] **Step 2: Verify the file exports cleanly**

Run: `npx tsc --noEmit --pretty false 2>&1 | head -40`  
(or full `npm run typecheck` if typegen is already warm)

Expected: no errors referencing `landing-shell.ts` (file is unused yet; that is fine).

- [ ] **Step 3: Commit**

```bash
git add app/components/home/landing-shell.ts
git commit -m "feat(home): add shared landing section spacing constants"
```

---

### Task 2: Normalize section spacing + gutters across home sections

**Files:**
- Modify: `app/components/home/about.tsx`
- Modify: `app/components/home/globe.tsx`
- Modify: `app/components/home/posts.tsx`
- Modify: `app/components/home/videos.tsx`
- Modify: `app/components/home/social-wall.tsx`
- Modify: `app/components/home/join.tsx`
- Modify: `app/components/home/hero.tsx` (container only; keep `py-12` on section)
- Modify: `app/components/home/testimonials.tsx` (spacing only in this task; carousel in Task 4)

**Interfaces:**
- Consumes: `landingSectionClass`, `landingContainerClass` from `./landing-shell`
- Produces: every home content section (except hero) uses `className={landingSectionClass}`; every section interior uses `landingContainerClass`

- [ ] **Step 1: Write the failing spacing check**

Run from repo root:

```bash
rg -n 'className="(py-12|pt-12 pb-24|pt-\[30px\] pb-\[130px\])"' \
  app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx
```

Expected: FAIL (matches found) — these are the classes we are removing from content sections.

- [ ] **Step 2: Update `about.tsx`**

Replace the section + container opening with:

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

// ...

<section id="about" className={landingSectionClass}>
  <div className={cn(landingContainerClass, "flex flex-col items-center text-center")}>
```

Remove the old `pt-12 pb-24` and `max-w-(--cn-maxw) mx-auto px-8 relative z-2` strings.

- [ ] **Step 3: Update `globe.tsx`**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section id="globe" ref={sectionRef} className={landingSectionClass}>
  <div className={landingContainerClass}>
    <div className="grid grid-cols-[1.05fr_1fr] max-nav:grid-cols-1 gap-8 md:gap-15 items-center">
```

Note: also change `gap-15` to `gap-8 md:gap-15` so mobile does not leave a huge empty band between copy and globe.

- [ ] **Step 4: Update `posts.tsx`**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section id="content" className={landingSectionClass}>
  <div className={landingContainerClass}>
```

- [ ] **Step 5: Update `videos.tsx`**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section className={landingSectionClass}>
  <div className={landingContainerClass}>
```

Remove the old `py-12` and `max-sm:px-4` split gutter.

- [ ] **Step 6: Update `social-wall.tsx`**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section className={landingSectionClass}>
  <div className={landingContainerClass}>
```

- [ ] **Step 7: Update `join.tsx`**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section id="join" className={landingSectionClass}>
  <div className={landingContainerClass}>
```

- [ ] **Step 8: Update `testimonials.tsx` spacing only**

```tsx
import { landingContainerClass, landingSectionClass } from "./landing-shell";

<section ref={sectionRef} className={landingSectionClass}>
  <div className={landingContainerClass}>
```

Leave the `columns-*` grid as-is for now.

- [ ] **Step 9: Update `hero.tsx` container only**

Keep section as:

```tsx
<section
  ref={sectionRef}
  className="flex flex-col justify-center py-12 overflow-hidden relative"
  id="top"
>
```

Replace the inner wrapper:

```tsx
import { landingContainerClass } from "./landing-shell";

<div className={landingContainerClass}>
```

Remove `px-4 md:p-0` so gutters match the rest of the page.

- [ ] **Step 10: Re-run the spacing check (must pass)**

```bash
rg -n 'className="(py-12|pt-12 pb-24|pt-\[30px\] pb-\[130px\])"' \
  app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx
```

Expected: no matches (exit code 1 from rg is success for "no matches" — confirm empty output).

Also confirm shell usage:

```bash
rg -n 'landingSectionClass' app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx
```

Expected: one hit per file (import or usage; at least 2 lines each including import).

- [ ] **Step 11: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add app/components/home/about.tsx app/components/home/globe.tsx \
  app/components/home/posts.tsx app/components/home/videos.tsx \
  app/components/home/social-wall.tsx app/components/home/join.tsx \
  app/components/home/testimonials.tsx app/components/home/hero.tsx
git commit -m "fix(home): unify section py-24 rhythm and container gutters"
```

---

### Task 3: Add shadcn Carousel primitive

**Files:**
- Create: `app/components/ui/carousel.tsx` (CLI)
- Modify: `package.json` / lockfile (CLI adds `embla-carousel-react`)

**Interfaces:**
- Consumes: existing shadcn Button + `cn` utils (project already has them)
- Produces exports from `~/components/ui/carousel`:
  - `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselApi`

- [ ] **Step 1: Confirm carousel is missing**

Run: `ls app/components/ui/carousel.tsx`  
Expected: FAIL (No such file or directory)

- [ ] **Step 2: Install via shadcn CLI**

```bash
npx shadcn@latest add carousel --yes
```

Expected: creates `app/components/ui/carousel.tsx` and installs `embla-carousel-react`.

If the CLI prompts about overwriting, choose defaults that keep existing Button styles.

- [ ] **Step 3: Verify exports exist**

```bash
rg -n 'export \{' app/components/ui/carousel.tsx
rg -n 'embla-carousel-react' package.json
```

Expected: carousel file exports the Carousel family; `package.json` lists `embla-carousel-react`.

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/carousel.tsx package.json package-lock.json
git commit -m "feat(ui): add shadcn carousel primitive"
```

(If the lockfile name is `pnpm-lock.yaml` or `bun.lockb`, add that instead.)

---

### Task 4: Testimonials mobile carousel

**Files:**
- Modify: `app/components/home/testimonials.tsx`

**Interfaces:**
- Consumes: Carousel primitives from `~/components/ui/carousel`; existing `QuoteCard`; `landingSectionClass` / `landingContainerClass`
- Produces: below `md`, quotes render in a full-width carousel with prev/next + slide indicator; at `md+`, existing CSS columns masonry remains

- [ ] **Step 1: Confirm desktop masonry still present (baseline)**

```bash
rg -n 'columns-3' app/components/home/testimonials.tsx
```

Expected: one match (current desktop layout).

- [ ] **Step 2: Implement responsive dual layout**

Replace the quotes container block (the `columns-3 ...` div and map) with:

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { useEffect, useState } from "react";

// inside LandingTestimonials, after headIn hooks:
const [api, setApi] = useState<CarouselApi>();
const [current, setCurrent] = useState(0);
const [count, setCount] = useState(0);

useEffect(() => {
  if (!api) return;
  setCount(api.scrollSnapList().length);
  setCurrent(api.selectedScrollSnap() + 1);
  const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
  api.on("select", onSelect);
  return () => {
    api.off("select", onSelect);
  };
}, [api]);

// in JSX, replace the columns div with:
{/* Mobile / tablet: carousel */}
<div className="mt-16 md:hidden">
  <Carousel
    setApi={setApi}
    opts={{ align: "start", loop: true }}
    className="w-full"
  >
    <CarouselContent>
      {QUOTES.map((q) => (
        <CarouselItem key={q.name} className="basis-full">
          <QuoteCard {...q} delay={0} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <div className="mt-6 flex items-center justify-between gap-4">
      <p className="font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
        {current} / {count}
      </p>
      <div className="flex items-center gap-2">
        <CarouselPrevious className="static translate-y-0 border-cn-line bg-cn-panel text-cn-text hover:bg-cn-panel-2" />
        <CarouselNext className="static translate-y-0 border-cn-line bg-cn-panel text-cn-text hover:bg-cn-panel-2" />
      </div>
    </div>
  </Carousel>
</div>

{/* Desktop: masonry columns */}
<div className="mt-16 hidden md:block columns-3 max-nav:columns-2 gap-[18px]">
  {QUOTES.map((q) => (
    <QuoteCard key={q.name} {...q} />
  ))}
</div>
```

Also tighten `QuoteCard` padding for small screens:

```tsx
"break-inside-avoid mb-[18px] border border-cn-line rounded-[20px] p-5 sm:p-7 flex flex-col gap-[18px] ..."
```

Merge the existing `useEffect` for analytics with the new carousel effect as separate hooks (do not nest). Keep the analytics `useEffect` unchanged.

Ensure `useEffect` / `useState` imports stay correct (file already imports `useEffect` from React; add `useState`).

- [ ] **Step 3: Verify dual layout markers**

```bash
rg -n 'md:hidden|hidden md:block|CarouselItem|columns-3' app/components/home/testimonials.tsx
```

Expected: all four patterns present.

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 5: Manual check (required)**

Run: `npm run dev`  
Open `/` at 375px width:
- Testimonials show one card at a time
- Prev/Next change the card
- Indicator updates (`1 / 6` …)
- No horizontal page scroll from the carousel

At 1280px:
- Masonry columns (3) still render
- Carousel DOM is hidden (`md:hidden`)

- [ ] **Step 6: Commit**

```bash
git add app/components/home/testimonials.tsx
git commit -m "feat(home): use carousel for testimonials on mobile"
```

---

### Task 5: Scale cards cleanly on mobile (posts, videos, metrics, join)

**Files:**
- Modify: `app/components/home/posts.tsx`
- Modify: `app/components/home/videos.tsx`
- Modify: `app/components/home/metric-card.tsx`
- Modify: `app/components/home/hero.tsx`
- Modify: `app/components/home/join.tsx`

**Interfaces:**
- Consumes: existing card layouts
- Produces: compact article/video rows stack below `sm`; metric featured card drops `row-span-2` below 620px; join CTAs do not wrap to 2+ lines at 375px

- [ ] **Step 1: Fix `CompactPost` mobile stack in `posts.tsx`**

Update `CompactPost` article + anchor classes:

```tsx
<article
  className={cn(
    cnCardClass,
    "p-4! sm:p-[22px_24px]! flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center group",
  )}
>
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
  >
    <div className="w-full sm:w-24 aspect-video sm:aspect-auto sm:h-24 rounded-2xl shrink-0 overflow-hidden border border-cn-line">
```

Also soften featured body padding:

```tsx
<div className="p-5 sm:p-8">
```

And featured image height:

```tsx
<div className="relative h-48 sm:h-90 shrink-0 overflow-hidden border-b border-cn-line bg-[#141417]">
```

- [ ] **Step 2: Fix `CompactVideo` mobile stack in `videos.tsx`**

```tsx
<article
  className={cn(
    videoCardClass,
    "p-4 sm:p-[18px_20px] flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center group",
  )}
>
  <a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
  >
    <VideoThumbnail
      video={video}
      className="w-full sm:w-42 rounded-xl border border-cn-line"
    />
```

Featured video body:

```tsx
<div className="p-5 sm:p-8">
```

- [ ] **Step 3: Fix metric featured span on single-column in `metric-card.tsx`**

In `sharedClassName`, change the featured branch:

```tsx
featured
  ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2 max-[620px]:row-span-1"
  : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
```

Also scale padding:

```tsx
"group relative border border-cn-line rounded-4xl p-5 sm:p-6 flex flex-col justify-between ..."
```

And featured number clamp so it does not blow past the viewport on 320–375px:

```tsx
featured
  ? "text-[clamp(56px,16vw,120px)]"
  : "text-[clamp(40px,12vw,64px)]",
```

- [ ] **Step 4: Fix hero metric grid min-height on mobile in `hero.tsx`**

```tsx
<div className="w-full grid gap-4 mt-12 sm:mt-16 grid-cols-[1.6fr_1fr_1fr] auto-rows-[minmax(140px,auto)] sm:auto-rows-[minmax(180px,auto)] max-[1080px]:grid-cols-[repeat(2,1fr)] max-[620px]:grid-cols-[1fr]">
```

Also soften the H1 on very small screens so it stays in viewport with subtext:

```tsx
<h1 className="font-display font-extrabold uppercase text-center leading-[0.85] sm:leading-[0.8] text-[clamp(48px,14vw,122px)] animate-cn-fade opacity-0 [animation-delay:0.5s] mt-6">
```

- [ ] **Step 5: Fix join platform CTAs for wrap in `join.tsx`**

Update the platform grid + button labels:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 relative">
```

(Prefer `sm:` over `max-nav:` here so phones always get one column; tablets get three when space allows.)

Shorten CTA strings so they fit one line at 375px:

```tsx
const PLATFORMS = [
  {
    name: "Newsletter",
    count: "50+ Readers",
    cta: "Subscribe",
    href: "https://circuitnation.substack.com/",
    red: true,
  },
  {
    name: "Reddit",
    count: "98K+ Visitors",
    cta: "Follow on Reddit",
    href: "https://www.reddit.com/r/circuit_nation/",
  },
  {
    name: "YouTube",
    count: "1.2K+ Subscribers",
    cta: "Subscribe on YouTube",
    href: "https://www.youtube.com/@circuit_nation",
  },
];
```

On the Button:

```tsx
className="mt-2 w-full whitespace-nowrap"
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 7: Manual check at 375px**

Confirm:
- Posts compact cards: image on top, text below (no crushed 96px thumb beside text)
- Videos compact cards: same
- Metric cards: full width, featured not leaving a blank second row gap
- Join: three stacked cards; each CTA is a single line

- [ ] **Step 8: Commit**

```bash
git add app/components/home/posts.tsx app/components/home/videos.tsx \
  app/components/home/metric-card.tsx app/components/home/hero.tsx \
  app/components/home/join.tsx
git commit -m "fix(home): make cards and CTAs scale cleanly on mobile"
```

---

### Task 6: Remaining mobile polish (nav clearance, social wall, footer)

**Files:**
- Modify: `app/components/home/race-marquee.tsx`
- Modify: `app/components/home/social-wall.tsx`
- Modify: `app/components/home/footer.tsx`
- Modify: `app/components/home/nav.tsx` (only if logo/gap needs tightening)

**Interfaces:**
- Consumes: existing components
- Produces: no horizontal overflow at 375px; footer stacks cleanly without em-dash; marquee clears the fixed nav; social tiles keep readable type

- [ ] **Step 1: Fix footer copy + stack**

Replace `footer.tsx` with:

```tsx
export default function LandingFooter() {
  return (
    <footer className="border-t border-cn-line bg-cn-bg-2">
      <div className="border-t border-cn-line max-w-(--cn-maxw) mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
        <span>
          © {new Date().getFullYear()} Circuit Nation - Built by fans, for fans.
        </span>
        <span>Not affiliated with any racing series or governing body.</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify zero em-dashes in home components**

```bash
rg -n '—|–' app/components/home/
```

Expected: no matches.

- [ ] **Step 3: Tighten marquee top offset under fixed nav**

In `race-marquee.tsx`, replace the outer class so mobile clearance matches the smaller logo:

```tsx
<div className="border-t border-b border-cn-line bg-cn-bg-2 mt-14 md:mt-26 my-4 overflow-hidden relative z-3">
```

(Keep `md:mt-26` for the large desktop logo.)

- [ ] **Step 4: Social wall mobile tile type**

In `SocialSlotTile`, ensure the bottom title never overflows:

```tsx
<h3
  className={cn(
    "font-display font-bold leading-[1.15] tracking-[-0.01em] line-clamp-3",
    wide
      ? "text-[clamp(18px,2.2vw,28px)]"
      : isTallSlot(slotId)
        ? "text-[clamp(16px,1.8vw,22px)]"
        : "text-[15px]",
  )}
>
```

And use shared container gutters already applied in Task 2. Optionally reduce play button size on mobile:

```tsx
<div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full ...">
```

inside `PlayMini`.

- [ ] **Step 5: Nav mobile gap (only if About / logo / Connect wrap)**

If at 320–375px the three nav items wrap to two lines, change:

```tsx
<div className="max-w-(--cn-maxw) mx-auto py-2 px-4 flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
```

and keep logo:

```tsx
<Logo className="size-12 md:size-24" />
```

Do not change nav labels or routes.

- [ ] **Step 6: Final typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 7: Final spacing regression check**

```bash
rg -n 'landingSectionClass' app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx | wc -l
rg -n 'className="(py-12|pt-12 pb-24|pt-\[30px\] pb-\[130px\])"' \
  app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx
```

Expected: first command count >= 14 (import + usage per file); second command empty.

- [ ] **Step 8: Full manual viewport checklist**

At **375px**, **768px**, and **1280px** on `/`:

1. No horizontal scrollbar on the page
2. Section bands look evenly spaced (`py-24` content sections)
3. Hero metrics readable; featured card not leaving a hole
4. Globe: copy then globe stack on mobile; cards full width
5. Posts / videos: featured full width; compact cards stacked
6. Testimonials: carousel < 768; masonry >= 768
7. Social wall: single column tiles, titles not clipped oddly
8. Join: stacked cards, single-line CTAs
9. Footer: stacked on mobile, hyphen not em-dash
10. Nav stays one line

- [ ] **Step 9: Commit**

```bash
git add app/components/home/footer.tsx app/components/home/race-marquee.tsx \
  app/components/home/social-wall.tsx app/components/home/nav.tsx
git commit -m "fix(home): polish mobile overflow, footer, and nav clearance"
```

(Only add `nav.tsx` if Step 5 changed it.)

---

## Self-Review

1. **Spec coverage**
   - Uniform `py-24` → Tasks 1–2
   - Mobile responsive overall → Tasks 2, 5, 6
   - Cards scale down → Task 5
   - Testimonials → shadcn carousel → Tasks 3–4
   - Other mobile improvements (gutters, footer, marquee, social, join CTAs, metric span) → Tasks 2, 5, 6

2. **Placeholder scan:** no TBD / "implement later" / "add validation" left.

3. **Type consistency:** `landingSectionClass` / `landingContainerClass` names are stable across tasks; Carousel API names match shadcn docs (`setApi`, `CarouselApi`, `CarouselItem`).

4. **Out of scope confirmed:** `proof.tsx`, `collab.tsx`, `amas.tsx` unused by `home.tsx`; no redesign of brand colors or desktop masonry beyond preserving it.

---

## Manual QA cheat sheet (executor)

```bash
npm run dev
# Chrome DevTools device toolbar:
# iPhone SE (375), iPad (768), Desktop (1280)
```

Spacing grep (must stay clean after Task 2):

```bash
rg -n 'className="(py-12|pt-12 pb-24|pt-\[30px\] pb-\[130px\])"' \
  app/components/home/{about,globe,posts,videos,testimonials,social-wall,join}.tsx
```
