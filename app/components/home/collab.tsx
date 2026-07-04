"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

const BRANDS = [
  "APEX TV",
  "BOX BOX RADIO",
  "GRIDLINE",
  "PIT LANE",
  "SLIPSTREAM",
  "REV LABS",
  "DOWNFORCE",
  "TIFOSI CO.",
  "OVERSTEER",
  "PARC FERME",
];

const CASES = [
  {
    kicker: "Creator series",
    title: "The Apex Files",
    desc: "A six-part watch-along series co-hosted with a 1.2M-sub racing channel.",
    stats: [
      ["3.4M", "views"],
      ["+8K", "new members"],
    ],
  },
  {
    kicker: "Podcast",
    title: "Box Box Radio",
    desc: "Weekly strategy pod recorded with the community calling the shots live.",
    stats: [
      ["42", "episodes"],
      ["#3", "motorsport pods"],
    ],
  },
  {
    kicker: "Sim league",
    title: "Circuit Nation GP",
    desc: "A full endurance championship across 12 grids and three platforms.",
    stats: [
      ["240", "drivers"],
      ["12", "rounds"],
    ],
  },
];

export default function LandingCollab() {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: wallRef, inView: wallIn } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="pt-[30px] pb-[120px]">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Previous collaborations" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Social Media Collaborations
          </h2>
        </div>
      </div>

      <div
        ref={wallRef}
        className={cn(
          "mt-14 border-t border-b border-cn-line overflow-hidden relative py-2 transition-[opacity,transform] duration-800 ease-spring",
          wallIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <div className="absolute top-0 bottom-0 left-0 w-36 z-4 pointer-events-none bg-linear-to-r from-cn-bg to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-36 z-4 pointer-events-none bg-linear-to-l from-cn-bg to-transparent" />
        <div
          className="flex items-center gap-14 w-max animate-cn-marquee-32"
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div
              key={i}
              className="font-display font-bold text-lg tracking-[-0.01em] text-cn-muted-2 py-5 whitespace-nowrap opacity-70 transition-[color,opacity] duration-250 hover:text-cn-text hover:opacity-100"
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div className="grid grid-cols-3 max-nav:grid-cols-1 gap-[18px] mt-14">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className={cn(cnCardClass, "!p-0 overflow-hidden")}>
                <div className="h-[200px] border-b border-cn-line bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                  <span className="absolute left-[14px] bottom-3 font-mono text-xs font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                    {c.kicker.toLowerCase()} keyart
                  </span>
                </div>
                <div className="p-6">
                  <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-accent">
                    {c.kicker}
                  </span>
                  <h3 className="font-display font-bold text-lg mt-3 tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="text-cn-muted text-sm mt-[10px]">{c.desc}</p>
                  <div className="flex gap-[22px] mt-5">
                    {c.stats.map(([val, lbl]) => (
                      <div key={lbl}>
                        <b className="font-display font-extrabold text-lg block">
                          {val}
                        </b>
                        <span className="font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
                          {lbl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
