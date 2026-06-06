"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";

function PlayIcon({ size = 64, small = false }: { size?: number; small?: boolean }) {
  return (
    <div
      className="rounded-full bg-[rgba(255,45,45,0.92)] grid place-items-center shadow-[0_10px_40px_-8px_var(--cn-accent-glow)] transition-transform duration-300"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        className="fill-white"
        style={{ width: small ? 14 : 22, height: small ? 14 : 22, marginLeft: small ? 2 : 3 }}
      >
        <path d="M6 4l14 8-14 8z" />
      </svg>
    </div>
  );
}

const THUMBS = [
  { cat: "Engineering", title: "Ground effect, explained in 9 minutes", views: "88K views", dur: "9:10" },
  { cat: "Highlights", title: "Top 10 overtakes of the season so far", views: "301K views", dur: "5:33" },
  { cat: "Podcast clip", title: "Is MotoGP the best racing on earth right now?", views: "56K views", dur: "24:07" },
];

export default function LandingVideos() {
  const { ref: headRef, inView: headIn } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="pt-[30px] pb-[120px]">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-[2]">
        <div
          ref={headRef}
          className="max-w-[720px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: headIn ? 1 : 0, transform: headIn ? "none" : "translateY(26px)", transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        >
          <SectionEyebrow label="// Watch" />
          <h2 className="font-display font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[clamp(40px,5.5vw,78px)] mt-5">
            Press play,<br />lights out.
          </h2>
        </div>

        <div className="grid [grid-template-columns:1.5fr_1fr] max-nav:grid-cols-1 gap-[18px] mt-16">
          <Reveal>
            <div className={cn(cnCardClass, "!p-0 overflow-hidden group cursor-pointer")}>
              <div className="relative overflow-hidden">
                <div className="h-[420px] w-full bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 relative">
                  <span className="absolute left-[14px] bottom-3 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-cn-muted-2">
                    Featured video
                  </span>
                </div>
                <div className="absolute inset-0 grid place-items-center z-[3]">
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    <PlayIcon />
                  </div>
                </div>
                <span className="absolute right-3 bottom-3 z-[3] font-mono text-[11px] bg-black/70 px-2 py-1 rounded-[6px] text-cn-text">18:42</span>
              </div>
              <div className="px-6 py-[22px]">
                <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-cn-accent">Watch-along</span>
                <h3 className="font-display font-bold tracking-[-0.01em] mt-[10px] leading-[1.2] text-[clamp(22px,2.4vw,30px)]">
                  Monaco GP, every radio call decoded — live community reaction
                </h3>
                <div className="font-mono text-[11px] text-cn-muted-2 mt-[10px]">142K views · 2 days ago</div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-[18px] content-start">
            {THUMBS.map((v) => (
              <Reveal key={v.title} delay={0.08}>
                <div className={cn(cnCardClass, "!p-0 grid [grid-template-columns:150px_1fr] items-stretch cursor-pointer group max-[620px]:[grid-template-columns:120px_1fr]")}>
                  <div className="relative overflow-hidden">
                    <div className="h-full min-h-[104px] w-full bg-[repeating-linear-gradient(135deg,#141417,#141417_11px,#17171b_11px,#17171b_22px)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                    <div className="absolute inset-0 grid place-items-center z-[3]">
                      <PlayIcon size={40} small />
                    </div>
                    <span className="absolute right-2 bottom-2 z-[3] font-mono text-[11px] bg-black/70 px-[6px] py-[3px] rounded-[5px] text-cn-text">{v.dur}</span>
                  </div>
                  <div className="px-[18px] py-4 flex flex-col justify-center">
                    <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-cn-accent">{v.cat}</span>
                    <h3 className="font-display font-bold tracking-[-0.01em] mt-[6px] leading-[1.2] text-[16px]">{v.title}</h3>
                    <div className="font-mono text-[11px] text-cn-muted-2 mt-2">{v.views}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
