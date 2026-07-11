import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

// Organic growth curve — irregular spacing, uneven pullbacks, smooth interpolation.
const GRAPH_POINTS = [
  [0, 90],
  [6, 87],
  [14, 86],
  [23, 81],
  [31, 78],
  [39, 80],
  [48, 72],
  [57, 66],
  [65, 63],
  [73, 55],
  [80, 52],
  [87, 38],
  [94, 27],
  [100, 16],
];

function toPixels(pts: number[][], w: number, h: number) {
  return pts.map(([x, y]) => [(x / 100) * w, (y / 100) * h] as const);
}

function buildSmoothPath(pts: number[][], w: number, h: number) {
  const points = toPixels(pts, w, h);
  if (points.length < 2) return "";

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function buildPath(pts: number[][], w: number, h: number) {
  const line = buildSmoothPath(pts, w, h);
  const start = toPixels(pts, w, h)[0];
  const end = toPixels(pts, w, h)[pts.length - 1];
  return `${line} L ${end[0]},${h} L ${start[0]},${h} Z`;
}

function buildLinePath(pts: number[][], w: number, h: number) {
  return buildSmoothPath(pts, w, h);
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
          <stop offset="0%" stopColor="rgba(255,45,45,0.11)" />
          <stop offset="55%" stopColor="rgba(255,45,45,0.05)" />
          <stop offset="100%" stopColor="rgba(255,45,45,0)" />
        </linearGradient>
        <linearGradient id="graph-line-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,45,45,0.12)" />
          <stop offset="45%" stopColor="rgba(255,45,45,0.28)" />
          <stop offset="100%" stopColor="rgba(255,45,45,0.5)" />
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
              ? "text-[clamp(56px,16vw,120px)]"
              : "text-[clamp(40px,12vw,64px)]",
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
    "group relative border border-cn-line rounded-4xl p-5 sm:p-6 flex flex-col justify-between transition-[opacity,transform] duration-800 ease-spring overflow-hidden",
    featured
      ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2 max-[620px]:row-span-1"
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
