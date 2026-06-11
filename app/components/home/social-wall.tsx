"use client";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";

type PlatType = "yt" | "reddit" | "ig";

type TileVisual = "image" | "gradient" | "live";

interface SocialTileData {
  id: string;
  plat: PlatType;
  title: string;
  sub: string;
  hasPlay?: boolean;
  visual: TileVisual;
  imageSeed?: string;
  area:
    | "hero"
    | "side-a"
    | "side-b"
    | "tile-a"
    | "tile-b"
    | "tile-c"
    | "tile-d"
    | "tall-a"
    | "tall-b"
    | "wide";
  delay?: number;
}

const TILES: SocialTileData[] = [
  {
    id: "monaco",
    plat: "yt",
    title: "Full Monaco watch-along - community edition",
    sub: "142K views · 2 days ago",
    hasPlay: true,
    visual: "image",
    imageSeed: "monaco-pitlane-night",
    area: "hero",
  },
  {
    id: "strategy",
    plat: "reddit",
    title: "Strategy megathread",
    sub: "r/CircuitNation · 4.2k",
    visual: "gradient",
    area: "side-a",
    delay: 0.06,
  },
  {
    id: "wings",
    plat: "ig",
    title: "Every front wing on the grid, side by side",
    sub: "Carousel · 14.1k likes",
    visual: "image",
    imageSeed: "f1-front-wing-detail",
    area: "side-b",
    delay: 0.1,
  },
  {
    id: "watch-party",
    plat: "ig",
    title: "Watch-party night - 40 cities, one race",
    sub: "Member submitted",
    visual: "gradient",
    area: "tall-a",
    delay: 0.08,
  },
  {
    id: "ama",
    plat: "reddit",
    title: "Tile A",
    sub: "Happening now",
    visual: "live",
    area: "tile-a",
    delay: 0.08,
  },
  {
    id: "golden-pa",
    plat: "ig",
    title: "Tile B",
    sub: "9,803 likes",
    visual: "image",
    imageSeed: "paddock-sunset-gold",
    area: "tile-b",
    delay: 0.12,
  },
  {
    id: "golden-hour",
    plat: "ig",
    title: "Tile C",
    sub: "9,803 likes",
    visual: "image",
    imageSeed: "paddock-sunset-gold",
    area: "tile-c",
    delay: 0.12,
  },
  {
    id: "ama",
    plat: "reddit",
    title: "Tile D",
    sub: "Happening now",
    visual: "live",
    area: "tile-d",
    delay: 0.08,
  },
  {
    id: "overtake",
    plat: "yt",
    title: "That overtake, 12 angles",
    sub: "880K plays",
    hasPlay: true,
    visual: "image",
    imageSeed: "racing-overtake-angles",
    area: "tall-b",
    delay: 0.14,
  },
];

const platformLabel: Record<PlatType, string> = {
  yt: "YouTube",
  reddit: "Reddit",
  ig: "Instagram",
};

const platformAccent: Record<PlatType, string> = {
  yt: "text-cn-accent",
  reddit: "text-cn-orange",
  ig: "text-[#f58529]",
};

const platformGradient: Record<PlatType, string> = {
  yt: "from-[rgba(255,45,45,0.22)] via-[rgba(20,20,23,0.92)] to-[#0d0d0f]",
  reddit: "from-[rgba(255,120,40,0.2)] via-[rgba(20,20,23,0.94)] to-[#0d0d0f]",
  ig: "from-[rgba(245,133,41,0.22)] via-[rgba(221,42,123,0.12)] to-[#0d0d0f]",
};

const areaClass: Record<SocialTileData["area"], string> = {
  hero: "md:col-span-3 md:row-span-2 min-h-[280px] md:min-h-0",
  "side-a": "md:col-start-4 md:row-start-1",
  "side-b": "md:col-start-4 md:row-start-2",
  "tile-a": "md:col-start-2 md:row-start-3",
  "tile-b": "md:col-start-3 md:row-start-3",
  "tile-c": "md:col-start-2 md:row-start-4",
  "tile-d": "md:col-start-3 md:row-start-4",
  "tall-a":
    "md:col-start-4 md:row-span-2 md:row-start-3 min-h-[220px] md:min-h-0",
  "tall-b":
    "md:col-start-1 md:row-span-2 md:row-start-3 min-h-[220px] md:min-h-0",
  wide: "md:col-span-3 md:col-start-1 md:row-start-4",
};

function PlayMini() {
  return (
    <div className="absolute inset-0 grid place-items-center z-4 pointer-events-none">
      <div className="w-14 h-14 rounded-full bg-cn-accent/92 grid place-items-center shadow-[0_10px_36px_-8px_(--cn-accent-glow)] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white ml-0.5"
          aria-hidden
        >
          <path d="M6 4l14 8-14 8z" />
        </svg>
      </div>
    </div>
  );
}

