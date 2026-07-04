import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { cn, formatRelativeTime } from "~/lib/utils"
import { Link } from "react-router"
import { motion } from "motion/react"
import { Heart, Clock } from "lucide-react"
import type { SubstackArticle } from "~/types/articles"

type ArticleCardProps = {
    article: SubstackArticle;
    className?: string;
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

export default function ArticleCard({
    article,
    className
}: ArticleCardProps) {
    const relativeTime = formatRelativeTime(article.date)
    const summary = articleSummary(article)
    const imageUrl = coverImage(article)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-80px" }}
        >
            <Card className={cn("overflow-hidden pb-4 pt-1 group", className)}>
                <div className="relative">
                    <div className="p-4">
                        <img
                            src={imageUrl}
                            alt=""
                            className="h-48 w-full rounded-sm object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute right-6 bottom-6 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow">
                        <time dateTime={new Date(article.date).toISOString()}>
                            {relativeTime}
                        </time>
                    </div>
                </div>
                <CardHeader className="gap-2">
                    <CardTitle className="line-clamp-2 text-lg md:text-xl">
                        <Link to={article.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {summary}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-2 pt-4">
                    <Badge variant="secondary" className="gap-1">
                        <Clock className="size-3" />
                        {article.reading_time_minutes} min read
                    </Badge>
                    <div className="ml-auto text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Heart className="size-4" />
                            {article.likes}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
