import ArticleCard from "./article-card"
import ComponentHeading from "../common/component-heading"
import { Newspaper } from "lucide-react"
import { motion } from "motion/react"
import type { SubstackArticle } from "~/types/articles";
import { Link } from "react-router";

interface ArticleShowcaseProps {
    articles: SubstackArticle[];
    limit?: number | null;
    showCta?: boolean;
}

function articleSummary(article: SubstackArticle) {
    return article.description || article.excerpt;
}

function coverImage(article: SubstackArticle) {
    return (
        article.cover_image.large ||
        article.cover_image.original ||
        article.cover_image.medium ||
        article.cover_image.small
    );
}

export default function ArticleShowcase({ articles, limit = 4, showCta = true }: ArticleShowcaseProps) {
    const sanitizedArticles = articles
        .filter(article => article.title && articleSummary(article) && coverImage(article) && article.date);
    const visibleArticles = typeof limit === "number"
        ? sanitizedArticles.slice(0, limit)
        : sanitizedArticles;
    return (
        <>
            <div className="space-y-4" id="articles">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: "-80px" }}
                >
                    <ComponentHeading
                        title="Our thoughts out loud"
                        subtitle="Stay up to speed with the latest news, insights, and analysis from the world of motorsports."
                        badgeText="Articles"
                        badgeIcon={<Newspaper data-icon="align-start" />}
                    />
                </motion.div>
                <motion.section
                    className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: "-80px" }}
                >
                    {visibleArticles.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                    ))}
                </motion.section>

                {showCta ? (
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link
                            to="/articles"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold border border-muted/50 bg-background/80 hover:scale-105 transition-transform duration-300"
                        >
                            <Newspaper className="size-5" />
                            Read more articles
                        </Link>
                    </motion.div>
                ) : null}
            </div>
        </>
    )
}
