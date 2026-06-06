# Tailwind Token Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded CSS values (inline rgba colors, `var(--cn-*)` style props, legacy arbitrary `max-w-[var(...)]` syntax, inline `transitionTimingFunction`) across all `app/components/` files with their proper Tailwind v4 utility class equivalents.

**Architecture:** All brand/theme tokens already exist in `app/app.css` (`:root` + `@theme inline`). Changes are purely at the component layer — no new tokens needed except `--color-cn-accent-glow`. The pattern throughout is: extract inline `style={{}}` color/opacity/timing values into className strings using Tailwind's opacity modifier syntax (`token/opacity`), CSS-variable shorthand (`max-w-(--var)`), and `ease-spring` utility (generated from the existing `--ease-spring` `@theme` token).

**Tech Stack:** Tailwind CSS v4.1, React/TSX, `cn()` utility from `~/lib/utils`

---

## Token Reference (app/app.css)

The following tokens are available as Tailwind utility classes via `@theme inline`:

| CSS Var | Tailwind class prefix | Value |
|---|---|---|
| `--cn-bg` | `bg-cn-bg`, `text-cn-bg` | `#0a0a0b` |
| `--cn-bg-2` | `bg-cn-bg-2` | `#0d0d0f` |
| `--cn-panel` | `bg-cn-panel` | `#111114` |
| `--cn-panel-2` | `bg-cn-panel-2` | `#161619` |
| `--cn-accent` | `bg-cn-accent`, `text-cn-accent`, `border-cn-accent` | `#ff2d2d` |
| `--cn-accent-deep` | `bg-cn-accent-deep` | `#c81616` |
| `--cn-orange` | `bg-cn-orange`, `text-cn-orange`, `border-cn-orange` | `#ff5a1f` |
| `--cn-line` | `border-cn-line` | `rgba(255,255,255,0.08)` |
| `--cn-line-strong` | `border-cn-line-strong` | `rgba(255,255,255,0.16)` |
| `--cn-text` | `text-cn-text` | `#f4f4f5` |
| `--cn-muted` | `text-cn-muted` | `#a1a1aa` |
| `--cn-muted-2` | `text-cn-muted-2` | `#6b6b73` |
| `--ease-spring` | `ease-spring` | `cubic-bezier(.16,1,.3,1)` |

**Important:** `--cn-line` and `--cn-line-strong` already include opacity baked in — do NOT add an opacity modifier (`/XX`) to them. Only add `/XX` to solid-color tokens (`--cn-bg`, `--cn-accent`, `--cn-orange`).

**Missing token:** `--cn-accent-glow: rgba(255,45,45,0.55)` is defined in `:root` but not in `@theme inline`. Task 1 adds it.

---

## Patterns Being Replaced

| Before | After | Notes |
|---|---|---|
| `max-w-[var(--cn-maxw)]` | `max-w-(--cn-maxw)` | Tailwind v4 CSS-var shorthand |
| `style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}` | `ease-spring` in className | Token already in `@theme` |
| `style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(26px)" }}` | `cn(inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")` | Conditional className |
| `bg-[rgba(10,10,11,0.72)]` | `bg-cn-bg/72` | Token + opacity modifier |
| `bg-[rgba(255,45,45,0.14)]` | `bg-cn-accent/14` | Token + opacity modifier |
| `border-[rgba(255,45,45,0.3)]` | `border-cn-accent/30` | Token + opacity modifier |
| `bg-[rgba(255,90,31,0.12)]` | `bg-cn-orange/12` | Token + opacity modifier |
| `style={{ color: "var(--cn-accent)" }}` | `text-cn-accent` in className | Remove style prop |
| `shadow-[..._var(--cn-accent-glow)]` | `shadow-[..._(--cn-accent-glow)]` | v4 CSS-var shorthand in arbitrary |

**Do NOT change:**
- `style={{ backgroundImage: "linear-gradient(...)" }}` — complex gradients must stay inline
- `style={{ transform: "perspective(...)..." }}` — complex 3D transforms stay inline
- `style={{ top: hour * HOUR_HEIGHT }}` — JS-computed values stay inline
- `style={{ transitionDelay: `${delay}s` }}` — dynamic values stay inline
- `style={{ padding: "clamp(40px,6vw,80px)" }}` — clamp values stay inline

---

## Task 1: Add `--color-cn-accent-glow` to `@theme inline`

