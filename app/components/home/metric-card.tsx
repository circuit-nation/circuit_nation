import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";

// TODO: Add chart on the featured metric

export default function MetricCard({
  target,
  compact = false,
  suffix = "",
  label,
  featured = false,
  tag,
  delay = 0,
}: {
  target: number;
  compact?: boolean;
  suffix?: string;
  label: string;
  featured?: boolean;
  tag?: string;
  delay?: number;
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

  return (
    <div
      ref={ref}
      className={cn(
        "border border-cn-line rounded-4xl p-6 flex flex-col justify-between transition-[opacity,transform] duration-800 ease-spring",
        featured
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2"
          : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {tag && (
        <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-muted-2">
          {tag}
        </span>
      )}
      <div>
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
    </div>
  );
}
