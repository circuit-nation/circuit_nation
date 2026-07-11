"use client";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { trackEvent } from "~/lib/analytics";
import MetricCard from "./metric-card";
import { landingContainerClass } from "./landing-shell";

const STATS = [
  {
    target: 1000000,
    compact: true,
    suffix: "+",
    delay: 0.7,
    label: "Reach across Social Media Platforms",
    featured: true,
    tag: "Social impressions / month",
  },
  {
    target: 95000,
    compact: true,
    suffix: "+",
    label: "Weekly Visitors",
    delay: 0.78,
    tag: "Reddit",
    link: "https://www.reddit.com/r/circuit_nation",
  },
  {
    target: 2220,
    compact: true,
    suffix: "+",
    label: "Followers",
    delay: 0.86,
    tag: "Instagram",
    link: "https://www.instagram.com/circuit_nation_",
  },
  {
    target: 1500,
    compact: true,
    suffix: "+",
    label: "Subscribers",
    delay: 0.88,
    tag: "Youtube",
    link: "https://www.youtube.com/@circuit_nation",
  },
  {
    target: 50,
    compact: true,
    suffix: "+",
    label: "Subscribers",
    delay: 0.86,
    tag: "Substack",
    link: "https://circuitnation.substack.com/",
  },
];

export default function LandingHero() {
  const streaksRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.5, triggerOnce: true });

  useEffect(() => {
    if (sectionInView) trackEvent('section_view', { section: 'hero' });
  }, [sectionInView]);

  useEffect(() => {
    const container = streaksRef.current;
    if (!container) return;

    const streaks: HTMLDivElement[] = [];
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("div");
      s.style.cssText = `
        position:absolute; height:1px; width:${28 + Math.random() * 30}vw;
        background:linear-gradient(90deg,transparent,rgba(255,45,45,0) 10%,rgba(255,45,45,0.45) 70%,rgba(255,255,255,0.6));
        top:${8 + i * 13}%;
        animation:cn-streak ${3.2 + Math.random() * 3}s linear infinite;
        animation-delay:${Math.random() * 4}s;
        opacity:${0.3 + Math.random() * 0.5};
        transform:translateX(-120%) rotate(-14deg);
        will-change:transform,opacity;
      `;
      container.appendChild(s);
      streaks.push(s);
    }

    return () => {
      streaks.forEach((streak) => streak.remove());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="flex flex-col justify-center py-12 overflow-hidden relative"
        id="top"
      >
        {/* Speed streaks — JS-injected, inline styles intentional */}
        <div
          ref={streaksRef}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50"
        />

        {/* Grid floor — perspective transform, inline style intentional */}
        <div
          className="absolute left-0 right-0 -bottom-0.5 h-[42vh] z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(90deg,var(--cn-line) 1px,transparent 1px),linear-gradient(0deg,var(--cn-line) 1px,transparent 1px)",
            backgroundSize: "70px 70px",
            WebkitMaskImage: "linear-gradient(180deg,transparent,#000 80%)",
            maskImage: "linear-gradient(180deg,transparent,#000 80%)",
            transform: "perspective(420px) rotateX(62deg) scale(1.6)",
            transformOrigin: "bottom",
          }}
        />

        <div className={landingContainerClass}>
          <h1 className="font-display font-extrabold uppercase text-center leading-[0.85] sm:leading-[0.8] text-[clamp(48px,14vw,122px)] animate-cn-fade opacity-0 [animation-delay:0.5s] mt-6">
            Circuit <span className="text-cn-accent">Nation</span>
          </h1>

          <div className="max-w-lg mx-auto mt-8 text-center space-y-2 text-sm opacity-0 [animation-delay:0.5s] animate-cn-fade">
            <h2 className="text-xl">
              Your Ultimate Hub For Everything Motorsports
            </h2>
            <p className="">
              Formula 1, MotoGP, WEC and other circuit sports with engineering
              obsession behind it all, gathered into one home for the fans who
              never miss lights-out.
            </p>
          </div>
          <div className="w-full grid gap-4 mt-12 sm:mt-16 grid-cols-[1.6fr_1fr_1fr] auto-rows-[minmax(140px,auto)] sm:auto-rows-[minmax(180px,auto)] max-[1080px]:grid-cols-[repeat(2,1fr)] max-[620px]:grid-cols-[1fr]">
            {STATS.map((stat, index) => (
              <MetricCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
