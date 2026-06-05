"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

const SMALL_POSTS = [
  { cat: "Hot Take", title: "It's time to admit the sprint format actually works.", meta: "4 min · 206 comments" },
  { cat: "Technical", title: "Why everyone's copying that weird front wing.", meta: "7 min · 141 comments" },
  { cat: "Paddock Drama", title: "The radio war that's quietly splitting a title fight.", meta: "5 min · 402 comments" },
  { cat: "Strategy", title: "Mapping the perfect two-stop nobody dared to try.", meta: "9 min · 87 comments" },
];

export default function LandingPosts() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="content" className="pt-[30px] pb-[120px]">
      <div className="max-w-[var(--cn-maxw)] mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        >
          <SectionEyebrow label="// Latest posts" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Hot off<br />the pit wall.
          </h2>
        </div>

        <div className="grid [grid-template-columns:1.4fr_1fr] max-nav:grid-cols-1 gap-[18px] mt-16">
          <Reveal>
            <article className={cn(cnCardClass, "!p-0 flex flex-col overflow-hidden")}>
              <div className="h-[360px] border-b border-cn-line flex-1 bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] relative">
                <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                  Featured article hero
                </span>
              </div>
              <div className="p-8">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-accent inline-flex items-center gap-[9px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-cn-accent inline-block" />
                  Race Analysis
                </span>
                <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.06] mt-3 text-[clamp(26px,3vw,40px)]">
                  The undercut that wasn't: how three teams misread the same pit window
                </h3>
                <p className="text-cn-muted mt-4 max-w-[540px] text-[15px]">
                  We charted every stint from the weekend and found the strategy call everyone defended was the slowest path to the podium.
                </p>
                <div className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em] mt-3 flex gap-[14px]">
                  <span>12 min read</span><span>·</span><span>May 26, 2026</span><span>·</span><span>318 comments</span>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-[18px]">
            {SMALL_POSTS.map((p, i) => (
              <Reveal key={p.title} delay={i < 2 ? 0.08 : 0.16}>
                <article className={cn(cnCardClass, "!p-[22px_24px] flex gap-5 items-center cursor-pointer")}>
                  <div className="w-24 h-24 rounded-[12px] shrink-0 bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] border border-cn-line" />
                  <div>
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cn-accent">{p.cat}</span>
                    <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.2] mt-2 text-[17px]">{p.title}</h3>
                    <div className="font-mono text-[11px] text-cn-muted-2 tracking-[0.06em] mt-2">{p.meta}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
