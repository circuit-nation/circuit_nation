"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { trackEvent } from "~/lib/analytics";
import { cn } from "~/lib/utils";
import { SectionEyebrow } from "./section-eyebrow";
import { landingContainerClass, landingSectionClass } from "./landing-shell";

const QUOTES = [
  {
    body: "I've watched F1 for 3 years and never had people to watch with. Now I've got them. I love the watch parties and discord watchalongs.",
    name: "Animesh S.",
    role: "Member since 2025",
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
        "break-inside-avoid mb-4 border border-cn-line rounded-2xl p-5 sm:p-7 flex flex-col gap-4 transition-[opacity,transform] duration-800 ease-spring",
        highlight
          ? "bg-[linear-gradient(160deg,rgba(255,45,45,0.12),rgba(255,255,255,0.004))]"
          : "bg-linear-to-b from-white/[0.028] to-white/[0.004]",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      <div className="text-4xl font-extrabold leading-[0.6] text-cn-accent h-6">
        &ldquo;&rdquo;
      </div>
      <p className="text-sm text-cn-text leading-[1.55]">{body}</p>
      <div className="flex items-center gap-3">
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
          {/*<span className="font-mono text-xs text-cn-muted-2">{role}</span>*/}
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
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.5, triggerOnce: true });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(QUOTES.length);

  useEffect(() => {
    if (sectionInView) trackEvent('section_view', { section: 'testimonials' });
  }, [sectionInView]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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

        {/* Mobile / tablet: carousel */}
        <div className="mt-16 md:hidden">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {QUOTES.map((q) => (
                <CarouselItem key={q.name} className="basis-full">
                  <QuoteCard {...q} delay={0} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
                {current} / {count}
              </p>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 border-cn-line bg-cn-panel text-cn-text hover:bg-cn-panel-2" />
                <CarouselNext className="static translate-y-0 border-cn-line bg-cn-panel text-cn-text hover:bg-cn-panel-2" />
              </div>
            </div>
          </Carousel>
        </div>

        {/* Desktop: masonry columns */}
        <div className="mt-16 hidden md:block columns-3 max-nav:columns-2 gap-[18px]">
          {QUOTES.map((q) => (
            <QuoteCard key={q.name} {...q} />
          ))}
        </div>
      </div>
    </section>
  );
}