**Files:**
- Modify: `app/app.css:129-219`

- [ ] **Step 1: Add the missing token**

In `app/app.css`, inside the `@theme inline { ... }` block (around line 169, after `--color-cn-accent-deep`), add:

```css
  --color-cn-accent-glow: var(--cn-accent-glow);
```

So the block reads:
```css
  --color-cn-accent: var(--cn-accent);
  --color-cn-accent-deep: var(--cn-accent-deep);
  --color-cn-accent-glow: var(--cn-accent-glow);   /* ← add this line */
  --color-cn-text: var(--cn-text);
```

- [ ] **Step 2: Verify the token resolves**

Run: `pnpm dev` and open the browser. No build errors expected. The token is referenced-only; adding it to `@theme inline` makes it usable as `bg-cn-accent-glow` / `shadow-[...(--color-cn-accent-glow)]` if needed.

- [ ] **Step 3: Commit**

```bash
git add app/app.css
git commit -m "feat: add --color-cn-accent-glow to @theme inline"
```

---

## Task 2: Update `reveal.tsx` — remove inline transition styles

**Files:**
- Modify: `app/components/home/reveal.tsx`

This component is the shared scroll-reveal wrapper used in ~10 call sites. Fixing it here cascades everywhere.

- [ ] **Step 1: Write the updated component**

