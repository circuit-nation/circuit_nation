"use client";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";
import GlobeEventCard, {
  getNextTwoEvents,
  isEventLive,
  type GlobeUpcomingEvent,
} from "./globe-event-card";

const MARKERS = [
  { location: [43.7347, 7.4206] as [number, number], size: 0.06 },
  { location: [52.0786, -1.0169] as [number, number], size: 0.04 },
  { location: [45.6156, 9.2811] as [number, number], size: 0.04 },
  { location: [50.4372, 5.9714] as [number, number], size: 0.04 },
  { location: [43.998, 11.3719] as [number, number], size: 0.04 },
  { location: [34.8431, 136.541] as [number, number], size: 0.04 },
  { location: [30.1328, -97.6411] as [number, number], size: 0.04 },
  { location: [36.1699, -115.1398] as [number, number], size: 0.04 },
  { location: [-23.7036, -46.6997] as [number, number], size: 0.04 },
  { location: [-37.8497, 144.968] as [number, number], size: 0.04 },
  { location: [1.2914, 103.864] as [number, number], size: 0.04 },
  { location: [25.49, 51.4542] as [number, number], size: 0.04 },
];

const UPCOMING_EVENTS: GlobeUpcomingEvent[] = [
  {
    id: "f1-canada-2026",
    title: "Canadian GP",
    sportName: "Formula 1",
    sportColor: "var(--cn-red)",
    location: "Montreal, Canada",
    circuit: "Circuit Gilles Villeneuve",
    startAt: new Date(2026, 5, 12),
    endAt: new Date(2026, 5, 14, 23, 59),
    watchUrl: "https://f1tv.formula1.com",
    watchLabel: "Watch on F1 TV",
  },
  {
    id: "motogp-assen-2026",
    title: "Dutch TT",
    sportName: "MotoGP",
    sportColor: "var(--cn-blue)",
    location: "Assen, Netherlands",
    circuit: "TT Circuit Assen",
    startAt: new Date(2026, 5, 20),
    endAt: new Date(2026, 5, 22, 23, 59),
    watchUrl: "https://www.motogp.com",
    watchLabel: "Where to watch",
  },
  {
    id: "f1-austria-2026",
    title: "Austrian GP",
    sportName: "Formula 1",
    sportColor: "var(--cn-red)",
    location: "Spielberg, Austria",
    circuit: "Red Bull Ring",
    startAt: new Date(2026, 5, 27),
    endAt: new Date(2026, 5, 29, 23, 59),
    watchUrl: "https://f1tv.formula1.com",
    watchLabel: "Watch on F1 TV",
  },
  {
    id: "f1-britain-2026",
    title: "British GP",
    sportName: "Formula 1",
    sportColor: "var(--cn-red)",
    location: "Silverstone, UK",
    circuit: "Silverstone Circuit",
    startAt: new Date(2026, 6, 4),
    endAt: new Date(2026, 6, 6, 23, 59),
    watchUrl: "https://f1tv.formula1.com",
    watchLabel: "Watch on F1 TV",
  },
];

export default function LandingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(4.2);
  const widthRef = useRef(0);
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const nextTwo = getNextTwoEvents(UPCOMING_EVENTS);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sizeCanvas = () => {
      widthRef.current = canvas.offsetWidth;
    };
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
      phiRef.current += 0.0022;
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
    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 300);
    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <section id="globe" ref={sectionRef} className="py-24">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div className="grid grid-cols-[1.05fr_1fr] max-nav:grid-cols-1 gap-15 items-center">
          <div
            className={cn(
              "transition-[opacity,transform] duration-800 ease-spring",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
            )}
          >
            <SectionEyebrow label="// Global community map" />
            <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[clamp(46px,7vw,72px)] mt-6">
              Motorsport
              <br />
              never <span className="text-cn-accent">sleeps.</span>
            </h2>
            <div className="grid grid-cols-2 max-nav:grid-cols-1 gap-4 mt-11">
              {nextTwo.map((event, i) => (
                <GlobeEventCard
                  key={event.id}
                  event={event}
                  variant={i === 0 ? "featured" : "secondary"}
                  showCountdown={i === 0 && !isEventLive(event)}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-xl mx-auto grid place-items-center">
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: "6%",
                background:
                  "radial-gradient(circle at 50% 45%,rgba(255,45,45,0.16),transparent 62%)",
                filter: "blur(8px)",
              }}
            />
            <div className="absolute inset-0 rounded-full border border-cn-line pointer-events-none" />
            <div
              className="absolute rounded-full border border-dashed border-white/6 pointer-events-none animate-cn-spin-slow"
              style={{ inset: "-7%" }}
            />
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                aspectRatio: "1",
                contain: "layout paint size",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
