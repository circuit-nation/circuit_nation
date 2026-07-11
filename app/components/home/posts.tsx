"use client";
import { useInView } from "react-intersection-observer";
import { cn, formatRelativeTime } from "~/lib/utils";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./section-eyebrow";
import { cnCardClass } from "~/components/ui/card";
import type { Article } from "~/types/articles";
import { landingContainerClass, landingSectionClass } from "./landing-shell";

type LandingPostsProps = {
  articles: Article[];
};

function sanitizeArticles(articles: Article[]) {
  return articles.filter(
    (article) =>
      article.title &&
      article.excerpt &&
      article.thumbnail &&
      article.publishedAt,
  );
}

function formatPublishedDate(dateInput: string) {
  return new Date(dateInput).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FeaturedPost({ article }: { article: Article }) {
  const href = article.url;

  return (
    <Reveal>
      <article
        className={cn(cnCardClass, "p-0! flex flex-col overflow-hidden group")}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full flex-col"
        >
          <div className="relative h-48 sm:h-90 shrink-0 overflow-hidden border-b border-cn-line bg-[#141417]">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="p-5 sm:p-8">
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-accent inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-cn-accent inline-block" />
              Substack
            </span>
            <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.06] mt-3 text-[clamp(26px,3vw,40px)]">
              {article.title}
            </h3>
            <p className="text-cn-muted mt-4 max-w-xl text-sm line-clamp-3">
              {article.excerpt}
            </p>
            <div className="font-mono text-xs text-cn-muted-2 tracking-[0.06em] mt-3 flex flex-wrap gap-2">
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formatPublishedDate(article.publishedAt)}
              </time>
              ·<span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </a>
      </article>
    </Reveal>
  );
}

function CompactPost({
  article,
  delay,
}: {
  article: Article;
  delay: number;
}) {
  const href = article.url;

  return (
    <Reveal delay={delay}>
      <article
        className={cn(
          cnCardClass,
          "p-4! sm:p-[22px_24px]! flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center group",
        )}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
        >
          <div className="w-full sm:w-24 aspect-video sm:aspect-auto sm:h-24 rounded-2xl shrink-0 overflow-hidden border border-cn-line">
            <img
              src={article.thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <span className="font-mono text-xs tracking-[0.12em] uppercase text-cn-accent">
              Substack
            </span>
            <h3 className="font-display font-bold tracking-[-0.01em] leading-[1.2] mt-2 text-sm line-clamp-2">
              {article.title}
            </h3>
            <div className="font-mono text-xs text-cn-muted-2 tracking-[0.06em] mt-3 flex flex-wrap gap-2">
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formatPublishedDate(article.publishedAt)}
              </time>
              ·<span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </a>
      </article>
    </Reveal>
  );
}

export default function LandingPosts({ articles }: LandingPostsProps) {
  const { ref: headRef, inView: headIn } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const sanitized = sanitizeArticles(articles);
  const [featured, ...compact] = sanitized.slice(0, 5);

  return (
    <section id="content" className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div
          ref={headRef}
          className={cn(
            "max-w-2xl transition-[opacity,transform] duration-800 ease-spring",
            headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <SectionEyebrow label="// Latest posts" />
          <h2 className="font-display font-extrabold uppercase leading-[0.96] text-[clamp(40px,5.5vw,64px)] mt-5">
            Articles
          </h2>
        </div>

        {featured ? (
          <div className="grid grid-cols-[1.4fr_1fr] max-nav:grid-cols-1 gap-4 mt-16">
            <FeaturedPost article={featured} />

            {compact.length ? (
              <div className="grid gap-4">
                {compact.map((article, index) => (
                  <CompactPost
                    key={article._id}
                    article={article}
                    delay={index < 2 ? 0.08 : 0.16}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-16 text-sm text-cn-muted">
            No articles available right now.
          </p>
        )}
      </div>
    </section>
  );
}
