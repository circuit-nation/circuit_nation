"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

const META_TAGS = ["EST. 2025", "FAN-OWNED", "SERIES-AGNOSTIC", "ALWAYS ONLINE"] as const;

export default function LandingWhat() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="py-24">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2 flex flex-col items-center text-center">

        <div
          ref={headRef}
          className={cn(
            "w-full max-w-3xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// What is Circuit Nation" className="justify-center" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Who Are We
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-lg mx-auto">
            Not a feed. Not a fan club. A living garage where strategy nerds, sim racers, meme lords and lifelong tifosi argue, analyse and celebrate every lap together.
          </p>
        </div>

        <Reveal className="mt-16 w-full max-w-3xl">
          <article className={cn(cnCardClass, "flex flex-col items-center gap-0")}>
            <div className="font-body text-[15px] leading-[1.8] text-cn-muted flex flex-col gap-6 max-w-[65ch] mx-auto">
              <p>
                We built Circuit Nation because the best part of race weekend is not the race. It is the{" "}
                <strong className="text-cn-text font-semibold">people you watch it with.</strong>{" "}
                Fan-owned since 2025, series-agnostic, and always online.
              </p>
              <p>
                Inside you will find day-one F1 and MotoGP diehards arguing tyre strategy at 2am, sim racers chasing the apex, engineers who read the regs for fun, and newcomers who just caught the bug. Lap-by-lap breakdowns go deeper than any broadcast booth. Floor edges, DRS trains, and gearbox ratios get explained by people who genuinely love the technical side.
              </p>
              <p>
                From lights out to chequered flag, the live chat is electric. Leagues, setups, and clean racing span rookies on a wheel to alien-pace endurance crews. The funniest corner of motorsport Twitter lives here too, relocated and refined. GP watch-alongs, track days, and IRL link-ups spill the community off the screen and onto the grid.
              </p>
            </div>

            <div className="flex gap-6 flex-wrap justify-center font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2 mt-10 pt-8 border-t border-cn-line w-full">
              {META_TAGS.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <p
              className="font-handwriting text-[clamp(32px,5vw,48px)] text-cn-text mt-8 leading-[1.1] pb-1"
              aria-hidden="true"
            >
              Circuit Nation
            </p>
            <span className="sr-only">Signed, Circuit Nation</span>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
