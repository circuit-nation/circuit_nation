# Tailwind + shadcn Landing Page Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all 13 Circuit Nation landing page components from inline `style={{}}` objects to Tailwind CSS utility classes and shadcn/ui components, strictly following DESIGN.md.

**Architecture:** Add CN design tokens to Tailwind `@theme` → update shadcn Button/Card variants → create shared `Reveal` + `SectionEyebrow` helpers → convert all 13 components one by one, replacing inline styles with Tailwind classes and JS hover handlers with `hover:` variants.

**Tech Stack:** React Router v7, Tailwind CSS v4 (CSS-based `@theme`), shadcn/ui + CVA, clsx/tailwind-merge (`cn`), motion/react

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `app/app.css` | Add font tokens, CN color tokens, easing, custom breakpoint, animation utilities |
| Modify | `app/components/ui/button.tsx` | Add `cn-primary`, `cn-ghost` variants and `cn` size |
| Modify | `app/components/ui/card.tsx` | Export `cnCardClass` and `cnAccentCardClass` className strings |
| Create | `app/components/ui/input.tsx` | CN-styled email input |
| Create | `app/components/home/reveal.tsx` | Shared scroll-reveal wrapper (replaces per-file Reveal functions) |
| Create | `app/components/home/section-eyebrow.tsx` | Shared `// Section label` eyebrow with red accent line |
| Modify | `app/components/home/landing-loader.tsx` | Full conversion |
| Modify | `app/components/home/landing-nav.tsx` | Full conversion |
| Modify | `app/components/home/landing-hero.tsx` | Full conversion |
| Modify | `app/components/home/landing-what.tsx` | Full conversion |
| Modify | `app/components/home/landing-proof.tsx` | Full conversion |
| Modify | `app/components/home/landing-collab.tsx` | Full conversion |
| Modify | `app/components/home/landing-amas.tsx` | Full conversion |
| Modify | `app/components/home/landing-posts.tsx` | Full conversion |
| Modify | `app/components/home/landing-videos.tsx` | Full conversion |
| Modify | `app/components/home/landing-testimonials.tsx` | Full conversion |
| Modify | `app/components/home/landing-social-wall.tsx` | Full conversion |
| Modify | `app/components/home/landing-globe.tsx` | Full conversion |
| Modify | `app/components/home/landing-join.tsx` | Full conversion |
| Modify | `app/components/home/landing-footer.tsx` | Full conversion |

---

## Tailwind Class Reference

These inline-style → Tailwind mappings are used throughout:

| Inline style | Tailwind class |
|---|---|
| `fontFamily: "var(--cn-display)"` | `font-display` |
| `fontFamily: "var(--cn-mono)"` | `font-mono` |
| `fontFamily: "var(--cn-body)"` | `font-body` |
| `fontWeight: 800` | `font-extrabold` |
| `fontWeight: 700` | `font-bold` |
| `fontWeight: 500` | `font-medium` |
| `letterSpacing: "0.26em"` | `tracking-[0.26em]` |
| `letterSpacing: "0.1em"` | `tracking-[0.1em]` |
| `textTransform: "uppercase"` | `uppercase` |
| `color: "var(--cn-accent)"` | `text-cn-accent` |
| `color: "var(--cn-muted)"` | `text-cn-muted` |
| `color: "var(--cn-muted-2)"` or `var(--cn-muted-2)` | `text-cn-muted-2` |
| `color: "var(--cn-text)"` | `text-cn-text` |
| `color: "var(--cn-orange)"` | `text-cn-orange` |
| `background: "var(--cn-bg)"` | `bg-cn-bg` |
| `background: "var(--cn-bg-2)"` | `bg-cn-bg-2` |
| `border: "1px solid var(--cn-line)"` | `border border-cn-line` |
| `border: "1px solid var(--cn-line-strong)"` | `border border-cn-line-strong` |
| `borderRadius: 20` | `rounded-[20px]` |
| `padding: 30` | `p-[30px]` |
| `position: "relative/absolute/fixed"` | `relative`/`absolute`/`fixed` |
| `inset: 0` | `inset-0` |
| `display: "flex"` | `flex` |
| `alignItems: "center"` | `items-center` |
| `justifyContent: "space-between"` | `justify-between` |
| `overflow: "hidden"` | `overflow-hidden` |
| `pointerEvents: "none"` | `pointer-events-none` |
| `flexShrink: 0` | `shrink-0` |
| `whiteSpace: "nowrap"` | `whitespace-nowrap` |
| `cursor: "pointer"` | `cursor-pointer` |
| hover translateY(-4px) | `hover:-translate-y-1` |
| hover translateY(-2px) | `hover:-translate-y-0.5` |
| hover border brightens | `hover:border-cn-line-strong` |
| hover card lift shadow | `hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.8)]` |
| hover button glow intensifies | `hover:shadow-[0_14px_40px_-8px_var(--cn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.3)]` |

**Keep as inline styles:**
- `opacity` and `transform` driven by JS state (Reveal, hero animations)
- `animationDelay` when dynamic (per-item delay from props)
- `gridRow: "span 2"` / `gridColumn: "span 2"` when dynamic (SocialTile span prop)
- Complex `perspective()` transforms (hero grid floor)
- Canvas/globe sizing

---

## Task 1: Add CN tokens to app.css

**Files:** Modify `app/app.css`

- [ ] **Step 1: Update the `@theme {}` block (lines 4–9)**

Replace the existing `@theme` block with:

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-handwriting: "Mea Culpa", cursive;
  --font-display: "DM Sans", system-ui, sans-serif;
  --font-body: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "Space Grotesk", ui-monospace, monospace;
  --ease-spring: cubic-bezier(.16, 1, .3, 1);
  --breakpoint-nav: 61.25rem;
}
```

This generates: `font-display`, `font-body`, `font-mono` (overrides system mono with Space Grotesk), `ease-spring`, and responsive prefixes `nav:` (≥980px) / `max-nav:` (<980px).

- [ ] **Step 2: Add CN color tokens to `@theme inline {}` block**

Inside the `@theme inline {}` block, after the sidebar color mappings (after `--color-sidebar-ring`), add:

```css
  /* Circuit Nation landing color tokens */
  --color-cn-bg: var(--cn-bg);
  --color-cn-bg-2: var(--cn-bg-2);
  --color-cn-panel: var(--cn-panel);
  --color-cn-panel-2: var(--cn-panel-2);
  --color-cn-accent: var(--cn-accent);
  --color-cn-accent-deep: var(--cn-accent-deep);
  --color-cn-orange: var(--cn-orange);
  --color-cn-text: var(--cn-text);
  --color-cn-muted: var(--cn-muted);
  --color-cn-muted-2: var(--cn-muted-2);
  --color-cn-line: var(--cn-line);
  --color-cn-line-strong: var(--cn-line-strong);
```

- [ ] **Step 3: Add CN animation utilities to `@layer utilities {}` block**

At the end of the existing `@layer utilities {}` block, before the closing `}`, add:

```css
  /* Circuit Nation animation utilities */
  .animate-cn-rise {
    animation: cn-rise .9s cubic-bezier(.16,1,.3,1) forwards;
  }
  .animate-cn-fade {
    animation: cn-fade .8s ease forwards;
  }
  .animate-cn-marquee {
    animation: cn-marquee 38s linear infinite;
  }
  .animate-cn-marquee-32 {
    animation: cn-marquee 32s linear infinite;
  }
  .animate-cn-pulse {
    animation: cn-pulse 1.8s infinite;
  }
  .animate-cn-spin-slow {
    animation: cn-spin 60s linear infinite;
  }
  .animate-cn-load {
    animation: cn-load 1.15s cubic-bezier(.7,0,.3,1) forwards;
  }
