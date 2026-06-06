"use client";
import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
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
      <span className="absolute left-0 top-0 h-[2px] w-9 bg-cn-accent shadow-[0_0_10px_(--cn-accent-glow)]" />
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
      phi: phiRef.current,
      theta: 0.28,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 14000,
      mapBrightness: 5.2,
      baseColor: [0.32, 0.32, 0.36],
      markerColor: [1, 0.18, 0.18],
      glowColor: [0.55, 0.12, 0.12],
      markers: MARKERS,
    });
    let rafId: number;
    const animate = () => {
      phiRef.current += 0.0032;
      globe.update({
        phi: phiRef.current,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1s ease";
    setTimeout(() => { canvas.style.opacity = "1"; }, 300);
    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <section id="globe" ref={sectionRef} className="pt-[120px] pb-[130px]">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-[2]">
        <div className="grid [grid-template-columns:1.05fr_1fr] max-nav:grid-cols-1 gap-[60px] items-center">

          <div
            className={cn(
              "transition-[opacity,transform] duration-[800ms] ease-spring",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[26px]",
            )}
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
            <span className="absolute top-[12%] left-[-6%] font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-cn-muted border border-cn-line bg-cn-bg/70 backdrop-blur-[6px] px-[10px] py-[6px] rounded-[8px] flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-cn-accent shadow-[0_0_8px_(--cn-accent-glow)]" />
              F1 · Monaco
            </span>
            <span className="absolute bottom-[16%] right-[-4%] font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-cn-muted border border-cn-line bg-cn-bg/70 backdrop-blur-[6px] px-[10px] py-[6px] rounded-[8px] flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-cn-accent shadow-[0_0_8px_(--cn-accent-glow)]" />
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
