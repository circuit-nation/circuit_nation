"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

function Avatar({ initials, red = false }: { initials: string; red?: boolean }) {
  return (
    <div className={cn(
      "w-10 h-10 rounded-full shrink-0 border border-cn-line-strong grid place-items-center font-mono text-sm font-bold",
      red
        ? "bg-[linear-gradient(150deg,rgba(255,90,31,0.5),#161619)] text-white"
        : "bg-[linear-gradient(150deg,#2a2a30,#161619)] text-cn-muted",
    )}>
      {initials}
    </div>
  );
}

function UpvoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-cn-orange fill-none stroke-[1.8]">
      <path d="M12 4l7 8h-4v8H9v-8H5z" />
    </svg>
  );
}

function Badge({ type }: { type: "live" | "up" | "trend" }) {
  return (
    <span className={cn(
      "font-mono text-xs font-medium tracking-[0.14em] uppercase p-2 rounded-4xl inline-flex items-center gap-2 w-fit",
      type === "live" && "bg-cn-accent/14 text-[#ff7676] border border-cn-accent/30",
      type === "up" && "bg-cn-orange/12 text-cn-orange border border-cn-orange/28",
      type === "trend" && "bg-white/5 text-cn-muted border border-cn-line-strong",
    )}>
      {type === "live" && (
        <span className="inline-block w-2 h-2 rounded-full bg-cn-accent animate-cn-pulse" />
      )}
      {type === "live" ? "Live now" : type === "up" ? "Upcoming · Fri 18:00 GMT" : "Trending this week"}
    </span>
  );
}

const readBtnClass = "font-mono text-xs tracking-[0.08em] uppercase text-cn-text no-underline inline-flex items-center gap-2 px-[14px] py-[9px] border border-cn-line-strong rounded-sm transition-all duration-200 hover:border-cn-orange hover:text-cn-orange";

export default function LandingAMAs() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="amas" className="pt-8 pb-32">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div
          ref={headRef}
          className={cn(
            "max-w-180 transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Reddit AMAs" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Ask the<br />paddock anything.
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-150">
            We bring racing's most interesting voices straight into the community — creators, engineers, sim aces and commentators, live and unfiltered.
          </p>
        </div>

        <div className="grid grid-cols-[1.4fr_1fr] max-nav:grid-cols-1 gap-4 mt-16">

          <Reveal>
            <div className={cn(cnCardClass, "p-0! overflow-hidden")}>
              <div className="h-70 w-full border-b border-cn-line bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                <span className="absolute left-4 bottom-3 font-mono text-xs font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                  AMA host portrait
                </span>
              </div>
              <div className="p-7">
                <Badge type="live" />
                <h3 className="font-display font-bold text-[clamp(26px,3vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4">
                  "I spent 9 years on an F1 pit wall. Ask me about strategy calls under pressure."
                </h3>
                <p className="text-cn-muted text-sm mt-4">
                  A former race strategist breaks down the undercut, the gamble that won a title, and the radio messages you never heard.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Avatar initials="JR" red />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-sm">Jamie Renault</b>
                    <span className="font-mono text-xs text-cn-muted-2 tracking-[0.06em]">u/pitwall_jr · ex-Race Strategist</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <a href="#" className={readBtnClass}>Read AMA →</a>
                  <span className="font-mono text-xs text-cn-muted-2 inline-flex items-center gap-2">
                    <UpvoteIcon />4.2k upvotes
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 content-start">
            <Reveal delay={0.08}>
              <div className={cn(cnCardClass, "flex flex-col gap-4")}>
                <Badge type="up" />
                <h3 className="font-display font-bold text-[clamp(22px,2.4vw,30px)] tracking-[-0.02em] leading-[1.1]">
                  The sim racer who turned laps into a pro F4 seat.
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar initials="KS" />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-sm">Kai Sorensen</b>
                    <span className="font-mono text-xs text-cn-muted-2 tracking-[0.06em]">u/apex_kai · Sim to Real</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <a href="#" className={readBtnClass}>Set reminder →</a>
                  <span className="font-mono text-xs text-cn-muted-2 inline-flex items-center gap-2">
                    <UpvoteIcon />880 waiting
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className={cn(cnCardClass, "flex flex-col gap-4")}>
                <Badge type="trend" />
                <h3 className="font-display font-bold text-[clamp(22px,2.4vw,30px)] tracking-[-0.02em] leading-[1.1]">
                  Aero engineer explains why the floor is everything.
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar initials="MA" />
                  <div className="flex flex-col">
                    <b className="font-body font-semibold text-sm">Dr. Mara Aoki</b>
                    <span className="font-mono text-xs text-cn-muted-2 tracking-[0.06em]">u/ground_effect · Aerodynamicist</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <a href="#" className={readBtnClass}>Read AMA →</a>
                  <span className="font-mono text-xs text-cn-muted-2 inline-flex items-center gap-4">
                    <UpvoteIcon />2.7k upvotes
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