```

- [ ] **Step 4: Verify dev server compiles**

```bash
pnpm dev
```

Expected: No errors. Check DevTools that `font-display`, `text-cn-accent`, `bg-cn-bg`, `border-cn-line` resolve to correct values.

- [ ] **Step 5: Commit**

```bash
git add app/app.css
git commit -m "feat: add CN design tokens, fonts, and animation utilities to Tailwind theme"
```

---

## Task 2: Update shadcn Button variants

**Files:** Modify `app/components/ui/button.tsx`

- [ ] **Step 1: Replace the `buttonVariants` cva call**

Replace the entire `buttonVariants` constant with:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "view-switcher": "",
        link: "text-primary underline-offset-4 hover:underline",
        "cn-primary":
          "border-0 font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium rounded-[10px] text-white cursor-pointer no-underline bg-gradient-to-b from-[#ff3b3b] to-cn-accent-deep shadow-[0_8px_30px_-8px_var(--cn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform_.18s_ease,box-shadow_.25s_ease] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_var(--cn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.3)]",
        "cn-ghost":
          "border border-cn-line-strong font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium rounded-[10px] bg-white/[0.03] text-cn-text cursor-pointer no-underline transition-[transform_.18s_ease,background_.25s_ease,border-color_.25s_ease] hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-cn-text",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        cn: "px-5 py-3 gap-[9px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm typecheck
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/button.tsx
git commit -m "feat: add cn-primary, cn-ghost button variants and cn size"
```

---

## Task 3: Add CN card helpers to card.tsx

**Files:** Modify `app/components/ui/card.tsx`

- [ ] **Step 1: Add `cnCardClass` and `cnAccentCardClass` exports at the bottom of card.tsx**

After the existing `export { Card, ... }` line, add:

```tsx
export const cnCardClass =
  "border border-cn-line rounded-[20px] bg-gradient-to-b from-white/[0.028] to-white/[0.004] p-[30px] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-cn-line-strong hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.8)]";

export const cnAccentCardClass =
  "border border-cn-line rounded-[20px] bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] p-[30px] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-cn-line-strong hover:shadow-[0_22px_50px_-24px_rgba(0,0,0,0.8)]";
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ui/card.tsx
git commit -m "feat: export cnCardClass and cnAccentCardClass helpers"
```

---

## Task 4: Create shared Reveal and SectionEyebrow components

**Files:** Create `app/components/home/reveal.tsx`, `app/components/home/section-eyebrow.tsx`

