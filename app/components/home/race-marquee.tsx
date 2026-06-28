import type { GlobeEvent } from "~/types/events";

type RaceMarqueeProps = {
  upcomingEvents: GlobeEvent[];
};

function formatMarqueeDate(startAt: string) {
  return new Date(startAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RaceMarquee({ upcomingEvents }: RaceMarqueeProps) {
  if (upcomingEvents.length === 0) {
    return null;
  }

  const items = upcomingEvents.map((event) => ({
    id: event.id,
    series: event.sportName,
    name: event.title,
    date: formatMarqueeDate(event.startAt),
  }));

  return (
    <div className="border-t border-b border-cn-line bg-cn-bg-2 mt-16 md:mt-26 my-4 overflow-hidden relative z-3">
      <div
        className="flex w-max animate-cn-marquee"
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex items-center gap-4 px-8 py-4 font-mono text-xs tracking-[0.1em] uppercase text-cn-muted whitespace-nowrap"
          >
            <span className="size-2 rounded-full bg-cn-accent shadow-[0_0_8px_(--cn-accent-glow)] shrink-0" />
            <span className="text-cn-muted-2 text-xs">{item.series}</span>
            <b className="text-cn-text font-medium">{item.name}</b>
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