function SocialTile({
  plat,
  title,
  sub,
  hasPlay,
  visual,
  imageSeed,
  area,
  delay = 0,
}: SocialTileData) {
  const isHero = area === "hero";
  const imageUrl = imageSeed
    ? `https://picsum.photos/seed/${imageSeed}/${isHero ? 1200 : 640}/${isHero ? 900 : 720}`
    : null;

  return (
    <Reveal
      delay={delay}
      className={cn("h-full min-h-[168px]", areaClass[area])}
    >
      <article className="rounded-4xl overflow-hidden relative border border-cn-line h-full group transition-[transform,box-shadow,border-color] duration-300 ease-spring hover:-translate-y-1 hover:border-cn-line-strong hover:shadow-[0_24px_60px_-26px_rgba(255,45,45,0.35)]">
        {visual === "image" && imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-700 ease-spring group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,9,0.15)_0%,rgba(8,8,9,0.55)_55%,rgba(8,8,9,0.94)_100%)]" />
          </>
        ) : visual === "live" ? (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,45,45,0.28),rgba(12,12,14,0.98))]" />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br",
              platformGradient[plat],
            )}
          />
        )}

        {visual !== "image" && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(255,255,255,0.018)_11px,rgba(255,255,255,0.018)_22px)]" />
        )}

        {visual === "live" && (
          <span className="absolute top-4 right-4 z-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-cn-accent/40 bg-cn-accent/15 text-cn-accent">
            Live
          </span>
        )}

        {hasPlay && <PlayMini />}

        <span
          className={cn(
            "absolute top-4 left-4 z-3 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-xl bg-black/55 backdrop-blur-[6px] border border-white/8",
            platformAccent[plat],
          )}
        >
          {platformLabel[plat]}
        </span>

        <div className="absolute left-0 right-0 bottom-0 z-3 p-4 md:p-5">
          <h3
            className={cn(
              "font-display font-bold leading-[1.15] tracking-[-0.01em]",
              isHero
                ? "text-[clamp(18px,2.2vw,28px)]"
                : area === "wide"
                  ? "text-[clamp(16px,1.8vw,22px)]"
                  : "text-[15px]",
            )}
          >
            {title}
          </h3>
          <p className="font-mono text-xs text-cn-muted tracking-[0.06em] mt-1.5">
            {sub}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export default function LandingSocialWall() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7686/ingest/e0bb234d-60d0-4467-9d92-8108d0958dca", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "984e8e",
      },
      body: JSON.stringify({
        sessionId: "984e8e",
        runId: "pre-fix",
        hypothesisId: "E",
        location: "social-wall.tsx:mount",
        message: "LandingSocialWall mounted",
        data: { tileCount: TILES.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:7686/ingest/e0bb234d-60d0-4467-9d92-8108d0958dca", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "984e8e",
      },
      body: JSON.stringify({
        sessionId: "984e8e",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "social-wall.tsx:headIn",
        message: "Header inView changed",
        data: { headIn },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [headIn]);

  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const gridStyles = getComputedStyle(grid);
      const gridRect = grid.getBoundingClientRect();
      const tiles = Array.from(grid.children).map((child, index) => {
        const styles = getComputedStyle(child);
        const rect = child.getBoundingClientRect();
        return {
          index,
          opacity: styles.opacity,
          height: rect.height,
          width: rect.width,
          gridArea: styles.gridArea,
          display: styles.display,
        };
      });
      fetch(
        "http://127.0.0.1:7686/ingest/e0bb234d-60d0-4467-9d92-8108d0958dca",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "984e8e",
          },
          body: JSON.stringify({
            sessionId: "984e8e",
            runId: "pre-fix",
            hypothesisId: "B,C,D",
            location: "social-wall.tsx:gridMeasure",
            message: "Grid layout measured",
            data: {
              headIn,
              gridHeight: gridRect.height,
              gridWidth: gridRect.width,
              gridTemplateAreas: gridStyles.gridTemplateAreas,
              gridTemplateColumns: gridStyles.gridTemplateColumns,
              gridTemplateRows: gridStyles.gridTemplateRows,
              tiles,
            },
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
    };
    measure();
    const t1 = window.setTimeout(measure, 500);
    const t2 = window.setTimeout(measure, 2000);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", measure);
    };
  }, [headIn]);
  // #endregion

  return (
    <section className="py-12">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Social wall" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Everywhere
            <br />
            at once.
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-2xl">
            One community, every platform. Here is what the grid is posting
            right now.
          </p>
        </div>

        <div
          ref={gridRef}
          className={cn(
            "grid gap-3 md:gap-4 mt-16",
            "grid-cols-1 auto-rows-[minmax(168px,auto)]",
            "md:grid-cols-4 md:grid-rows-[repeat(4,minmax(148px,1fr))]",
          )}
        >
          {TILES.map((tile) => (
            <SocialTile key={tile.id} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
