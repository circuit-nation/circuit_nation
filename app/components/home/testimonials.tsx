"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";

const QUOTES = [
  {
    body: "I've watched F1 for 20 years and never had people to scream at the TV with. Now I've got a thousand of them. This place ruined watching races alone forever.",
    name: "Diego L.",
    role: "Member since 2023",
    delay: 0,
    highlight: true,
  },
  {
    body: "The engineering breakdowns are genuinely better than half the paid analysis out there. I learned more here in a month than in years of just watching.",
    name: "Priya R.",
    role: "Sim racer",
    delay: 0.08,
  },
  {
    body: "Hosted an AMA expecting twenty questions. Got four hundred. This is the most clued-up motorsport audience I've ever talked to.",
    name: "Tom C.",
    role: "Racing creator · 600K subs",
    delay: 0.16,
    red: true,
  },
  {
    body: "Came for the memes, stayed for the strategy threads. Somehow it's both the funniest and the smartest place I follow racing.",
    name: "Amara K.",
    role: "Member since 2024",
    delay: 0,
  },
  {
    body: "Our sim league grid filled in 48 hours. The clean racing and the post-race debriefs are next level. Properly organised, properly fun.",
    name: "Nico F.",
    role: "League admin",
    delay: 0.08,
  },
  {
    body: "Got into MotoGP three months ago with zero clue. Asked a dumb question, got ten kind, detailed answers. That's the whole vibe.",
    name: "Sara B.",
    role: "New fan",
    delay: 0.16,
  },
];

function QuoteCard({
  body,
  name,
  role,
  highlight = false,
  red = false,
  delay = 0,
}: {
  body: string;
  name: string;
  role: string;
  highlight?: boolean;
  red?: boolean;
  delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      ref={ref}
      className={cn(
        "break-inside-avoid mb-[18px] border border-cn-line rounded-[20px] p-7 flex flex-col gap-[18px] transition-[opacity,transform] duration-800 ease-spring",
        highlight
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.12),rgba(255,255,255,0.004))]"
          : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      <div className="font-display font-extrabold text-2xl leading-[0.6] text-cn-accent h-6">
        "
      </div>
      <p className="text-sm text-cn-text leading-[1.55]">{body}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div
          className={cn(
            "w-10 h-10 rounded-full shrink-0 border border-cn-line-strong grid place-items-center font-mono text-sm font-bold",
            red
              ? "bg-[linear-gradient(150deg,rgba(255,90,31,0.5),#161619)] text-white"
              : "bg-[linear-gradient(150deg,#2a2a30,#161619)] text-cn-muted",
          )}
        >
          {initials}
        </div>
        <div>
          <b className="font-body font-semibold text-sm block">{name}</b>
          <span className="font-mono text-xs text-cn-muted-2">{role}</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingTestimonials() {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section className="pt-[30px] pb-[130px]">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
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

        <div className="columns-3 max-nav:columns-2 max-[620px]:columns-1 gap-[18px] mt-16">
          {QUOTES.map((q) => (
            <QuoteCard key={q.name} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}
