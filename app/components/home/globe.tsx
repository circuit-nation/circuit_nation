"use client";
import { useEffect, useMemo, useRef } from "react";
import createGlobe from "cobe";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import type { EventLocation, GlobeEvent } from "~/types/events";
import { SectionEyebrow } from "./section-eyebrow";
import { landingContainerClass, landingSectionClass } from "./landing-shell";
import GlobeEventCard, {
  getNextTwoEvents,
  isEventLive,
  type GlobeUpcomingEvent,
} from "./globe-event-card";

type LandingGlobeProps = {
  upcomingEvents: GlobeEvent[];
  eventLocations: EventLocation[];
};

function toGlobeUpcomingEvent(event: GlobeEvent): GlobeUpcomingEvent {
  return {
    id: event.id,
    title: event.title,
    sportName: event.sportName,
    sportColor: event.sportColor,
    location: event.location,
    circuit: event.circuit,
    startAt: new Date(event.startAt),
    endAt: new Date(event.endAt),
    watchUrl: event.watchUrl,
    watchLabel: event.watchLabel,
  };
}

function toMarkers(locations: EventLocation[]) {
  return locations.map((loc) => ({
    location: [loc.latitude, loc.longitude] as [number, number],
    size: 0.04,
  }));
}

export default function LandingGlobe({
  upcomingEvents,
  eventLocations,
}: LandingGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(4.2);
  const widthRef = useRef(0);
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const parsedEvents = useMemo(
    () => upcomingEvents.map(toGlobeUpcomingEvent),
    [upcomingEvents],
  );
  const markers = useMemo(() => toMarkers(eventLocations), [eventLocations]);
  const nextTwo = getNextTwoEvents(parsedEvents);

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
      markers,
    });
    let rafId: number;
    const animate = () => {
      phiRef.current += 0.0022;
      globe.update({
        phi: phiRef.current,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        markers,
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
  }, [markers]);

  return (
    <section id="globe" ref={sectionRef} className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div className="grid grid-cols-[1.05fr_1fr] max-nav:grid-cols-1 gap-8 md:gap-15 items-center">
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
                  showCountdown={true}
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
