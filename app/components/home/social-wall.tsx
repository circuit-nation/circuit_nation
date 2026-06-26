"use client";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import {
  SOCIAL_WALL_SLOT_IDS,
  type SocialWallSlot,
  type SocialWallSlotId,
} from "~/types/social-wall";

type LandingSocialWallProps = {
  slots: SocialWallSlot[];
};

type PlatType = SocialWallSlot["platform"];

const platformLabel: Record<PlatType, string> = {
  yt: "YouTube",
  reddit: "Reddit",
  ig: "Instagram",
  substack: "Substack",
};

const platformAccent: Record<PlatType, string> = {
  yt: "text-cn-accent",
  reddit: "text-cn-orange",
  ig: "text-[#f58529]",
  substack: "text-cn-text",
};

const platformGradient: Record<PlatType, string> = {
  yt: "from-[rgba(255,45,45,0.22)] via-[rgba(20,20,23,0.92)] to-[#0d0d0f]",
  reddit: "from-[rgba(255,120,40,0.2)] via-[rgba(20,20,23,0.94)] to-[#0d0d0f]",
  ig: "from-[rgba(245,133,41,0.22)] via-[rgba(221,42,123,0.12)] to-[#0d0d0f]",
  substack: "from-[rgba(255,255,255,0.08)] via-[rgba(20,20,23,0.94)] to-[#0d0d0f]",
};

const slotAreaClass: Record<SocialWallSlotId, string> = {
  "row1-horizontal-yt":
    "md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1 min-h-[220px] md:min-h-0",
  "row1-post-top": "md:col-start-3 md:row-start-1",
  "row1-post-bottom": "md:col-start-3 md:row-start-2",
  "row1-vertical-ig":
    "md:col-start-4 md:row-span-2 md:row-start-1 min-h-[220px] md:min-h-0",
  "row2-vertical-yt":
    "md:col-start-1 md:row-span-2 md:row-start-3 min-h-[220px] md:min-h-0",
  "row2-post-top": "md:col-start-2 md:row-start-3",
  "row2-post-bottom": "md:col-start-2 md:row-start-4",
  "row2-horizontal-substack":
    "md:col-span-2 md:col-start-3 md:row-span-2 md:row-start-3 min-h-[220px] md:min-h-0",
};

const slotDelay: Partial<Record<SocialWallSlotId, number>> = {
  "row1-horizontal-yt": 0,
  "row1-post-top": 0.06,
  "row1-post-bottom": 0.08,
  "row1-vertical-ig": 0.1,
  "row2-vertical-yt": 0.08,
  "row2-post-top": 0.1,
  "row2-post-bottom": 0.12,
  "row2-horizontal-substack": 0.14,
};

function isWideSlot(slotId: SocialWallSlotId) {
  return (
    slotId === "row1-horizontal-yt" || slotId === "row2-horizontal-substack"
  );
}

function isTallSlot(slotId: SocialWallSlotId) {
  return slotId === "row1-vertical-ig" || slotId === "row2-vertical-yt";
}

function PlayMini() {
  return (
    <div className="absolute inset-0 grid place-items-center z-4 pointer-events-none">
      <div className="w-14 h-14 rounded-full bg-cn-accent/92 grid place-items-center shadow-[0_10px_36px_-8px_(--cn-accent-glow)] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white ml-0.5"
          aria-hidden
        >
          <path d="M6 4l14 8-14 8z" />
        </svg>
      </div>
    </div>
  );
}

function PlaceholderTile({
  slotId,
  platform,
  delay = 0,
}: {
  slotId: SocialWallSlotId;
  platform: PlatType;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={cn("h-full min-h-[168px]", slotAreaClass[slotId])}
    >
      <div
        className={cn(
          "rounded-4xl border border-dashed border-cn-line/80 h-full min-h-[168px] flex flex-col items-center justify-center gap-2 bg-white/[0.01]",
          isTallSlot(slotId) && "md:min-h-0",
        )}
      >
        <span
          className={cn(
            "font-mono text-[10px] font-semibold tracking-[0.12em] uppercase",
            platformAccent[platform],
          )}
        >
          {platformLabel[platform]}
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-cn-muted-2">
          Coming soon
        </span>
      </div>
    </Reveal>
  );
}