Replace the entire file content with:

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function Reveal({ children, delay = 0, className, threshold = 0.15 }: RevealProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-800 ease-spring",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
```

Key changes:
- Added `ease-spring` to className (removes need for `transitionTimingFunction` inline)
- Moved `opacity` and `transform` to conditional className
- `style` is now only set when `delay > 0` (pure Tailwind otherwise)

- [ ] **Step 2: Verify in browser**

Start dev server (`pnpm dev`). Visit the landing page and scroll — all `<Reveal>` wrapped elements should still animate in smoothly.

- [ ] **Step 3: Commit**

```bash
git add app/components/home/reveal.tsx
git commit -m "refactor: remove inline transition styles from Reveal, use ease-spring + conditional className"
```

---

## Task 3: Standardize `max-w-[var(--cn-maxw)]` → `max-w-(--cn-maxw)` 

The v4 CSS-variable shorthand `(--var)` is the canonical way. Two files already use it correctly. Ten do not.

**Files to modify** (one grep-and-replace each):
- `app/components/home/landing-proof.tsx:76`
- `app/components/home/landing-hero.tsx:129`
- `app/components/home/landing-globe.tsx:109`
- `app/components/home/landing-collab.tsx:22,58`
- `app/components/home/landing-join.tsx:21`
- `app/components/home/landing-posts.tsx:20`
- `app/components/home/landing-testimonials.tsx:62`
- `app/components/home/landing-social-wall.tsx:79`
- `app/components/home/landing-videos.tsx:36`
- `app/components/home/landing-what.tsx:46`
- `app/components/home/landing-footer.tsx:4`

- [ ] **Step 1: Replace in all files at once**

```bash
cd /path/to/cn-client
grep -rl 'max-w-\[var(--cn-maxw)\]' app/components | xargs sed -i '' 's/max-w-\[var(--cn-maxw)\]/max-w-(--cn-maxw)/g'
```

- [ ] **Step 2: Verify no occurrences remain**

```bash
grep -r 'max-w-\[var(--cn-maxw)\]' app/components
```

Expected: no output.

- [ ] **Step 3: Verify layout unchanged in browser**

Open the landing page. All sections should still be constrained to 1320px max-width.

- [ ] **Step 4: Commit**

```bash
git add app/components/home/landing-proof.tsx app/components/home/landing-hero.tsx app/components/home/landing-globe.tsx app/components/home/landing-collab.tsx app/components/home/landing-join.tsx app/components/home/landing-posts.tsx app/components/home/landing-testimonials.tsx app/components/home/landing-social-wall.tsx app/components/home/landing-videos.tsx app/components/home/landing-what.tsx app/components/home/landing-footer.tsx
git commit -m "refactor: standardize max-w-[var(--cn-maxw)] to max-w-(--cn-maxw) v4 syntax"
```

---

## Task 4: Convert section header animation inline styles to className

These are scattered across 8 components. Each has the same pattern:

```tsx
// BEFORE
<div
  ref={headRef}
  className="max-w-[...] transition-[opacity,transform] duration-800"
  style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
>
```

```tsx
// AFTER
<div
  ref={headRef}
  className={cn("max-w-[...] transition-[opacity,transform] duration-800 ease-spring", headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}
>
```

**Files:**

### `landing-amas.tsx:55-57`

- [ ] **Step 1: Apply the pattern**

```tsx
// BEFORE (lines 53-57):
<div
  ref={headRef}
  className="max-w-180 transition-[opacity,transform] duration-800"
  style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
>

// AFTER:
<div
  ref={headRef}
  className={cn(
    "max-w-180 transition-[opacity,transform] duration-800 ease-spring",
    headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
>
```

Note: also ensure `cn` is imported (it already is in this file).

### `landing-proof.tsx:78-81`

- [ ] **Step 2: Apply the pattern**

```tsx
// BEFORE:
<div
  ref={headRef}
  className="max-w-2xl transition-[opacity,transform] duration-800"
  style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
>

// AFTER:
<div
  ref={headRef}
  className={cn(
    "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
    headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
>
```

### `landing-testimonials.tsx:63-67`

- [ ] **Step 3: Apply the pattern**

```tsx
// BEFORE:
<div
  ref={headRef}
  className="max-w-2xl transition-[opacity,transform] duration-800"
  style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
>

// AFTER:
<div
  ref={headRef}
  className={cn(
    "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
    headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
>
```

Note: add `cn` import — `import { cn } from "~/lib/utils";` (already present in this file).

### `landing-collab.tsx` (line ~26), `landing-posts.tsx` (line ~24), `landing-what.tsx` (line ~51), `landing-social-wall.tsx` (line ~83), `landing-videos.tsx` (line ~40)

- [ ] **Step 4: Apply the same pattern to all five remaining section heads**

In each file, find the `<div ref={headRef} ... style={{ opacity: headIn ? 1 : 0, ... }}>` block and apply the same conversion: remove the `style` prop entirely and merge `ease-spring` + `cn(headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")` into className.

### `landing-proof.tsx` MetricCard component (lines 38-51)

This card also has a `style` with `opacity`, `transform`, `transitionTimingFunction`, AND a dynamic `transitionDelay`. Only the delay stays in `style`.

- [ ] **Step 5: Update MetricCard**

```tsx
// BEFORE:
<div
  ref={ref}
  className={cn(
    "border border-cn-line rounded-[20px] p-[30px] flex flex-col justify-between transition-[opacity,transform] duration-800",
    featured ? "bg-[linear-gradient(...)] row-span-2" : "bg-linear-to-b ...",
  )}
  style={{
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(26px)",
    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
    transitionDelay: `${delay}s`,
  }}
>

// AFTER:
<div
  ref={ref}
  className={cn(
    "border border-cn-line rounded-[20px] p-[30px] flex flex-col justify-between transition-[opacity,transform] duration-800 ease-spring",
    featured ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2" : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
  style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
>
```

### `landing-testimonials.tsx` QuoteCard (lines 22-35)

- [ ] **Step 6: Update QuoteCard**

```tsx
// BEFORE:
<div
  ref={ref}
  className={cn("break-inside-avoid mb-[18px] border border-cn-line rounded-[20px] p-7 flex flex-col gap-[18px] transition-[opacity,transform] duration-800", ...)}
  style={{
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(26px)",
    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
    transitionDelay: delay > 0 ? `${delay}s` : undefined,
  }}
>

// AFTER:
<div
  ref={ref}
  className={cn(
    "break-inside-avoid mb-[18px] border border-cn-line rounded-[20px] p-7 flex flex-col gap-[18px] transition-[opacity,transform] duration-800 ease-spring",
    highlight ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.12),rgba(255,255,255,0.004))]" : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
  style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
>
```

### `landing-join.tsx` (line 22-31)

This one has `padding: "clamp(40px,6vw,80px)"` that must stay in `style`.

- [ ] **Step 7: Update landing-join.tsx**

```tsx
// BEFORE:
<div
  ref={ref}
  className="border border-cn-line rounded-[28px] relative overflow-hidden bg-[linear-gradient(...)] transition-[opacity,transform] duration-800"
  style={{
    padding: "clamp(40px,6vw,80px)",
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(26px)",
    transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
  }}
>

// AFTER:
<div
  ref={ref}
  className={cn(
    "border border-cn-line rounded-[28px] relative overflow-hidden bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] transition-[opacity,transform] duration-800 ease-spring",
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  )}
  style={{ padding: "clamp(40px,6vw,80px)" }}
>
```

- [ ] **Step 8: Verify all animations still work in browser**

Scroll the landing page from top to bottom. All sections should fade+rise into view. No section should be permanently hidden.

- [ ] **Step 9: Commit**

```bash
git add app/components/home/landing-amas.tsx app/components/home/landing-proof.tsx app/components/home/landing-testimonials.tsx app/components/home/landing-collab.tsx app/components/home/landing-posts.tsx app/components/home/landing-what.tsx app/components/home/landing-social-wall.tsx app/components/home/landing-videos.tsx app/components/home/landing-join.tsx
git commit -m "refactor: replace inline transitionTimingFunction with ease-spring, opacity/transform with conditional className"
```

---

## Task 5: Replace `bg-[rgba(10,10,11,...)]` with `bg-cn-bg/XX`

`#0a0a0b` is `--cn-bg`. Use `bg-cn-bg/XX` where XX is the opacity as a 0–100 integer.

**Files:**

### `landing-nav.tsx:23`

```tsx
// BEFORE:
"border-cn-line bg-[rgba(10,10,11,0.72)] backdrop-blur-[18px] saturate-[1.4]"

// AFTER:
"border-cn-line bg-cn-bg/72 backdrop-blur-[18px] saturate-[1.4]"
```

### `landing-nav.tsx:75`

```tsx
// BEFORE:
className="bg-[rgba(10,10,11,0.95)] backdrop-blur-[20px] border-t border-cn-line ..."

// AFTER:
className="bg-cn-bg/95 backdrop-blur-[20px] border-t border-cn-line ..."
```

### `landing-join.tsx:47`

```tsx
// BEFORE:
"... bg-[rgba(10,10,11,0.5)] transition-[transform,border-color] ..."

// AFTER:
"... bg-cn-bg/50 transition-[transform,border-color] ..."
```

- [ ] **Step 1: Apply all three replacements above**

- [ ] **Step 2: Verify nav blur and platform card backgrounds look correct in browser**

- [ ] **Step 3: Commit**

```bash
git add app/components/home/landing-nav.tsx app/components/home/landing-join.tsx
git commit -m "refactor: replace bg-[rgba(10,10,11,...)] with bg-cn-bg/XX opacity modifier"
```

---

## Task 6: Replace `bg-[rgba(255,45,45,...)]` and `border-[rgba(255,45,45,...)]` with accent token + opacity

`#ff2d2d` is `--cn-accent`.

**Files:**

### `landing-amas.tsx` — Badge component (lines 33–35)

```tsx
// BEFORE:
type === "live" && "bg-[rgba(255,45,45,0.14)] text-[#ff7676] border border-[rgba(255,45,45,0.3)]",
type === "up" && "bg-[rgba(255,90,31,0.12)] text-cn-orange border border-[rgba(255,90,31,0.28)]",

// AFTER:
type === "live" && "bg-cn-accent/14 text-[#ff7676] border border-cn-accent/30",
type === "up" && "bg-cn-orange/12 text-cn-orange border border-cn-orange/28",
```

Note: `text-[#ff7676]` stays as arbitrary — it's a lighter accent variant with no token.

### `landing-proof.tsx` — MetricCard (line 42)

```tsx
// BEFORE:
featured ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2"

// AFTER:
featured ? "bg-[linear-gradient(160deg,color-mix(in_oklch,var(--color-cn-accent)_14%,transparent),rgba(255,255,255,0.004))] row-span-2"
```

Wait — `linear-gradient` arbitrary values can't directly use `bg-cn-accent/14` shorthand. Use `color-mix` OR keep the original rgba value inside the gradient. The rgba value here is fine to keep as-is inside the gradient string since the token/opacity modifier only works with single-property color utilities.

**Decision:** Keep gradient strings with `rgba(255,45,45,X)` as-is where they appear inside `linear-gradient(...)` strings — replacing them would add complexity without clarity. Only replace standalone `bg-[rgba(...)]` and `border-[rgba(...)]` classes.

### `landing-testimonials.tsx` — QuoteCard (line 27)

Same situation — gradient string, leave as-is.

### `landing-join.tsx` (line 32)

```tsx
// BEFORE:
<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_400px_at_85%_10%,rgba(255,45,45,0.22),transparent_60%)]" />

// AFTER: leave as-is — rgba inside radial-gradient string
```

### `landing-social-wall.tsx` — YouTube play button (line 27)

```tsx
// BEFORE:
className="w-14 h-14 rounded-full bg-[rgba(255,45,45,0.92)] grid place-items-center ..."

// AFTER:
className="w-14 h-14 rounded-full bg-cn-accent/92 grid place-items-center ..."
```

### `landing-videos.tsx` — PlayButton (line 11)

```tsx
// BEFORE:
className="rounded-full bg-[rgba(255,45,45,0.92)] grid place-items-center ..."

// AFTER:
className="rounded-full bg-cn-accent/92 grid place-items-center ..."
```

- [ ] **Step 1: Apply the four standalone replacements** (Badge in landing-amas, play buttons in landing-social-wall and landing-videos)

- [ ] **Step 2: Verify badge colors and play buttons look correct in browser**

- [ ] **Step 3: Commit**

```bash
git add app/components/home/landing-amas.tsx app/components/home/landing-social-wall.tsx app/components/home/landing-videos.tsx
git commit -m "refactor: replace standalone rgba color arbitrary values with token/opacity modifiers"
```

---

## Task 7: Replace inline `style={{ color: "var(--cn-accent)" }}` with className

**File:** `app/components/home/landing-hero.tsx:140-145`

The hero title renders three text spans, one with `variant === "accent"`. Currently uses `style={{ color: "var(--cn-accent)" }}`.

- [ ] **Step 1: Replace inline color with conditional className**

```tsx
// BEFORE:
<span
  className="block animate-cn-rise"
  style={{
    transform: "translateY(105%)",
    animationDelay: `${i * 0.08}s`,
    ...(variant === "outline" ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" } : {}),
    ...(variant === "accent" ? { color: "var(--cn-accent)" } : {}),
  }}
>

// AFTER:
<span
  className={cn(
    "block animate-cn-rise",
    variant === "accent" && "text-cn-accent",
  )}
  style={{
    transform: "translateY(105%)",
    animationDelay: `${i * 0.08}s`,
    ...(variant === "outline" ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" } : {}),
  }}
>
```

Note: `cn` is not imported in `landing-hero.tsx` — add the import: `import { cn } from "~/lib/utils";`

Note: the `outline` variant keeps color/WebkitTextStroke in style since `-webkit-text-stroke` has no Tailwind utility.

- [ ] **Step 2: Verify hero title renders correctly**

The hero title words "One nation." / "Every" / "circuit." — "circuit." should be red (`--cn-accent`). Verify in browser.

- [ ] **Step 3: Commit**

```bash
git add app/components/home/landing-hero.tsx
git commit -m "refactor: replace inline color var(--cn-accent) with text-cn-accent class in hero title"
```

---

## Task 8: Update `landing-social-wall.tsx` platform color map

**File:** `app/components/home/landing-social-wall.tsx:10-11`

The `colors` map currently stores CSS variable strings that get applied as `style={{ background: colors[plat] }}`. Convert to a Tailwind class map instead.

- [ ] **Step 1: Convert color map to className map**

```tsx
// BEFORE:
const colors: Record<string, string> = {
  yt: "var(--cn-accent)",
  reddit: "var(--cn-orange)",
  ig: "#E1306C",
  x: "#1DA1F2",
};

// ...
<span className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: colors[plat] }} />

// AFTER:
const platformDotClass: Record<string, string> = {
  yt: "bg-cn-accent",
  reddit: "bg-cn-orange",
  ig: "bg-[#E1306C]",
  x: "bg-[#1DA1F2]",
};

// ...
<span className={cn("w-2 h-2 rounded-[2px] shrink-0", platformDotClass[plat])} />
```

Remove the `style={{ background: colors[plat] }}` prop.

- [ ] **Step 2: Verify platform dot colors in browser**

The social wall tiles should show colored dots: red for YouTube, orange for Reddit, pink for Instagram, blue for X.

- [ ] **Step 3: Commit**

```bash
git add app/components/home/landing-social-wall.tsx
git commit -m "refactor: replace inline style color map with Tailwind className map for social platform dots"
```

---

## Task 9: Update `shadow-[..._var(--cn-accent-glow)]` to v4 shorthand

Tailwind v4 supports `(--variable)` shorthand in arbitrary values for CSS custom properties.

**Files:**
- `app/components/home/section-eyebrow.tsx:14`
- `app/components/home/landing-globe.tsx:50,141,145`
- `app/components/home/landing-hero.tsx:77`
- `app/components/home/landing-videos.tsx:11`
- `app/components/home/landing-loader.tsx:29`
- `app/components/home/landing-what.tsx:92`

The pattern `shadow-[0_0_8px_var(--cn-accent-glow)]` → `shadow-[0_0_8px_(--cn-accent-glow)]`

- [ ] **Step 1: Replace all occurrences**

```bash
grep -rl 'var(--cn-accent-glow)' app/components | xargs sed -i '' 's/var(--cn-accent-glow)/(--cn-accent-glow)/g'
```

- [ ] **Step 2: Verify no `var(--cn-accent-glow)` remains in className strings**

```bash
grep -rn 'className.*var(--cn-accent-glow)' app/components
```

Expected: no output. (Inline style occurrences in backgroundImage strings are OK to leave.)

- [ ] **Step 3: Verify glow effects still visible in browser**

Check: the red glow on eyebrow accent lines, the race ticker dots, the globe accent dots, the play button shadow, and the loader progress bar shadow.

- [ ] **Step 4: Commit**

```bash
git add app/components/home/section-eyebrow.tsx app/components/home/landing-globe.tsx app/components/home/landing-hero.tsx app/components/home/landing-videos.tsx app/components/home/landing-loader.tsx app/components/home/landing-what.tsx
git commit -m "refactor: update var(--cn-accent-glow) in className strings to v4 CSS-var shorthand (--cn-accent-glow)"
```

---

## Task 10: Also update `var(--cn-line)` and `var(--cn-accent)` in className strings

There are a few remaining places where `var(--cn-*)` references appear inside className strings (not inline styles). These should use the v4 shorthand too.

**Files:**
- `app/components/home/landing-nav.tsx:31` — `bg-[linear-gradient(...,var(--cn-accent),...)]`
- `app/components/home/landing-footer.tsx:8` — `bg-[linear-gradient(...,var(--cn-accent),...)]`
- `app/components/home/landing-hero.tsx:120` — `backgroundImage` in style prop — **leave as-is** (inline style)

For gradient strings containing `var(--cn-accent)`, use the v4 shorthand inside the gradient:

```tsx
// BEFORE (landing-nav.tsx:31):
"bg-[linear-gradient(120deg,transparent_38%,var(--cn-accent)_40%,var(--cn-accent)_46%,transparent_48%,transparent_54%,var(--cn-accent)_56%,var(--cn-accent)_62%,transparent_64%)]"

// AFTER:
"bg-[linear-gradient(120deg,transparent_38%,(--cn-accent)_40%,(--cn-accent)_46%,transparent_48%,transparent_54%,(--cn-accent)_56%,(--cn-accent)_62%,transparent_64%)]"
```

- [ ] **Step 1: Apply the gradient CSS-var shorthand in landing-nav.tsx (line 31)**

- [ ] **Step 2: Apply the same in landing-footer.tsx (line 8)**

- [ ] **Step 3: Verify the CN logo mark still shows the red diagonal stripes in browser**

- [ ] **Step 4: Commit**

```bash
git add app/components/home/landing-nav.tsx app/components/home/landing-footer.tsx
git commit -m "refactor: update var(--cn-accent) inside gradient className strings to v4 shorthand"
```

---

## Self-Review Checklist

After all tasks are complete, verify:

- [ ] No `max-w-[var(--cn-maxw)]` remains: `grep -r 'max-w-\[var(--cn-maxw)\]' app/components` → empty
- [ ] No `transitionTimingFunction.*cubic-bezier(.16` remains in className strings: `grep -r 'transitionTimingFunction' app/components` → only inline styles with dynamic values
- [ ] No `bg-\[rgba(10,10,11` remains as standalone class: `grep -r 'bg-\[rgba(10,10,11' app/components` → empty  
- [ ] No `bg-\[rgba(255,45,45` remains as standalone class: `grep -r 'bg-\[rgba(255,45,45' app/components` → empty (gradient strings OK)
- [ ] No `border-\[rgba(255,45,45` remains: `grep -r 'border-\[rgba(255,45,45' app/components` → empty
- [ ] Landing page loads, loader animates out, hero fade-in works, scroll reveals work, nav blur triggers
- [ ] Platform colored dots show correct colors in social wall
- [ ] Hero title "circuit." is red
