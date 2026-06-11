"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";
import MetricCard from "./metric-card";

const STATS = [
  {
    target: 1000000,
    compact: true,
    suffix: "+",
    label: "Reach across Reddit, YouTube, Instagram & X",
    featured: true,
    tag: "Social impressions / month",
  },
  {
    target: 95000,
    compact: true,
    suffix: "+",
    label: "Weekly Visitors",
    delay: 0.08,
  },
  {
    target: 10000,
    compact: true,
    suffix: "+",
    label: "Followers",
    delay: 0.16,
  },
  {
    target: 150,
    compact: true,
    suffix: "+",
    label: "Discussion threads",
    delay: 0.08,
  },
  {
    target: 50,
    compact: true,
    suffix: "+",
    label: "AMA participants",
    delay: 0.16,
  },
];

export default function LandingProof() {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="py-24">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div
          ref={headRef}
          className={cn(
            "max-w-3xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// By the numbers" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            The grid is
            <br />
            getting loud.
          </h2>
        </div>

        <div className="grid gap-4 mt-16 grid-cols-[1.6fr_1fr_1fr] auto-rows-[minmax(180px,auto)] max-[1080px]:grid-cols-[repeat(2,1fr)] max-[620px]:grid-cols-[1fr]">
          {STATS.map((stat, index) => (
            <MetricCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
