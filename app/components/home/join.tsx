"use client";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { SectionEyebrow } from "./section-eyebrow";
import { trackEvent } from "~/lib/analytics";
import { landingContainerClass, landingSectionClass } from "./landing-shell";

const PLATFORMS = [
  {
    name: "Newsletter",
    count: "50+ Readers",
    cta: "Subscribe",
    href: "https://circuitnation.substack.com/",
    red: true,
  },
  {
    name: "Reddit",
    count: "98K+ Visitors",
    cta: "Follow on Reddit",
    href: "https://www.reddit.com/r/circuit_nation/",
  },
  {
    name: "YouTube",
    count: "1.2K+ Subscribers",
    cta: "Subscribe on YouTube",
    href: "https://www.youtube.com/@circuit_nation",
  },
];

export default function LandingJoin() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="join" className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div
          ref={ref}
          className={cn(
            "border border-cn-line rounded-[28px] relative overflow-hidden bg-[linear-gradient(160deg,rgba(255,45,45,0.14),rgba(255,255,255,0.004))] transition-[opacity,transform] duration-800 ease-spring",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ padding: "clamp(40px,6vw,80px)" }}
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_400px_at_85%_10%,rgba(255,45,45,0.22),transparent_60%)]" />

          <SectionEyebrow label="// Join the community" className="relative" />

          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[clamp(40px,6vw,72px)] max-w-[760px] relative mt-5">
            Pull onto
            <br />
            the grid.
          </h2>
          <p className="text-cn-muted mt-[22px] max-w-[520px] text-sm relative">
            Pick your platform and jump in. The next race is always closer than
            you think, don't watch it alone.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12 relative">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="border border-cn-line rounded-[20px] p-6 flex flex-col gap-[14px] bg-cn-bg/50 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-cn-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-muted-2">
                    {p.name}
                  </span>
                </div>
                <div className="font-display font-extrabold text-xl tracking-[-0.02em]">
                  {p.count}
                </div>
                <Button
                  variant={p.red ? "cn-primary" : "cn-ghost"}
                  size="cn"
                  asChild
                  className="mt-2 w-full whitespace-nowrap"
                  onClick={() => trackEvent('join_cta_click', { platform: p.name.toLowerCase() })}
                >
                  <a href={p.href}>{p.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
