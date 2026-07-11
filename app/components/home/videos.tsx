"use client";
import { useInView } from "react-intersection-observer";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { cn, formatRelativeTime } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";
import type { YoutubeVideo } from "~/types/youtube";
import { landingContainerClass, landingSectionClass } from "./landing-shell";

type LandingVideosProps = {
  videos: YoutubeVideo[];
};

const videoCardClass = cn(cnCardClass, "hover:translate-y-0");

function sanitizeVideos(videos: YoutubeVideo[]) {
  return videos.filter(
    (video) =>
      video.id &&
      video.title &&
      video.url &&
      video.publishedAt &&
      Number.isFinite(video.durationSeconds) &&
      Number.isFinite(video.viewCount),
  );
}

function formatPublishedDate(dateInput: string) {
  return new Date(dateInput).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function VideoThumbnail({
  video,
  hero = false,
  className,
}: {
  video: YoutubeVideo;
  hero?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video shrink-0 overflow-hidden bg-[#141417]",
        className,
      )}
    >
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
          fetchPriority={hero ? "high" : undefined}
          loading={hero ? undefined : "lazy"}
          decoding="async"
        />
      ) : null}

      <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span
          className={cn(
            "grid place-items-center rounded-full bg-cn-accent/92 text-white shadow-[0_10px_36px_-8px_var(--cn-accent-glow)] transition-transform duration-300 group-hover:scale-110",
            hero ? "size-14" : "size-10",
          )}
        >
          <IconPlayerPlayFilled size={hero ? 22 : 16} className="ml-0.5" />
        </span>
      </div>
    </div>
  );
}

function FeaturedVideo({ video }: { video: YoutubeVideo }) {
  return (
    <Reveal>
      <article
        className={cn(videoCardClass, "p-0 flex flex-col overflow-hidden group")}
      >
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full flex-col"
        >
          <div className="border-b border-cn-line">
            <VideoThumbnail video={video} hero />
          </div>
          <div className="p-5 sm:p-8">
            <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.06] mt-3 text-[clamp(26px,3vw,40px)]">
              {video.title}
            </h3>
            <div className="font-mono text-xs text-cn-muted-2 tracking-[0.06em] mt-4 flex flex-wrap gap-2">
              <time dateTime={new Date(video.publishedAt).toISOString()}>
                {formatPublishedDate(video.publishedAt)}
              </time>
              <span>{formatRelativeTime(video.publishedAt)}</span>
            </div>
          </div>
        </a>
      </article>
    </Reveal>
  );
}

function CompactVideo({
  video,
  delay,
}: {
  video: YoutubeVideo;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <article
        className={cn(
          videoCardClass,
          "p-4 sm:p-[18px_20px] flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center group",
        )}
      >
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
        >
          <VideoThumbnail
            video={video}
            className="w-full sm:w-42 rounded-xl border border-cn-line"
          />
          <div className="min-w-0">
            <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.2] mt-2 text-sm line-clamp-2">
              {video.title}
            </h3>
            <div className="font-mono text-xs text-cn-muted-2 tracking-[0.06em] mt-3 flex flex-wrap gap-2">
              <time dateTime={new Date(video.publishedAt).toISOString()}>
                {formatPublishedDate(video.publishedAt)}
              </time>
            </div>
          </div>
        </a>
      </article>
    </Reveal>
  );
}

export default function LandingVideos({ videos }: LandingVideosProps) {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const sanitized = sanitizeVideos(videos);
  const [featured, ...compact] = sanitized.slice(0, 5);

  return (
    <section className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Watch" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Our videos
          </h2>
        </div>

        {featured ? (
          <div className="grid grid-cols-[1.4fr_1fr] max-nav:grid-cols-1 gap-4 mt-16">
            <FeaturedVideo video={featured} />

            {compact.length ? (
              <div className="grid gap-4">
                {compact.map((video, index) => (
                  <CompactVideo
                    key={video.id}
                    video={video}
                    delay={index < 2 ? 0.08 : 0.16}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-16 text-sm text-cn-muted">
            No videos available right now.
          </p>
        )}
      </div>
    </section>
  );
}
