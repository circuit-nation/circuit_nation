"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";

export type GlobeUpcomingEvent = {
  id: string;
  title: string;
  sportName: string;
  sportColor: string;
  location: string;
  circuit?: string;
  startAt: Date;
  endAt: Date;
  watchUrl: string;
  watchLabel: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
  };
};

export function isEventLive(event: GlobeUpcomingEvent, now = new Date()) {
  return now >= event.startAt && now <= event.endAt;
}

export function getNextTwoEvents(
  events: GlobeUpcomingEvent[],
  now = new Date(),
) {
  return [...events]
    .filter((event) => event.endAt >= now)
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
    .slice(0, 2);
}

export function formatEventDateRange(start: Date, end: Date) {
  const fmt = (date: Date, includeYear = false) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(includeYear && { year: "numeric" }),
    });

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${fmt(start)} – ${end.getDate()}`;
  }

  return `${fmt(start)} – ${fmt(end, true)}`;
}

const watchBtnClass =
  "font-mono text-xs tracking-[0.08em] uppercase text-cn-text no-underline inline-flex items-center gap-2 px-[14px] py-[9px] border border-cn-line-strong rounded-sm transition-all duration-200 hover:border-cn-orange hover:text-cn-orange mt-5";

function LiveBadge({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <span className="font-mono text-xs font-medium tracking-[0.14em] uppercase p-2 rounded-4xl inline-flex items-center gap-2 w-fit bg-cn-accent/14 text-[#ff7676] border border-cn-accent/30">
      <span
        className={cn(
          "inline-block w-2 h-2 rounded-full bg-cn-accent",
          !reducedMotion && "animate-cn-pulse",
        )}
      />
      Happening now
    </span>
  );
}

function CountdownRow({
  targetDate,
  reducedMotion,
}: {
  targetDate: Date;
  reducedMotion: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  );

  useEffect(() => {
    const interval = reducedMotion ? 60_000 : 1_000;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, interval);

    return () => clearInterval(timer);
  }, [targetDate, reducedMotion]);

  const units = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Min", value: timeLeft.minutes },
    ],
    [timeLeft],
  );

  return (
    <div
      className="grid grid-cols-3 gap-2 mt-4"
      aria-live="polite"
      aria-label="Countdown to event start"
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center rounded-lg border border-cn-line bg-white/2 px-2 py-2.5"
        >
          <span className="font-display font-extrabold text-[clamp(22px,2.5vw,28px)] leading-none text-cn-accent tabular-nums">
            {unit.value}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cn-muted mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function GlobeEventCard({
  event,
  variant,
  showCountdown = false,
  delay = 0,
}: {
  event: GlobeUpcomingEvent;
  variant: "featured" | "secondary";
  showCountdown?: boolean;
  delay?: number;
}) {
  const live = isEventLive(event);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "border border-cn-line rounded-3xl px-5 py-6 relative overflow-hidden flex flex-col transition-[opacity,transform] duration-800 ease-spring",
        variant === "featured" && live
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))]"
          : "bg-linear-to-b from-white/3 to-transparent",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      <span
        className="absolute left-0 top-0 h-1 w-full shadow-[0_0_10px_var(--cn-accent-glow)]"
        style={{ backgroundColor: event.sportColor }}
      />

      <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase text-cn-muted">
        {event.sportName}
      </span>

      <h3 className="font-display font-extrabold text-xl md:text-3xl line-clamp-2 leading-tight mt-2 uppercase tracking-[-0.02em]">
        {event.title}
      </h3>

      <p className="text-sm text-cn-muted mt-2 leading-snug">
        <span className="line-clamp-1">{event.location}</span>
      </p>

      <div className="mt-4">
        {live ? (
          <LiveBadge reducedMotion={reducedMotion} />
        ) : showCountdown ? (
          <CountdownRow
            targetDate={event.startAt}
            reducedMotion={reducedMotion}
          />
        ) : (
          <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase text-cn-muted">
            {formatEventDateRange(event.startAt, event.endAt)}
          </span>
        )}
      </div>

      <a
        href={event.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={watchBtnClass}
      >
        {event.watchLabel}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
