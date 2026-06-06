"use client";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SectionEyebrow } from "./section-eyebrow";

const PLATFORMS = [
  { name: "Discord", count: "32K+", desc: "The live garage", cta: "Join Discord", href: "#", red: true },
  { name: "Reddit", count: "28K+", desc: "Threads & AMAs", cta: "Follow r/CircuitNation", href: "#" },
  { name: "Newsletter", count: "15K+", desc: "The Friday Briefing", cta: "Subscribe free", href: "#nl" },
];

export default function LandingJoin() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="join" className="pt-[30px] pb-[110px]">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
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

          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[clamp(40px,6vw,92px)] max-w-[760px] relative mt-5">
            Pull onto<br />the grid.
          </h2>
          <p className="text-cn-muted mt-[22px] max-w-[520px] text-sm relative">
            Pick your platform and jump in. The next race is always closer than you think — don't watch it alone.
          </p>

          <div className="grid grid-cols-3 max-nav:grid-cols-1 gap-4 mt-12 relative">
            {PLATFORMS.map(p => (
              <div
                key={p.name}
                className="border border-cn-line rounded-[20px] p-6 flex flex-col gap-[14px] bg-cn-bg/50 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-cn-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-muted-2">{p.name}</span>
                </div>
                <div className="font-display font-extrabold text-xl tracking-[-0.02em]">{p.count}</div>
                <h3 className="font-display font-bold text-lg">{p.desc}</h3>
                <Button
                  variant={p.red ? "cn-primary" : "cn-ghost"}
                  size="cn"
                  asChild
                  className="mt-2"
                >
                  <a href={p.href}>
                    {p.red && <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />}
                    {p.cta}
                  </a>
                </Button>
              </div>
            ))}
          </div>

          <form
            id="nl"
            className="flex gap-3 mt-7 max-w-[520px] relative flex-wrap"
            onSubmit={e => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
          >
            <Input
              type="email"
              placeholder="you@trackside.com"
              aria-label="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitted}
              className="flex-1 min-w-[220px]"
            />
            <Button
              type="submit"
              variant="cn-primary"
              size="cn"
              disabled={submitted}
            >
              {submitted ? (
                "On the grid"
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  Get the briefing
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
