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
        "border border-cn-line rounded-[20px] p-[30px] flex flex-col justify-between transition-[opacity,transform] duration-[800ms]",
        featured
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] row-span-2"
          : "bg-gradient-to-b from-white/[0.028] to-white/[0.004]",
      )}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
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
    <section className="pt-[30px] pb-[130px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
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