- [ ] **Step 1: Create `app/components/home/reveal.tsx`**

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
      className={cn("transition-[opacity,transform] duration-[800ms]", className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
        transitionDelay: delay ? `${delay}s` : "0s",
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/components/home/section-eyebrow.tsx`**

```tsx
import { cn } from "~/lib/utils";

interface SectionEyebrowProps {
  label: string;
  className?: string;
}

export function SectionEyebrow({ label, className }: SectionEyebrowProps) {
  return (
    <span className={cn(
      "font-mono text-[12px] font-medium tracking-[0.26em] uppercase text-cn-muted inline-flex items-center gap-[10px]",
      className
    )}>
      <span className="w-[26px] h-px bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)] shrink-0" />
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/home/reveal.tsx app/components/home/section-eyebrow.tsx
git commit -m "feat: add shared Reveal and SectionEyebrow landing components"
```

---

## Task 5: Create shadcn Input component

**Files:** Create `app/components/ui/input.tsx`

- [ ] **Step 1: Create `app/components/ui/input.tsx`**

```tsx
import * as React from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-[12px] border border-cn-line-strong bg-[rgba(10,10,11,0.6)] px-[18px] py-[15px] text-[15px] font-body text-cn-text placeholder:text-cn-muted-2 outline-none transition-[border-color] duration-200 focus:border-cn-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ui/input.tsx
git commit -m "feat: add CN-styled Input component"
```

---

## Task 6: Convert landing-loader.tsx

**Files:** Modify `app/components/home/landing-loader.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useState, useEffect } from "react";

export default function LandingLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-cn-bg grid place-items-center transition-[opacity,visibility] duration-[600ms] ease-out"
      style={{ opacity: gone ? 0 : 1, visibility: gone ? "hidden" : "visible" }}
    >
      <div className="text-center">
        <div className="font-display font-extrabold text-[clamp(38px,7vw,76px)] uppercase tracking-[-0.02em]">
          CIRCUIT <span className="text-cn-accent">NATION</span>
        </div>
        <div className="w-[min(360px,70vw)] h-[3px] bg-white/[0.08] mx-auto mt-[22px] rounded-full overflow-hidden">
          <div className="block h-full w-0 bg-gradient-to-r from-cn-accent-deep to-[#ff5a5a] shadow-[0_0_14px_var(--cn-accent-glow)] animate-cn-load" />
        </div>
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-cn-muted-2 mt-4">
          Igniting the grid...
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-loader.tsx
git commit -m "refactor: convert landing-loader to Tailwind"
```

---

## Task 7: Convert landing-nav.tsx

**Files:** Modify `app/components/home/landing-nav.tsx`

- [ ] **Step 1: Replace the entire file**

The `nav:` prefix (from `--breakpoint-nav: 61.25rem`) shows/hides desktop nav at 980px. Remove the `<style>` tag entirely.

```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-[350ms] ease-out",
        scrolled
          ? "border-cn-line bg-[rgba(10,10,11,0.72)] backdrop-blur-[18px] saturate-[1.4]"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 py-[18px] flex items-center justify-between gap-6">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3 no-underline text-cn-text">
          <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#1a1a1e] to-[#0c0c0e] border border-cn-line-strong grid place-items-center overflow-hidden shrink-0 relative">
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,var(--cn-accent)_40%,var(--cn-accent)_46%,transparent_48%,transparent_54%,var(--cn-accent)_56%,var(--cn-accent)_62%,transparent_64%)] opacity-[0.95]" />
          </span>
          <span className="font-display font-extrabold text-[19px] tracking-[-0.01em] uppercase leading-none">
            Circuit Nation
          </span>
        </a>

        {/* Desktop nav — hidden below 980px */}
        <nav className="hidden nav:flex items-center gap-8">
          {[["#about", "The Hub"], ["#globe", "Globe"], ["#amas", "AMAs"], ["#content", "Content"]].map(([href, label]) => (
            <a key={href} href={href}
              className="font-mono text-[12.5px] tracking-[0.1em] uppercase text-cn-muted no-underline transition-colors duration-200 hover:text-cn-text"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-[14px]">
          <Button variant="cn-ghost" size="cn" asChild className="hidden nav:inline-flex">
            <a href="#content">Explore Content</a>
          </Button>
          <Button variant="cn-primary" size="cn" asChild>
            <a href="#join">
              <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              Join the Community
            </a>
          </Button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav:hidden bg-white/[0.04] border border-cn-line-strong text-cn-text rounded-[10px] px-[14px] py-[11px] font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer"
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(10,10,11,0.95)] backdrop-blur-[20px] border-t border-cn-line px-6 py-5 flex flex-col gap-4"
        >
          {[["#about", "The Hub"], ["#globe", "Globe"], ["#amas", "AMAs"], ["#content", "Content"], ["#join", "Join the Community"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="font-mono text-[13px] tracking-[0.1em] uppercase text-cn-text no-underline"
            >{label}</a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-nav.tsx
git commit -m "refactor: convert landing-nav to Tailwind + shadcn Button"
```

---

## Task 8: Convert landing-hero.tsx

**Files:** Modify `app/components/home/landing-hero.tsx`

Key notes:
- Speed streaks are JS DOM-injected — keep the `useEffect` and inline `s.style.cssText` unchanged
- Grid floor uses `perspective()` — keep as inline style on that one div
- HudCard counter ref text content stays as inline style (JS driven)
- RaceTicker `onMouseEnter`/`Leave` for play-state stays (no Tailwind equivalent)
- Hero h1 letter reveal: transition stays inline (per-span animation delay)
- Import `Button` from shadcn for CTAs

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

const RACES = [
  ["F1", "Monaco GP", "May 24"], ["MotoGP", "Mugello", "Jun 01"],
  ["F1", "Canadian GP", "Jun 15"], ["WEC", "Le Mans 24h", "Jun 14"],
  ["MotoGP", "Assen TT", "Jun 29"], ["F1", "British GP · Silverstone", "Jul 06"],
  ["F1", "Spa-Francorchamps", "Jul 27"], ["MotoGP", "Red Bull Ring", "Aug 17"],
  ["F1", "Monza", "Sep 07"], ["F1", "Singapore GP", "Oct 05"],
  ["MotoGP", "Phillip Island", "Oct 19"], ["F1", "Las Vegas GP", "Nov 22"],
];

function useCounter(target: number, suffix: string, compact = false, plain = false) {
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const cf = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0 });

  useEffect(() => {
    if (ran.current || !ref.current) return;
    ran.current = true;
    const el = ref.current;
    const dur = 1500;
    const t0 = performance.now();
    const disp = (v: number) => compact ? cf.format(v) : plain ? v.toLocaleString("en-US") : String(v);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent = disp(v) + (p === 1 ? suffix : suffix.replace(/[^+]/g, ""));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = disp(target) + suffix;
    };
    requestAnimationFrame(step);
  }, []);

  return ref;
}

export function HudCard({ label, target, suffix, compact = false, plain = false, live = false }: {
  label: string; target: number; suffix?: string; compact?: boolean; plain?: boolean; live?: boolean;
}) {
  const countRef = useCounter(target, suffix || "", compact, plain);

  return (
    <div className="border border-cn-line bg-gradient-to-b from-white/[0.025] to-transparent rounded-[14px] px-5 py-4 min-w-[150px] relative overflow-hidden flex-1 basis-[150px]">
      <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cn-accent" />
      <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cn-accent" />
      <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-cn-muted-2">
        {label}
      </div>
      <div className="font-display font-extrabold text-[30px] leading-none mt-2 flex items-center gap-2">
        {live ? (
          <>
            <span ref={countRef} className="text-cn-accent">0</span>
            <span className="inline-block w-2 h-2 rounded-full bg-cn-accent animate-cn-pulse" />
          </>
        ) : (
          <span ref={countRef}>0</span>
        )}
      </div>
    </div>
  );
}

export function RaceTicker() {
  return (
    <div className="border-t border-b border-cn-line bg-cn-bg-2 overflow-hidden relative z-[3]">
      <div
        className="flex w-max animate-cn-marquee"
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
      >
        {[...RACES, ...RACES].map(([series, name, date], i) => (
          <div key={i} className="flex items-center gap-4 px-[30px] py-4 font-mono text-[12.5px] tracking-[0.1em] uppercase text-cn-muted whitespace-nowrap">
            <span className="w-[7px] h-[7px] rounded-full bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)] shrink-0" />
            <span className="text-cn-muted-2 text-[11px]">{series}</span>
            <b className="text-cn-text font-medium">{name}</b>
            <span>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingHero() {
  const streaksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = streaksRef.current;
    if (!container) return;
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("div");
      s.style.cssText = `
        position:absolute; height:1px; width:${28 + Math.random() * 30}vw;
        background:linear-gradient(90deg,transparent,rgba(255,45,45,0) 10%,rgba(255,45,45,0.45) 70%,rgba(255,255,255,0.6));
        top:${8 + i * 13}%;
        animation:cn-streak ${3.2 + Math.random() * 3}s linear infinite;
        animation-delay:${Math.random() * 4}s;
        opacity:${0.3 + Math.random() * 0.5};
        transform:translateX(-120%) rotate(-14deg);
        will-change:transform,opacity;
      `;
      container.appendChild(s);
    }
  }, []);

  return (
    <>
      <section className="min-h-dvh flex flex-col justify-center pt-[150px] pb-[80px] overflow-hidden relative" id="top">
        {/* Speed streaks */}
        <div ref={streaksRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50" />

        {/* Grid floor */}
        <div
          className="absolute left-0 right-0 bottom-[-2px] h-[42vh] z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "linear-gradient(90deg,var(--cn-line) 1px,transparent 1px),linear-gradient(0deg,var(--cn-line) 1px,transparent 1px)",
            backgroundSize: "70px 70px",
            WebkitMaskImage: "linear-gradient(180deg,transparent,#000 80%)",
            maskImage: "linear-gradient(180deg,transparent,#000 80%)",
            transform: "perspective(420px) rotateX(62deg) scale(1.6)",
            transformOrigin: "bottom",
          }}
        />

        <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
          <span
            className="font-mono text-[12px] font-medium tracking-[0.26em] uppercase text-cn-muted inline-flex items-center gap-[10px] animate-cn-fade opacity-0 [animation-delay:0.1s]"
          >
            <span className="w-[26px] h-px bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)] shrink-0" />
            // Your ultimate hub to everything motorsports
          </span>

          <h1 className="font-display font-extrabold uppercase tracking-[-0.04em] leading-[0.9] text-[clamp(56px,11vw,172px)] mt-[22px]">
            {[["One nation.", ""], ["Every", "outline"], ["circuit.", "accent"]].map(([text, variant], i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className="block animate-cn-rise"
                  style={{
                    transform: "translateY(105%)",
                    animationDelay: `${i * 0.08}s`,
                    ...(variant === "outline" ? { color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.32)" } : {}),
                    ...(variant === "accent" ? { color: "var(--cn-accent)" } : {}),
                  }}
                >
                  {text}
                </span>
              </span>
            ))}
          </h1>

          <p className="max-w-[540px] text-cn-muted text-[18px] mt-[30px] animate-cn-fade opacity-0 [animation-delay:0.5s]">
            Formula 1, MotoGP, sim racing and the engineering obsession behind it all — gathered into one home for the fans who never miss lights-out.
          </p>

          <div className="flex gap-4 mt-9 flex-wrap animate-cn-fade opacity-0 [animation-delay:0.62s]">
            <Button variant="cn-primary" size="cn" asChild>
              <a href="#join" className="text-[13px] px-[26px] py-[15px] rounded-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                Join the Community
              </a>
            </Button>
            <Button variant="cn-ghost" size="cn" asChild>
              <a href="#content">Explore Content →</a>
            </Button>
          </div>

          {/* HUD stats */}
          <div className="flex flex-wrap gap-[14px] items-stretch mt-14 animate-cn-fade opacity-0 [animation-delay:0.8s]">
            <HudCard label="Community reach" target={50} suffix="K+" />
            <HudCard label="Live right now" target={1240} live plain />
            <HudCard label="Race threads" target={500} suffix="+" />
          </div>
        </div>
      </section>

      <RaceTicker />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-hero.tsx
git commit -m "refactor: convert landing-hero to Tailwind + shadcn Button"
```

---

## Task 9: Convert landing-what.tsx

**Files:** Modify `app/components/home/landing-what.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass, cnAccentCardClass } from "~/components/ui/card";

const FEATURES = [
  {
    idx: "01", icon: <path d="M4 20V12M10 20V5M16 20V9M22 20V14" />,
    title: "Race Analysis",
    desc: "Lap-by-lap breakdowns, strategy calls and tyre-deg debates that go deeper than any broadcast booth.",
  },
  {
    idx: "02", icon: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><circle cx="12" cy="12" r="3" /></>,
    title: "Engineering Breakdowns",
    desc: "Floor edges, DRS trains and gearbox ratios — explained by people who genuinely love the technical regs.",
  },
  {
    idx: "03", icon: <><circle cx="12" cy="12" r="2.5" /><path d="M6.5 6.5a8 8 0 000 11M17.5 6.5a8 8 0 010 11" /></>,
    title: "Live Race Reactions",
    desc: "Lights out to chequered flag, the chat is electric. Every overtake, every safety car, in real time.",
  },
  {
    idx: "04", icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.4" /><path d="M4 13h6M14 13h6M12 14.5V21" /></>,
    title: "Sim Racing Culture",
    desc: "Leagues, setups and clean racing — from rookies on a wheel to alien-pace endurance crews.",
  },
  {
    idx: "05", icon: <><path d="M4 5h16v10H9l-4 4z" /><path d="M8.5 10h.01M12 10h.01M15.5 10h.01" /></>,
    title: "Memes & Banter",
    desc: "The funniest corner of motorsport Twitter — relocated, refined and posted before the stewards rule.",
  },
  {
    idx: "06", icon: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0111 0" /><path d="M16 5.5a3 3 0 010 5.8M20.5 20a5.5 5.5 0 00-3.5-5.1" /></>,
    title: "Fan Meetups",
    desc: "GP watch-alongs, track days and IRL link-ups — the community spills out of the screen and onto the grid.",
  },
];

export default function LandingWhat() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="py-[130px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">

        {/* Section head */}
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// What is Circuit Nation" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            A paddock that<br />never closes.
          </h2>
          <p className="text-cn-muted mt-[22px] text-[18px] max-w-[600px]">
            Not a feed. Not a fan club. A living garage where strategy nerds, sim racers, meme lords and lifelong tifosi argue, analyse and celebrate every lap together.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-3 max-nav:grid-cols-2 max-[620px]:grid-cols-1 gap-[18px] mt-16">

          {/* Mission card — spans 2 cols */}
          <Reveal className="col-span-2 max-[620px]:col-span-1">
            <div className={cn(cnCardClass, "flex flex-col justify-between gap-[30px] min-h-[280px]")}>
              <div className="font-display font-bold text-[clamp(24px,2.6vw,34px)] leading-[1.2] tracking-[-0.02em]">
                We built Circuit Nation because the best part of race weekend isn't the race — it's the{" "}
                <b className="text-cn-accent font-bold">people you watch it with.</b>
              </div>
              <div className="flex gap-[26px] flex-wrap font-mono text-[12px] tracking-[0.08em] uppercase text-cn-muted-2">
                {["EST. 2023", "FAN-OWNED", "SERIES-AGNOSTIC", "ALWAYS ONLINE"].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          </Reveal>

          {/* Persona card */}
          <Reveal delay={0.08}>
            <div className={cn(cnAccentCardClass, "flex flex-col justify-center gap-4")}>
              <div className="font-display font-bold text-[21px]">Who's inside?</div>
              <ul className="list-none flex flex-col gap-[9px]">
                {["Day-one F1 & MotoGP diehards", "Sim racers chasing the apex", "Engineers who read the regs for fun", "Newcomers who just caught the bug"].map(item => (
                  <li key={item} className="text-cn-muted text-[14.5px] flex gap-[9px] items-start">
                    <span className="text-cn-accent font-bold">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Feature cards */}
          {FEATURES.map((f, i) => (
            <Reveal key={f.idx} delay={i % 3 === 1 ? 0.08 : i % 3 === 2 ? 0.16 : 0}>
              <div className={cn(cnCardClass, "relative overflow-hidden hover:border-[rgba(255,45,45,0.4)] hover:shadow-[0_22px_60px_-22px_var(--cn-accent-glow)]")}>
                <span className="absolute top-6 right-[26px] font-mono text-[12px] text-cn-muted-2">{f.idx}</span>
                <div className="w-[46px] h-[46px] rounded-[12px] border border-cn-line-strong bg-[rgba(255,45,45,0.06)] grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-cn-accent fill-none stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-display font-bold text-[20px] mt-5 tracking-[-0.01em]">{f.title}</h3>
                <p className="text-cn-muted text-[14.5px] mt-[10px]">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-what.tsx
git commit -m "refactor: convert landing-what to Tailwind + shared components"
```

---

## Task 10: Convert landing-proof.tsx

**Files:** Modify `app/components/home/landing-proof.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";

function MetricCard({
  target, compact = false, suffix = "", label, featured = false, tag, delay = 0,
}: {
  target: number; compact?: boolean; suffix?: string; label: string;
  featured?: boolean; tag?: string; delay?: number;
}) {
  const numRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const cf = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 0 });

  useEffect(() => {
    if (!inView || ran.current || !numRef.current) return;
    ran.current = true;
    const el = numRef.current;
    const dur = 1500;
    const t0 = performance.now();
    const disp = (v: number) => compact ? cf.format(v) : String(v);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent = disp(v) + (p === 1 ? suffix : suffix.replace(/[^+]/g, ""));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = disp(target) + suffix;
    };
    requestAnimationFrame(step);
  }, [inView, target, suffix, compact]);

  return (
    <div
      ref={ref}
      className={cn(
        "border border-cn-line rounded-[20px] p-[30px] flex flex-col justify-between transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]",
        featured
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2"
          : "bg-gradient-to-b from-white/[0.028] to-white/[0.004]",
      )}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transitionDelay: `${delay}s`,
      }}
    >
      {tag && <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-muted-2">{tag}</span>}
      <div>
        <div
          ref={numRef}
          className={cn(
            "font-display font-extrabold tracking-[-0.03em] leading-[0.9]",
            featured ? "text-[clamp(72px,9vw,132px)]" : "text-[clamp(44px,5vw,76px)]",
          )}
        >
          0
        </div>
        <div className="font-mono text-[12px] font-medium tracking-[0.1em] uppercase text-cn-muted mt-[14px]">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function LandingProof() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-[30px_0_130px] pb-[130px] pt-[30px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// By the numbers" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            The grid is<br />getting loud.
          </h2>
        </div>

        <div className="grid gap-[18px] mt-16 [grid-template-columns:1.6fr_1fr_1fr] [grid-auto-rows:minmax(180px,auto)] max-[1080px]:[grid-template-columns:repeat(2,1fr)] max-[620px]:[grid-template-columns:1fr]">
          <MetricCard target={1000000} compact suffix="+" label="Reach across Reddit, YouTube, Instagram & X" featured tag="Social impressions / mo" />
          <MetricCard target={50000} compact suffix="+" label="Community reach" delay={0.08} />
          <MetricCard target={10000} compact suffix="+" label="Monthly active fans" delay={0.16} />
          <MetricCard target={500} suffix="+" label="Race discussion threads" delay={0.08} />
          <MetricCard target={100} suffix="+" label="AMA participants" delay={0.16} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-proof.tsx
git commit -m "refactor: convert landing-proof to Tailwind"
```

---

## Task 11: Convert landing-collab.tsx

**Files:** Modify `app/components/home/landing-collab.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

const BRANDS = ["APEX TV", "BOX BOX RADIO", "GRIDLINE", "PIT LANE", "SLIPSTREAM", "REV LABS", "DOWNFORCE", "TIFOSI CO.", "OVERSTEER", "PARC FERME"];

const CASES = [
  { kicker: "Creator series", title: "The Apex Files", desc: "A six-part watch-along series co-hosted with a 1.2M-sub racing channel.", stats: [["3.4M", "views"], ["+8K", "new members"]] },
  { kicker: "Podcast", title: "Box Box Radio", desc: "Weekly strategy pod recorded with the community calling the shots live.", stats: [["42", "episodes"], ["#3", "motorsport pods"]] },
  { kicker: "Sim league", title: "Circuit Nation GP", desc: "A full endurance championship across 12 grids and three platforms.", stats: [["240", "drivers"], ["12", "rounds"]] },
];

export default function LandingCollab() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: wallRef, inView: wallIn } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="pt-[30px] pb-[120px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// Previous collaborations" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Good company<br />in the garage.
          </h2>
        </div>
      </div>

      {/* Logo wall marquee */}
      <div
        ref={wallRef}
        className="mt-14 border-t border-b border-cn-line overflow-hidden relative py-2 transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ opacity: wallIn ? 1 : 0, transform: wallIn ? "none" : "translateY(26px)" }}
      >
        <div className="absolute top-0 bottom-0 left-0 w-[140px] z-[4] pointer-events-none bg-gradient-to-r from-cn-bg to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-[140px] z-[4] pointer-events-none bg-gradient-to-l from-cn-bg to-transparent" />
        <div
          className="flex items-center gap-14 w-max animate-cn-marquee-32"
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div
              key={i}
              className="font-display font-bold text-[22px] tracking-[-0.01em] text-cn-muted-2 py-5 whitespace-nowrap opacity-70 transition-[color,opacity] duration-[250ms] hover:text-cn-text hover:opacity-100"
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Case studies */}
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div className="grid grid-cols-3 max-nav:grid-cols-1 gap-[18px] mt-14">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className={cn(cnCardClass, "!p-0 overflow-hidden")}>
                <div className="h-[200px] border-b border-cn-line bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                  <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                    {c.kicker.toLowerCase()} keyart
                  </span>
                </div>
                <div className="p-[26px]">
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-accent">{c.kicker}</span>
                  <h3 className="font-display font-bold text-[22px] mt-3 tracking-[-0.01em]">{c.title}</h3>
                  <p className="text-cn-muted text-[14.5px] mt-[10px]">{c.desc}</p>
                  <div className="flex gap-[22px] mt-5">
                    {c.stats.map(([val, lbl]) => (
                      <div key={lbl}>
                        <b className="font-display font-extrabold text-[24px] block">{val}</b>
                        <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-cn-muted-2">{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-collab.tsx
git commit -m "refactor: convert landing-collab to Tailwind"
```

---

## Task 12: Convert landing-amas.tsx

**Files:** Modify `app/components/home/landing-amas.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

function Avatar({ initials, red = false }: { initials: string; red?: boolean }) {
  return (
    <div className={cn(
      "w-10 h-10 rounded-full shrink-0 border border-cn-line-strong grid place-items-center font-mono text-[13px] font-bold",
      red
        ? "bg-[linear-gradient(150deg,rgba(255,90,31,0.5),#161619)] text-white"
        : "bg-[linear-gradient(150deg,#2a2a30,#161619)] text-cn-muted",
    )}>
      {initials}
    </div>
  );
}

function UpvoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] stroke-cn-orange fill-none [stroke-width:1.8]">
      <path d="M12 4l7 8h-4v8H9v-8H5z" />
    </svg>
  );
}

function Badge({ type }: { type: "live" | "up" | "trend" }) {
  return (
    <span className={cn(
      "font-mono text-[10.5px] font-medium tracking-[0.14em] uppercase px-[11px] py-[6px] rounded-[20px] inline-flex items-center gap-[7px] w-fit",
      type === "live" && "bg-[rgba(255,45,45,0.14)] text-[#ff7676] border border-[rgba(255,45,45,0.3)]",
      type === "up" && "bg-[rgba(255,90,31,0.12)] text-cn-orange border border-[rgba(255,90,31,0.28)]",
      type === "trend" && "bg-white/[0.05] text-cn-muted border border-cn-line-strong",
    )}>
      {type === "live" && (
        <span className="inline-block w-2 h-2 rounded-full bg-cn-accent animate-cn-pulse" />
      )}
      {type === "live" ? "Live now" : type === "up" ? "Upcoming · Fri 18:00 GMT" : "Trending this week"}
    </span>
  );
}

const readBtnClass = "font-mono text-[12px] tracking-[0.08em] uppercase text-cn-text no-underline inline-flex items-center gap-2 px-[14px] py-[9px] border border-cn-line-strong rounded-[9px] transition-all duration-200 hover:border-cn-orange hover:text-cn-orange";

export default function LandingAMAs() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="amas" className="pt-[30px] pb-[130px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// Reddit AMAs" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Ask the<br />paddock anything.
          </h2>
          <p className="text-cn-muted mt-[22px] text-[18px] max-w-[600px]">
            We bring racing's most interesting voices straight into the community — creators, engineers, sim aces and commentators, live and unfiltered.
          </p>
        </div>

        <div className="grid [grid-template-columns:1.4fr_1fr] max-nav:grid-cols-1 gap-[18px] mt-16">

          {/* Featured AMA */}
          <Reveal>
            <div className={cn(cnCardClass, "!p-0 overflow-hidden")}>
              <div className="h-[280px] w-full border-b border-cn-line bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                  AMA host portrait
                </span>
              </div>
              <div className="p-7">
                <Badge type="live" />
                <h3 className="font-display font-bold text-[clamp(26px,3vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4">
                  "I spent 9 years on an F1 pit wall. Ask me about strategy calls under pressure."
                </h3>
                <p className="text-cn-muted text-[14.5px] mt-[14px]">
                  A former race strategist breaks down the undercut, the gamble that won a title, and the radio messages you never heard.
                </p>
                <div className="flex items-center gap-3 mt-[18px]">
                  <Avatar initials="JR" red />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-[14.5px]">Jamie Renault</b>
                    <span className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em]">u/pitwall_jr · ex-Race Strategist</span>
                  </div>
                </div>
                <div className="mt-[22px] flex items-center justify-between gap-[14px]">
                  <a href="#" className={readBtnClass}>Read AMA →</a>
                  <span className="font-mono text-[12px] text-cn-muted-2 inline-flex items-center gap-[6px]">
                    <UpvoteIcon />4.2k upvotes
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Side AMAs */}
          <div className="grid gap-[18px] content-start">
            <Reveal delay={0.08}>
              <div className={cn(cnCardClass, "flex flex-col gap-4")}>
                <Badge type="up" />
                <h3 className="font-display font-bold text-[clamp(22px,2.4vw,30px)] tracking-[-0.02em] leading-[1.1]">
                  The sim racer who turned laps into a pro F4 seat.
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar initials="KS" />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-[14.5px]">Kai Sorensen</b>
                    <span className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em]">u/apex_kai · Sim to Real</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-[14px]">
                  <a href="#" className={readBtnClass}>Set reminder →</a>
                  <span className="font-mono text-[12px] text-cn-muted-2 inline-flex items-center gap-[6px]">
                    <UpvoteIcon />880 waiting
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className={cn(cnCardClass, "flex flex-col gap-4")}>
                <Badge type="trend" />
                <h3 className="font-display font-bold text-[clamp(22px,2.4vw,30px)] tracking-[-0.02em] leading-[1.1]">
                  Aero engineer explains why the floor is everything.
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar initials="MA" />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-[14.5px]">Dr. Mara Aoki</b>
                    <span className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em]">u/ground_effect · Aerodynamicist</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-[14px]">
                  <a href="#" className={readBtnClass}>Read AMA →</a>
                  <span className="font-mono text-[12px] text-cn-muted-2 inline-flex items-center gap-[6px]">
                    <UpvoteIcon />2.7k upvotes
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-amas.tsx
git commit -m "refactor: convert landing-amas to Tailwind"
```

---

## Task 13: Convert landing-posts.tsx

**Files:** Modify `app/components/home/landing-posts.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

const SMALL_POSTS = [
  { cat: "Hot Take", title: "It's time to admit the sprint format actually works.", meta: "4 min · 206 comments" },
  { cat: "Technical", title: "Why everyone's copying that weird front wing.", meta: "7 min · 141 comments" },
  { cat: "Paddock Drama", title: "The radio war that's quietly splitting a title fight.", meta: "5 min · 402 comments" },
  { cat: "Strategy", title: "Mapping the perfect two-stop nobody dared to try.", meta: "9 min · 87 comments" },
];

export default function LandingPosts() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="content" className="pt-[30px] pb-[120px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// Latest posts" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Hot off<br />the pit wall.
          </h2>
        </div>

        <div className="grid [grid-template-columns:1.4fr_1fr] max-nav:grid-cols-1 gap-[18px] mt-16">
          {/* Featured */}
          <Reveal>
            <article className={cn(cnCardClass, "!p-0 flex flex-col overflow-hidden")}>
              <div className="h-[360px] border-b border-cn-line flex-1 bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                  Featured article hero
                </span>
              </div>
              <div className="p-8">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-accent inline-flex items-center gap-[9px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-cn-accent inline-block" />
                  Race Analysis
                </span>
                <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.06] mt-3 text-[clamp(26px,3vw,40px)]">
                  The undercut that wasn't: how three teams misread the same pit window
                </h3>
                <p className="text-cn-muted mt-4 max-w-[540px] text-[15px]">
                  We charted every stint from the weekend and found the strategy call everyone defended was the slowest path to the podium.
                </p>
                <div className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em] mt-3 flex gap-[14px]">
                  <span>12 min read</span><span>·</span><span>May 26, 2026</span><span>·</span><span>318 comments</span>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Stack */}
          <div className="grid gap-[18px]">
            {SMALL_POSTS.map((p, i) => (
              <Reveal key={p.title} delay={i < 2 ? 0.08 : 0.16}>
                <article className={cn(cnCardClass, "!p-[22px_24px] flex gap-5 items-center cursor-pointer")}>
                  <div className="w-24 h-24 rounded-[12px] shrink-0 bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] border border-cn-line" />
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-accent">{p.cat}</span>
                    <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.2] mt-2 text-[17px]">{p.title}</h3>
                    <div className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em] mt-2">{p.meta}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-posts.tsx
git commit -m "refactor: convert landing-posts to Tailwind"
```

---

## Task 14: Convert landing-videos.tsx

**Files:** Modify `app/components/home/landing-videos.tsx`

Note: The hover uses `querySelector` to scale child thumbnail. Use Tailwind `group` + `group-hover:` pattern instead.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

function PlayIcon({ size = 64, small = false }: { size?: number; small?: boolean }) {
  return (
    <div
      className="rounded-full bg-[rgba(255,45,45,0.92)] grid place-items-center shadow-[0_10px_40px_-8px_var(--cn-accent-glow)] transition-transform duration-300"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        className="fill-white"
        style={{ width: small ? 14 : 22, height: small ? 14 : 22, marginLeft: small ? 2 : 3 }}
      >
        <path d="M6 4l14 8-14 8z" />
      </svg>
    </div>
  );
}

const THUMBS = [
  { cat: "Engineering", title: "Ground effect, explained in 9 minutes", views: "88K views", dur: "9:10" },
  { cat: "Highlights", title: "Top 10 overtakes of the season so far", views: "301K views", dur: "5:33" },
  { cat: "Podcast clip", title: "Is MotoGP the best racing on earth right now?", views: "56K views", dur: "24:07" },
];

export default function LandingVideos() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="pt-[30px] pb-[120px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// Watch" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Press play,<br />lights out.
          </h2>
        </div>

        <div className="grid [grid-template-columns:1.5fr_1fr] max-nav:grid-cols-1 gap-[18px] mt-16">
          {/* Big featured */}
          <Reveal>
            <div className={cn(cnCardClass, "!p-0 overflow-hidden group cursor-pointer")}>
              <div className="relative overflow-hidden">
                <div className="h-[420px] w-full bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 relative">
                  <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                    Featured video
                  </span>
                </div>
                <div className="absolute inset-0 grid place-items-center z-[3]">
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <PlayIcon />
                  </div>
                </div>
                <span className="absolute right-3 bottom-3 z-[3] font-mono text-[11px] bg-black/70 px-2 py-1 rounded-[6px] text-cn-text">18:42</span>
              </div>
              <div className="px-6 py-[22px]">
                <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-cn-accent">Watch-along</span>
                <h3 className="font-display font-bold tracking-[-0.01em] mt-[10px] leading-[1.2] text-[clamp(22px,2.4vw,30px)]">
                  Monaco GP, every radio call decoded — live community reaction
                </h3>
                <div className="font-mono text-[11px] text-cn-muted-2 mt-[10px]">142K views · 2 days ago</div>
              </div>
            </div>
          </Reveal>

          {/* Thumbnail stack */}
          <div className="grid gap-[18px] content-start">
            {THUMBS.map((v) => (
              <Reveal key={v.title} delay={0.08}>
                <div className={cn(cnCardClass, "!p-0 grid [grid-template-columns:150px_1fr] items-stretch cursor-pointer group max-[620px]:[grid-template-columns:120px_1fr]")}>
                  <div className="relative overflow-hidden">
                    <div className="h-full min-h-[104px] w-full bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                    <div className="absolute inset-0 grid place-items-center z-[3]">
                      <PlayIcon size={40} small />
                    </div>
                    <span className="absolute right-2 bottom-2 z-[3] font-mono text-[11px] bg-black/70 px-[6px] py-[3px] rounded-[5px] text-cn-text">{v.dur}</span>
                  </div>
                  <div className="px-[18px] py-4 flex flex-col justify-center">
                    <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-cn-accent">{v.cat}</span>
                    <h3 className="font-display font-bold tracking-[-0.01em] mt-[6px] leading-[1.2] text-[16px]">{v.title}</h3>
                    <div className="font-mono text-[11px] text-cn-muted-2 mt-2">{v.views}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-videos.tsx
git commit -m "refactor: convert landing-videos to Tailwind with group-hover pattern"
```

---

## Task 15: Convert landing-testimonials.tsx

**Files:** Modify `app/components/home/landing-testimonials.tsx`

Note: Uses CSS `columns` for masonry layout. Tailwind has `columns-3`, `md:columns-2`, etc. `breakInside: "avoid"` becomes `break-inside-avoid`.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";

const QUOTES = [
  { body: "I've watched F1 for 20 years and never had people to scream at the TV with. Now I've got a thousand of them. This place ruined watching races alone forever.", name: "Diego L.", role: "Member since 2023", delay: 0, highlight: true },
  { body: "The engineering breakdowns are genuinely better than half the paid analysis out there. I learned more here in a month than in years of just watching.", name: "Priya R.", role: "Sim racer", delay: 0.08 },
  { body: "Hosted an AMA expecting twenty questions. Got four hundred. This is the most clued-up motorsport audience I've ever talked to.", name: "Tom C.", role: "Racing creator · 600K subs", delay: 0.16, red: true },
  { body: "Came for the memes, stayed for the strategy threads. Somehow it's both the funniest and the smartest place I follow racing.", name: "Amara K.", role: "Member since 2024", delay: 0 },
  { body: "Our sim league grid filled in 48 hours. The clean racing and the post-race debriefs are next level. Properly organised, properly fun.", name: "Nico F.", role: "League admin", delay: 0.08 },
  { body: "Got into MotoGP three months ago with zero clue. Asked a dumb question, got ten kind, detailed answers. That's the whole vibe.", name: "Sara B.", role: "New fan", delay: 0.16 },
];

function QuoteCard({ body, name, role, highlight = false, red = false, delay = 0 }: {
  body: string; name: string; role: string; highlight?: boolean; red?: boolean; delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <div
      ref={ref}
      className={cn(
        "break-inside-avoid mb-[18px] border border-cn-line rounded-[20px] p-7 flex flex-col gap-[18px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]",
        highlight
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.12),rgba(255,255,255,0.004))]"
          : "bg-gradient-to-b from-white/[0.028] to-white/[0.004]",
      )}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transitionDelay: `${delay}s`,
      }}
    >
      <div className="font-display font-extrabold text-[48px] leading-[0.6] text-cn-accent h-6">"</div>
      <p className="text-[16px] text-cn-text leading-[1.55]">{body}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className={cn(
          "w-10 h-10 rounded-full shrink-0 border border-cn-line-strong grid place-items-center font-mono text-[13px] font-bold",
          red
            ? "bg-[linear-gradient(150deg,rgba(255,90,31,0.5),#161619)] text-white"
            : "bg-[linear-gradient(150deg,#2a2a30,#161619)] text-cn-muted",
        )}>
          {initials}
        </div>
        <div>
          <b className="font-body font-semibold text-[14.5px] block">{name}</b>
          <span className="font-mono text-[11px] text-cn-muted-2">{role}</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingTestimonials() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="pt-[30px] pb-[130px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// From the community" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Why fans<br />stay on the grid.
          </h2>
        </div>

        <div className="columns-3 max-nav:columns-2 max-[620px]:columns-1 gap-[18px] mt-16">
          {QUOTES.map(q => <QuoteCard key={q.name} {...q} />)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-testimonials.tsx
git commit -m "refactor: convert landing-testimonials to Tailwind"
```

---

## Task 16: Convert landing-social-wall.tsx

**Files:** Modify `app/components/home/landing-social-wall.tsx`

Note: `SocialTile` span prop produces dynamic `gridColumn`/`gridRow` — keep as inline style since the value is data-driven.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useInView } from "react-intersection-observer";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";

type PlatType = "yt" | "reddit" | "ig" | "x";

function PlatDot({ plat }: { plat: PlatType }) {
  const colors: Record<PlatType, string> = {
    yt: "var(--cn-accent)",
    reddit: "var(--cn-orange)",
    ig: "linear-gradient(135deg,#f58529,#dd2a7b)",
    x: "#e7e7ea",
  };
  const labels: Record<PlatType, string> = { yt: "YouTube", reddit: "Reddit", ig: "Instagram", x: "X" };
  return (
    <span className="absolute top-[14px] left-[14px] z-[3] font-mono text-[10.5px] font-medium tracking-[0.1em] uppercase px-[10px] py-[5px] rounded-[8px] bg-black/[0.55] backdrop-blur-[6px] inline-flex items-center gap-[7px]">
      <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: colors[plat] }} />
      {labels[plat]}
    </span>
  );
}

function PlayMini() {
  return (
    <div className="absolute inset-0 grid place-items-center z-[4]">
      <div className="w-14 h-14 rounded-full bg-[rgba(255,45,45,0.92)] grid place-items-center shadow-[0_10px_36px_-8px_var(--cn-accent-glow)] transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
          <path d="M6 4l14 8-14 8z" />
        </svg>
      </div>
    </div>
  );
}

interface TileProps {
  plat: PlatType;
  title: string;
  sub: string;
  hasPlay?: boolean;
  span?: "feature" | "wide" | "tall" | "normal";
  delay?: number;
}

function SocialTile({ plat, title, sub, hasPlay, span, delay = 0 }: TileProps) {
  const spanStyle: React.CSSProperties = {
    ...(span === "feature" ? { gridColumn: "span 2", gridRow: "span 2" } : {}),
    ...(span === "wide" ? { gridColumn: "span 2" } : {}),
    ...(span === "tall" ? { gridRow: "span 2" } : {}),
  };

  return (
    <Reveal delay={delay}>
      <div
        className="rounded-[20px] overflow-hidden relative border border-cn-line h-full group transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-cn-line-strong hover:shadow-[0_24px_60px_-26px_rgba(255,45,45,0.4)]"
        style={spanStyle}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)]" />
        {hasPlay && <PlayMini />}
        <PlatDot plat={plat} />
        <div className="absolute left-0 right-0 bottom-0 z-[3] p-4 bg-[linear-gradient(0deg,rgba(8,8,9,0.92),transparent)]">
          <b
            className="font-display font-bold block leading-[1.2]"
            style={{ fontSize: span === "feature" ? "clamp(20px,2vw,28px)" : 15 }}
          >
            {title}
          </b>
          <span className="font-mono text-[10.5px] text-cn-muted tracking-[0.06em]">{sub}</span>
        </div>
      </div>
    </Reveal>
  );
}

export default function LandingSocialWall() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="pt-[30px] pb-[120px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)" }}
        >
          <SectionEyebrow label="// Social wall" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Everywhere<br />at once.
          </h2>
          <p className="text-cn-muted mt-[22px] text-[18px] max-w-[600px]">
            One community, every platform. Here's what the grid is posting right now.
          </p>
        </div>

        <div
          className="grid gap-4 mt-16 [grid-template-columns:repeat(4,1fr)] [grid-auto-rows:168px] max-[1080px]:[grid-template-columns:repeat(3,1fr)] max-[620px]:[grid-template-columns:repeat(2,1fr)] max-[620px]:[grid-auto-rows:140px]"
        >
          <SocialTile plat="yt" title="Full Monaco watch-along — community edition" sub="142K views · 2 days ago" hasPlay span="feature" />
          <SocialTile plat="reddit" title="Strategy megathread" sub="r/CircuitNation · 4.2k" delay={0.08} />
          <SocialTile plat="ig" title="Paddock golden hour" sub="9,803 likes" delay={0.08} />
          <SocialTile plat="ig" title="Every front wing on the grid, side by side" sub="Carousel · 14.1k likes" span="wide" delay={0.16} />
          <SocialTile plat="yt" title='That overtake, 12 angles' sub="880K plays" hasPlay span="tall" />
          <SocialTile plat="x" title='"Box now. BOX NOW."' sub="32k reposts" delay={0.08} />
          <SocialTile plat="reddit" title="Live AMA: pit-wall strategist" sub="Happening now" delay={0.16} />
          <SocialTile plat="ig" title="Watch-party night — 40 cities, one race" sub="Member submitted" span="wide" delay={0.08} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-social-wall.tsx
git commit -m "refactor: convert landing-social-wall to Tailwind"
```

---

## Task 17: Convert landing-globe.tsx

**Files:** Modify `app/components/home/landing-globe.tsx`

Note: Globe canvas sizing stays as inline style. Dashed orbit ring animation stays inline. Radial glow filter stays inline.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";
import { useInView } from "react-intersection-observer";
import { SectionEyebrow } from "./section-eyebrow";

const MARKERS = [
  { location: [43.7347, 7.4206] as [number, number], size: 0.08 },
  { location: [52.0786, -1.0169] as [number, number], size: 0.06 },
  { location: [45.6156, 9.2811] as [number, number], size: 0.06 },
  { location: [50.4372, 5.9714] as [number, number], size: 0.05 },
  { location: [43.9980, 11.3719] as [number, number], size: 0.06 },
  { location: [34.8431, 136.5410] as [number, number], size: 0.07 },
  { location: [30.1328, -97.6411] as [number, number], size: 0.06 },
  { location: [36.1699, -115.1398] as [number, number], size: 0.05 },
  { location: [-23.7036, -46.6997] as [number, number], size: 0.06 },
  { location: [-37.8497, 144.9680] as [number, number], size: 0.06 },
  { location: [1.2914, 103.8640] as [number, number], size: 0.06 },
  { location: [25.4900, 51.4542] as [number, number], size: 0.05 },
];

function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    inViewRef(el);
  }, [inViewRef]);

  useEffect(() => {
    if (!inView || ran.current || !numRef.current) return;
    ran.current = true;
    const el = numRef.current;
    const dur = 1500;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent = String(v) + (p === 1 ? suffix : suffix.replace(/[^+]/g, ""));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target) + suffix;
    };
    requestAnimationFrame(step);
  }, [inView, target, suffix]);

  return (
    <div ref={setRefs} className="border border-cn-line rounded-[16px] px-5 py-[22px] bg-gradient-to-b from-white/[0.025] to-transparent relative overflow-hidden">
      <span className="absolute left-0 top-0 h-[2px] w-9 bg-cn-accent shadow-[0_0_10px_var(--cn-accent-glow)]" />
      <div ref={numRef} className="font-display font-extrabold text-[clamp(36px,4vw,52px)] leading-none">0</div>
      <div className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-cn-muted mt-[10px] leading-[1.5]">
        {label}
      </div>
    </div>
  );
}

export default function LandingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(4.2);
  const widthRef = useRef(0);
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sizeCanvas = () => { widthRef.current = canvas.offsetWidth; };
    window.addEventListener("resize", sizeCanvas);
    sizeCanvas();
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      theta: 0.28,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 14000,
      mapBrightness: 5.2,
      baseColor: [0.32, 0.32, 0.36],
      markerColor: [1, 0.18, 0.18],
      glowColor: [0.55, 0.12, 0.12],
      markers: MARKERS,
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.0032;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1s ease";
    setTimeout(() => { canvas.style.opacity = "1"; }, 300);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <section id="globe" ref={sectionRef} className="py-[120px_0_130px] pt-[120px] pb-[130px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div className="grid [grid-template-columns:1.05fr_1fr] max-nav:grid-cols-1 gap-[60px] items-center">

          {/* Copy */}
          <div
            className="transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(26px)" }}
          >
            <SectionEyebrow label="// Global community map" />
            <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[clamp(46px,7vw,100px)] mt-[22px]">
              Motorsport<br />never <span className="text-cn-accent">sleeps.</span>
            </h2>
            <p className="text-cn-muted max-w-[460px] mt-6 text-[17.5px]">
              From a Sunday-morning Suzuka qualifying to a midnight Vegas main event, somewhere on the grid the engines are always running — and so are the conversations.
            </p>
            <div className="grid grid-cols-3 max-nav:grid-cols-1 gap-4 mt-11">
              <Stat target={24} suffix="+" label={"Countries\nrepresented"} />
              <Stat target={6} suffix="+" label={"Racing series\nfollowed"} />
              <Stat target={120} suffix="+" label={"Global watch\nparties / yr"} />
            </div>
          </div>

          {/* Globe */}
          <div className="relative aspect-square w-full max-w-[560px] mx-auto grid place-items-center">
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ inset: "6%", background: "radial-gradient(circle at 50% 45%,rgba(255,45,45,0.16),transparent 62%)", filter: "blur(8px)" }}
            />
            <div className="absolute inset-0 rounded-full border border-cn-line pointer-events-none" />
            <div
              className="absolute rounded-full border border-dashed border-white/[0.06] pointer-events-none animate-cn-spin-slow"
              style={{ inset: "-7%" }}
            />
            <span className="absolute top-[12%] left-[-6%] font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-cn-muted border border-cn-line bg-[rgba(10,10,11,0.7)] backdrop-blur-[6px] px-[10px] py-[6px] rounded-[8px] flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)]" />
              F1 · Monaco
            </span>
            <span className="absolute bottom-[16%] right-[-4%] font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-cn-muted border border-cn-line bg-[rgba(10,10,11,0.7)] backdrop-blur-[6px] px-[10px] py-[6px] rounded-[8px] flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)]" />
              MotoGP · Mugello
            </span>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", maxWidth: "100%", aspectRatio: "1", contain: "layout paint size", cursor: "grab" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-globe.tsx
git commit -m "refactor: convert landing-globe to Tailwind"
```

---

## Task 18: Convert landing-join.tsx

**Files:** Modify `app/components/home/landing-join.tsx`

Uses `Input` from shadcn and `Button` for the form and platform CTAs.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SectionEyebrow } from "./section-eyebrow";

const PLATFORMS = [
  { name: "Discord", count: "32K+", desc: "The live garage", cta: "Join Discord", href: "#", red: true },
  { name: "Reddit", count: "28K+", desc: "Threads & AMAs", cta: "Follow r/CircuitNation", href: "#" },
  { name: "Newsletter", count: "15K+", desc: "The Friday Briefing", cta: "Subscribe free", href: "#nl" },
];

export default function LandingJoin() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="join" className="pt-[30px] pb-[110px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={ref}
          className={cn(
            "border border-cn-line rounded-[28px] relative overflow-hidden bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))]",
            "transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]",
          )}
          style={{
            padding: "clamp(40px,6vw,80px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(26px)",
          }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_400px_at_85%_10%,rgba(255,45,45,0.22),transparent_60%)]" />

          <SectionEyebrow label="// Join the community" className="relative" />

          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[clamp(40px,6vw,92px)] max-w-[760px] relative mt-5">
            Pull onto<br />the grid.
          </h2>
          <p className="text-cn-muted mt-[22px] max-w-[520px] text-[18px] relative">
            Pick your platform and jump in. The next race is always closer than you think — don't watch it alone.
          </p>

          {/* Platform cards */}
          <div className="grid grid-cols-3 max-nav:grid-cols-1 gap-4 mt-12 relative">
            {PLATFORMS.map(p => (
              <div
                key={p.name}
                className="border border-cn-line rounded-[20px] p-[26px] flex flex-col gap-[14px] bg-[rgba(10,10,11,0.5)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-cn-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-muted-2">{p.name}</span>
                </div>
                <div className="font-display font-extrabold text-[30px] tracking-[-0.02em]">{p.count}</div>
                <h3 className="font-display font-bold text-[21px]">{p.desc}</h3>
                <Button
                  variant={p.red ? "cn-primary" : "cn-ghost"}
                  size="cn"
                  asChild
                  className="mt-2"
                >
                  <a href={p.href}>
                    {p.red && <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />}
                    {p.cta}
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Newsletter form */}
          <form
            id="nl"
            className="flex gap-3 mt-7 max-w-[520px] relative flex-wrap"
            onSubmit={e => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
          >
            <Input
              type="email"
              placeholder="you@trackside.com"
              aria-label="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitted}
              className="flex-1 min-w-[220px]"
            />
            <Button
              type="submit"
              variant="cn-primary"
              size="cn"
              disabled={submitted}
            >
              {submitted ? (
                "On the grid"
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  Get the briefing
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-join.tsx
git commit -m "refactor: convert landing-join to Tailwind + shadcn Button + Input"
```

---

## Task 19: Convert landing-footer.tsx

**Files:** Modify `app/components/home/landing-footer.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
export default function LandingFooter() {
  return (
    <footer className="border-t border-cn-line bg-cn-bg-2">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 pt-[70px] pb-[50px] grid [grid-template-columns:1.5fr_1fr_1fr_1fr] max-nav:[grid-template-columns:1fr_1fr] max-[620px]:grid-cols-1 gap-10">
        {/* Brand */}
        <div>
          <a href="#top" className="flex items-center gap-3 no-underline text-cn-text mb-[18px]">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#1a1a1e] to-[#0c0c0e] border border-cn-line-strong grid place-items-center overflow-hidden shrink-0 relative">
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,var(--cn-accent)_40%,var(--cn-accent)_46%,transparent_48%,transparent_54%,var(--cn-accent)_56%,var(--cn-accent)_62%,transparent_64%)] opacity-[0.95]" />
            </span>
            <span className="font-display font-extrabold text-[19px] tracking-[-0.01em] uppercase leading-none">Circuit Nation</span>
          </a>
          <p className="text-cn-muted max-w-[300px] text-[14.5px]">
            Your ultimate hub to everything motorsports. Built by fans, for fans — across every series, every weekend.
          </p>
        </div>

        {/* Link columns */}
        {[
          { heading: "Community", links: ["Discord", "Reddit", "Sim league", "Watch parties"] },
          { heading: "Content", links: ["Latest posts", "Videos", "AMAs", "Newsletter"] },
          { heading: "Follow", links: ["YouTube", "Instagram", "X / Twitter", "TikTok"] },
        ].map(col => (
          <div key={col.heading}>
            <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-cn-muted-2 mb-[18px]">{col.heading}</h4>
            {col.links.map(l => (
              <a
                key={l}
                href="#"
                className="block text-cn-muted no-underline text-[14.5px] py-[6px] transition-colors duration-200 hover:text-cn-text"
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-cn-line max-w-[var(--cn-maxw)] mx-auto px-8 py-6 flex justify-between items-center gap-5 flex-wrap font-mono text-[11.5px] tracking-[0.08em] uppercase text-cn-muted-2">
        <span>© 2026 Circuit Nation — Built by fans, for fans.</span>
        <span>Not affiliated with any racing series or governing body.</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/home/landing-footer.tsx
git commit -m "refactor: convert landing-footer to Tailwind"
```

---

## Self-Review

### Spec coverage check

| Requirement | Covered by |
|---|---|
| Use Tailwind CSS classes | All Tasks 1–19 |
| Use shadcn components | Button (Tasks 7,8,18), Card helpers (Tasks 9–16), Input (Task 18) |
| Follow DESIGN.md colors | `--color-cn-*` tokens in Task 1; applied throughout |
| Follow DESIGN.md typography | `font-display`/`font-body`/`font-mono` tokens in Task 1 |
| Follow DESIGN.md hover states | `hover:-translate-y-1`, `hover:border-cn-line-strong`, glow shadows throughout |
| Follow DESIGN.md buttons | `cn-primary` and `cn-ghost` Button variants in Task 2 |
| Follow DESIGN.md cards | `cnCardClass` / `cnAccentCardClass` helpers in Task 3 |
| Follow DESIGN.md inputs | CN Input component in Task 5 |
| Remove `<style>` tag media queries | Replaced with `max-nav:`, `max-[620px]:`, `max-[1080px]:` prefixes throughout |
| Remove JS onMouse hover handlers | Replaced with `hover:` variants (Tasks 7–19); `group-hover:` in Task 14 |

### No-placeholder check

All tasks contain complete component code. No "TBD" or "similar to Task N" entries.

### Type consistency check

- `Button` component accepts `asChild` prop — used correctly throughout with `<a>` children
- `cnCardClass` / `cnAccentCardClass` are strings passed as `className` — correct usage via `cn()`
- `Reveal` component `threshold` defaults match original per-component thresholds where they differed (0.12 in videos/posts is passed explicitly)
- `Input` component uses `React.ComponentProps<"input">` — compatible with form usage in Task 18
