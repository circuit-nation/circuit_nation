export function RaceMarquee() {
  const RACES = [
    ["F1", "Monaco GP", "May 24"],
    ["MotoGP", "Mugello", "Jun 01"],
    ["F1", "Canadian GP", "Jun 15"],
    ["WEC", "Le Mans 24h", "Jun 14"],
    ["MotoGP", "Assen TT", "Jun 29"],
    ["F1", "British GP · Silverstone", "Jul 06"],
    ["F1", "Spa-Francorchamps", "Jul 27"],
    ["MotoGP", "Red Bull Ring", "Aug 17"],
    ["F1", "Monza", "Sep 07"],
    ["F1", "Singapore GP", "Oct 05"],
    ["MotoGP", "Phillip Island", "Oct 19"],
    ["F1", "Las Vegas GP", "Nov 22"],
  ];

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
        {[...RACES, ...RACES].map(([series, name, date], i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-8 py-4 font-mono text-xs tracking-[0.1em] uppercase text-cn-muted whitespace-nowrap"
          >
            <span className="size-2 rounded-full bg-cn-accent shadow-[0_0_8px_(--cn-accent-glow)] shrink-0" />
            <span className="text-cn-muted-2 text-xs">{series}</span>
            <b className="text-cn-text font-medium">{name}</b>
            <span>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
