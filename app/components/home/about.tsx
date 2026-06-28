"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { cnCardClass } from "~/components/ui/card";

export default function LandingWhat() {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="about" className="pt-12 pb-24">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2 flex flex-col items-center text-center">
        <div
          ref={headRef}
          className={cn(
            "w-full max-w-3xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Who Are We
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-lg mx-auto">
            Not a feed. Not a fan club. A living garage where strategy nerds,
            sim racers, meme lords and lifelong tifosi argue, analyse and
            celebrate every lap together.
          </p>
        </div>

        <Reveal className="mt-16 w-full max-w-3xl">
          <article
            className={cn(cnCardClass, "hover:translate-0", "flex flex-col items-center gap-0")}
          >
            <div className="font-body text-[15px] leading-[1.8] text-cn-muted flex flex-col gap-6 max-w-[65ch] mx-auto">
              <p>
                We built Circuit Nation because the best part of race weekend
                isn’t the race, it’s the{" "}
                <strong className="text-cn-text font-semibold">
                  people you watch it with.
                </strong>{" "}
                Fan-owned since 2025, series-agnostic, and always online.
              </p>
              <p>
                Join F1 and MotoGP fans, sim racers, engineers, and newcomers
                who love motorsport. From race breakdowns and strategy debates
                to live chat, leagues, watch-alongs, and IRL meetups, this is
                where motorsport fans hang out.
              </p>
              {/*<p>
                From lights out to chequered flag, the live chat is electric.
                Leagues, setups, and clean racing span rookies on a wheel to
                alien-pace endurance crews. The funniest corner of motorsport
                Twitter lives here too, relocated and refined. GP watch-alongs,
                track days, and IRL link-ups spill the community off the screen
                and onto the grid.
              </p>*/}
            </div>

            <p
              className="font-handwriting text-4xl text-cn-text mt-8 pb-1"
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
