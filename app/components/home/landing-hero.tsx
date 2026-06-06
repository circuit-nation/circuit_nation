"use client";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { SectionEyebrow } from "./section-eyebrow";

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
        {/* Speed streaks — JS-injected, inline styles intentional */}
        <div ref={streaksRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50" />

        {/* Grid floor — perspective transform, inline style intentional */}
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

        <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-[2]">
          <SectionEyebrow
            label="// Your ultimate hub to everything motorsports"
            className="animate-cn-fade opacity-0 [animation-delay:0.1s]"
          />

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
