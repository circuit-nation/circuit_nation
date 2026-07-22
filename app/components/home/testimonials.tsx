"use client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { trackEvent } from "~/lib/analytics";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";
import { landingContainerClass, landingSectionClass } from "./landing-shell";

const QUOTES = [
  {
    body: "I've watched F1 for 3 years and never had people to watch with. Now I've got them. I love the watch parties and discord watchalongs.",
    name: "Animesh S.",
    role: "Member since 2025",
  },
  {
    body: "The engineering breakdowns are genuinely better than half the paid analysis out there. I learned more here in a month than in years of just watching.",
    name: "Priya R.",
    role: "Sim racer",
  },
  {
    body: "Hosted an AMA expecting twenty questions. Got four hundred. This is the most clued-up motorsport audience I've ever talked to.",
    name: "Tom C.",
    role: "Racing creator · 600K subs",
  },
  {
    body: "Came for the memes, stayed for the strategy threads. Somehow it's both the funniest and the smartest place I follow racing.",
    name: "Amara K.",
    role: "Member since 2024",
  },
  {
    body: "Our sim league grid filled in 48 hours. The clean racing and the post-race debriefs are next level. Properly organised, properly fun.",
    name: "Nico F.",
    role: "League admin",
  },
  {
    body: "Got into MotoGP three months ago with zero clue. Asked a dumb question, got ten kind, detailed answers. That's the whole vibe.",
    name: "Sara B.",
    role: "New fan",
  },
];

function QuoteCard({
  body,
  name,
  role,
}: {
  body: string;
  name: string;
  role: string;
}) {
  return (
    <div className="w-[300px] sm:w-[380px] shrink-0 rounded-xl bg-cn-panel px-6 py-6 flex flex-col gap-4">
      <p className="text-sm text-cn-text leading-[1.6]">{body}</p>
      <div>
        <b className="font-body font-semibold text-sm block">{name}</b>
        <span className="font-mono text-xs text-cn-muted-2">{role}</span>
      </div>
    </div>
  );
}

export default function LandingTestimonials() {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (sectionInView) trackEvent("section_view", { section: "testimonials" });
  }, [sectionInView]);

  const items = [...QUOTES, ...QUOTES];

  return (
    <section ref={sectionRef} className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// From the community" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Why fans
            <br />
            stay on the grid.
          </h2>
        </div>
      </div>

      <div
        className="mt-16 overflow-hidden relative"
        style={{
          maskImage:
            "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
        }}
      >
        <div
          className="flex w-max gap-4 animate-cn-marquee-60"
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {items.map((q, i) => (
            <QuoteCard key={`${q.name}-${i}`} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}
