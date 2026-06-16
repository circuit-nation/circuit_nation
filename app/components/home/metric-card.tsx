import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

// Smooth upward-trending area chart rendered as a raw SVG overlay.
// Data is intentionally organic — not a perfect line — so it reads as
// real growth rather than a decorative shape.
const GRAPH_POINTS = [
  [0, 88],
  [6, 85],
  [13, 80],
  [20, 76],
  [28, 72],
  [35, 65],
  [42, 60],
  [50, 52],
  [57, 47],
  [64, 40],
  [71, 33],
  [79, 25],
  [86, 18],
  [93, 10],
  [100, 4],
];

function buildPath(pts: number[][], w: number, h: number) {
  // Map normalised [0-100, 0-100] coords onto actual pixel dims
  const px = (x: number) => (x / 100) * w;
  const py = (y: number) => (y / 100) * h;

  // Smooth cubic bezier through each point
  let d = `M ${px(pts[0][0])},${py(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cpx = px((x0 + x1) / 2);
    d += ` C ${cpx},${py(y0)} ${cpx},${py(y1)} ${px(x1)},${py(y1)}`;
  }

  // Close back along the bottom to form the filled area
  const last = pts[pts.length - 1];
  d += ` L ${px(last[0])},${h} L ${px(pts[0][0])},${h} Z`;
  return d;
}

function buildLinePath(pts: number[][], w: number, h: number) {
  const px = (x: number) => (x / 100) * w;
  const py = (y: number) => (y / 100) * h;
  let d = `M ${px(pts[0][0])},${py(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cpx = px((x0 + x1) / 2);
    d += ` C ${cpx},${py(y0)} ${cpx},${py(y1)} ${px(x1)},${py(y1)}`;
  }
  return d;
}

function FeaturedGraphOverlay({ inView }: { inView: boolean }) {
  const lineRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef(false);

  const W = 400;
  const H = 220;

  const areaPath = buildPath(GRAPH_POINTS, W, H);
  const linePath = buildLinePath(GRAPH_POINTS, W, H);

  useEffect(() => {
    if (!inView || drawnRef.current || !lineRef.current) return;
    drawnRef.current = true;

    const el = lineRef.current;
    const length = el.getTotalLength();
    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length);

    // Small delay so card fade-in settles first
    const tid = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)";
      el.style.strokeDashoffset = "0";
    }, 300);

    return () => clearTimeout(tid);
  }, [inView]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 w-full h-full rounded-4xl overflow-hidden pointer-events-none"
    >
      <defs>
        {/* Area fill: red at top, transparent at bottom */}
        <linearGradient id="graph-area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,45,45,0.13)" />
          <stop offset="100%" stopColor="rgba(255,45,45,0)" />
        </linearGradient>
        {/* Line stroke: slightly brighter than the fill */}
        <linearGradient id="graph-line-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,45,45,0.15)" />
          <stop offset="100%" stopColor="rgba(255,45,45,0.55)" />
        </linearGradient>
      </defs>

      {/* Filled area — static, just fades in with the card */}
      <path
        d={areaPath}
        fill="url(#graph-area-fill)"
        className={cn(
          "transition-opacity duration-1000",
          inView ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDelay: "0.2s" }}
      />

      {/* Animated line that draws itself in */}
      <path
        ref={lineRef}
        d={linePath}
        fill="none"
        stroke="url(#graph-line-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricCard({
  target,
  compact = false,
  suffix = "",
  label,
  featured = false,
  tag,
  delay = 0,
  link,
}: {
  target: number;
  compact?: boolean;
  suffix?: string;
  label: string;
  featured?: boolean;
  tag?: string;
  delay?: number;
  link?: string;
}) {
  const numRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const cf = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    if (!inView || ran.current || !numRef.current) return;
    ran.current = true;
    const el = numRef.current;
    const dur = 1500;
    const t0 = performance.now();
    const disp = (v: number) => (compact ? cf.format(v) : String(v));
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * target);
      el.textContent =
        disp(v) + (p === 1 ? suffix : suffix.replace(/[^+]/g, ""));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = disp(target) + suffix;
    };
    requestAnimationFrame(step);
  }, [inView, target, suffix, compact]);

  const cardContent = (
    <>
      {/* Graph overlay — only on featured cards, sits behind all content */}
      {featured && <FeaturedGraphOverlay inView={inView} />}

      {tag && (
        <span className="relative font-mono text-xs tracking-[0.12em] uppercase text-cn-muted-2">
          {tag}
        </span>
      )}

      <div className="relative">
        <div
          ref={numRef}
          className={cn(
            "font-display font-extrabold tracking-[-0.03em] leading-[0.9]",
            featured
              ? "text-[clamp(72px,9vw,120px)]"
              : "text-[clamp(44px,5vw,64px)]",
          )}
        >
          0
        </div>
        <div className="font-mono text-sm font-medium tracking-[0.1em] uppercase">
          {label}
        </div>
      </div>

      {link && (
        <ArrowUpRight
          className={cn(
            "absolute transition-[opacity,transform] duration-200 ease-out opacity-0 translate-y-1 -translate-x-1",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0",
            featured ? "top-6 right-6 size-6" : "top-5 right-5 size-4",
          )}
          strokeWidth={2}
        />
      )}
    </>
  );

  const sharedClassName = cn(
    "group relative border border-cn-line rounded-4xl p-6 flex flex-col justify-between transition-[opacity,transform] duration-800 ease-spring overflow-hidden",
    featured
      ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2"
      : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
    link && "cursor-pointer",
  );

  const sharedStyle = delay > 0 ? { transitionDelay: `${delay}s` } : undefined;

  if (link) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={link}
        className={sharedClassName}
        style={sharedStyle}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div ref={ref} className={sharedClassName} style={sharedStyle}>
      {cardContent}
    </div>
  );
}
