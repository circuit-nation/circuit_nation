"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass, cnAccentCardClass } from "~/components/ui/card";

const FEATURES = [
  {
    idx: "01", icon: <path d="M4 20V12M10 20V5M16 20V9M22 20V14" />,
    title: "Race Analysis",
    desc: "Lap-by-lap breakdowns, strategy calls and tyre-deg debates that go deeper than any broadcast booth.",
  },
  {
    idx: "02", icon: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><circle cx="12" cy="12" r="3" /></>,
    title: "Engineering Breakdowns",
    desc: "Floor edges, DRS trains and gearbox ratios — explained by people who genuinely love the technical regs.",
  },
  {
    idx: "03", icon: <><circle cx="12" cy="12" r="2.5" /><path d="M6.5 6.5a8 8 0 000 11M17.5 6.5a8 8 0 010 11" /></>,
    title: "Live Race Reactions",
    desc: "Lights out to chequered flag, the chat is electric. Every overtake, every safety car, in real time.",
  },
  {
    idx: "04", icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.4" /><path d="M4 13h6M14 13h6M12 14.5V21" /></>,
    title: "Sim Racing Culture",
    desc: "Leagues, setups and clean racing — from rookies on a wheel to alien-pace endurance crews.",
  },
  {
    idx: "05", icon: <><path d="M4 5h16v10H9l-4 4z" /><path d="M8.5 10h.01M12 10h.01M15.5 10h.01" /></>,
    title: "Memes & Banter",
    desc: "The funniest corner of motorsport Twitter — relocated, refined and posted before the stewards rule.",
  },
  {
    idx: "06", icon: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0111 0" /><path d="M16 5.5a3 3 0 010 5.8M20.5 20a5.5 5.5 0 00-3.5-5.1" /></>,
    title: "Fan Meetups",
    desc: "GP watch-alongs, track days and IRL link-ups — the community spills out of the screen and onto the grid.",
  },
];

export default function LandingWhat() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="py-24">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">

        <div
          ref={headRef}
          className={cn(
            "max-w-3xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// What is Circuit Nation" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            A paddock that<br />never closes.
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-lg">
            Not a feed. Not a fan club. A living garage where strategy nerds, sim racers, meme lords and lifelong tifosi argue, analyse and celebrate every lap together.
          </p>
        </div>

        <div className="grid grid-cols-3 max-nav:grid-cols-2 max-[620px]:grid-cols-1 gap-4 mt-16">

          <Reveal className="col-span-2 max-[620px]:col-span-1">
            <div className={cn(cnCardClass, "flex flex-col justify-between gap-8 min-h-56")}>
              <div className="font-display font-bold text-[clamp(24px,2.6vw,34px)] leading-[1.2] tracking-[-0.02em]">
                We built Circuit Nation because the best part of race weekend isn't the race — it's the{" "}
                <b className="text-cn-accent font-bold">people you watch it with.</b>
              </div>
              <div className="flex gap-6 flex-wrap font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
                {["EST. 2025", "FAN-OWNED", "SERIES-AGNOSTIC", "ALWAYS ONLINE"].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className={cn(cnAccentCardClass, "flex flex-col justify-center gap-4")}>
              <div className="font-display font-bold text-lg">Who's inside?</div>
              <ul className="list-none flex flex-col gap-2">
                {["Day-one F1 & MotoGP diehards", "Sim racers chasing the apex", "Engineers who read the regs for fun", "Newcomers who just caught the bug"].map(item => (
                  <li key={item} className="text-cn-muted text-sm flex gap-2 items-start">
                    <span className="text-cn-accent font-bold">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {FEATURES.map((f, i) => (
            <Reveal key={f.idx} delay={i % 3 === 1 ? 0.08 : i % 3 === 2 ? 0.16 : 0}>
              <div className={cn(cnCardClass, "relative overflow-hidden hover:border-cn-accent/40 hover:shadow-[0_22px_60px_-22px_(--cn-accent-glow)]")}>
                <span className="absolute top-6 right-6 font-mono text-sm text-cn-muted-2">{f.idx}</span>
                <div className="size-12 rounded-2xl border border-cn-line-strong bg-cn-accent/6 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="size-6 stroke-cn-accent fill-none stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-display font-bold text-sm mt-5 tracking-[-0.01em]">{f.title}</h3>
                <p className="text-cn-muted text-sm mt-2">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
