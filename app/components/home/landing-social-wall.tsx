"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
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
  const spanClass =
    span === "feature" ? "[grid-column:span_2] [grid-row:span_2]" :
    span === "wide" ? "[grid-column:span_2]" :
    span === "tall" ? "[grid-row:span_2]" :
    "";

  return (
    <Reveal delay={delay} className={spanClass}>
      <div
        className="rounded-[20px] overflow-hidden relative border border-cn-line h-full group transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-cn-line-strong hover:shadow-[0_24px_60px_-26px_rgba(255,45,45,0.4)]"
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
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className={cn(
            "max-w-[720px] transition-[opacity,transform] duration-[800ms] ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[26px]",
          )}
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