function SocialSlotTile({
  slot,
  delay = 0,
}: {
  slot: SocialWallSlot;
  delay?: number;
}) {
  const { slotId, platform, title, subtitle, url, thumbnailUrl, hasPlay } =
    slot;
  const wide = isWideSlot(slotId);
  const hasImage = Boolean(thumbnailUrl);

  const content = (
    <article
      className={cn(
        "rounded-4xl overflow-hidden relative border border-cn-line h-full group transition-[transform,box-shadow,border-color] duration-300 ease-spring hover:-translate-y-1 hover:border-cn-line-strong hover:shadow-[0_24px_60px_-26px_rgba(255,45,45,0.35)]",
        !hasImage && "min-h-[168px]",
      )}
    >
      {hasImage ? (
        <>
          <img
            src={thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-700 ease-spring group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,9,0.15)_0%,rgba(8,8,9,0.55)_55%,rgba(8,8,9,0.94)_100%)]" />
        </>
      ) : (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br",
              platformGradient[platform],
            )}
          />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(255,255,255,0.018)_11px,rgba(255,255,255,0.018)_22px)]" />
        </>
      )}

      {hasPlay && <PlayMini />}

      <span
        className={cn(
          "absolute top-4 left-4 z-3 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-xl bg-black/55 backdrop-blur-[6px] border border-white/8",
          platformAccent[platform],
        )}
      >
        {platformLabel[platform]}
      </span>

      <div className="absolute left-0 right-0 bottom-0 z-3 p-4 md:p-5">
        <h3
          className={cn(
            "font-display font-bold leading-[1.15] tracking-[-0.01em]",
            wide
              ? "text-[clamp(18px,2.2vw,28px)]"
              : isTallSlot(slotId)
                ? "text-[clamp(16px,1.8vw,22px)]"
                : "text-[15px]",
          )}
        >
          {title}
        </h3>
        {subtitle ? (
          <p className="font-mono text-xs text-cn-muted tracking-[0.06em] mt-1.5">
            {subtitle}
          </p>
        ) : null}
      </div>
    </article>
  );

  return (
    <Reveal
      delay={delay}
      className={cn("h-full min-h-[168px]", slotAreaClass[slotId])}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </Reveal>
  );
}

function orderSlots(slots: SocialWallSlot[]): SocialWallSlot[] {
  const byId = new Map(slots.map((slot) => [slot.slotId, slot]));
  return SOCIAL_WALL_SLOT_IDS.map(
    (slotId) =>
      byId.get(slotId) ?? {
        _id: slotId,
        slotId,
        platform: defaultPlatformForSlot(slotId),
        title: "",
        subtitle: "",
        url: "",
        thumbnailUrl: "",
        hasPlay: false,
        isActive: false,
        createdAt: "",
        updatedAt: "",
      },
  );
}

function defaultPlatformForSlot(slotId: SocialWallSlotId): PlatType {
  if (slotId.includes("yt")) return "yt";
  if (slotId.includes("ig")) return "ig";
  if (slotId.includes("substack")) return "substack";
  return "reddit";
}

export default function LandingSocialWall({ slots }: LandingSocialWallProps) {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const orderedSlots = useMemo(() => orderSlots(slots), [slots]);

  return (
    <section className="py-12">
      <div className="max-w-(--cn-maxw) mx-auto px-8 relative z-2">
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Social wall" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Everywhere
            <br />
            at once.
          </h2>
          <p className="text-cn-muted mt-6 text-sm max-w-2xl">
            One community, every platform. Here is what the grid is posting
            right now.
          </p>
        </div>

        <div
          className={cn(
            "grid gap-3 md:gap-4 mt-16",
            "grid-cols-1 auto-rows-[minmax(168px,auto)]",
            "md:grid-cols-4 md:grid-rows-[repeat(4,minmax(148px,1fr))]",
          )}
        >
          {orderedSlots.map((slot) => {
            const delay = slotDelay[slot.slotId] ?? 0;

            if (!slot.isActive) {
              return (
                <PlaceholderTile
                  key={slot.slotId}
                  slotId={slot.slotId}
                  platform={slot.platform}
                  delay={delay}
                />
              );
            }

            return (
              <SocialSlotTile key={slot.slotId} slot={slot} delay={delay} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
