import type { Route } from "./+types/articles";
import { useMemo, useState } from "react";
import { NavbarLogo } from "~/components/ui/resizable-navbar";
import ArticleShowcase from "~/components/articles/article-showcase";
import { getSubstackArticles } from "~/lib/substack.server";
import type { SubstackArticle } from "~/types/articles";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Articles | Circuit Nation" },
		{ name: "description", content: "Explore every Circuit Nation article, insight, and analysis." },
	];
}

export async function loader({ }: Route.LoaderArgs) {
	const articles = await getSubstackArticles(10);
	return { articles } as { articles: SubstackArticle[] };
}

function articleSummary(article: SubstackArticle) {
	return article.description || article.excerpt;
}

const Articles = ({ loaderData }: Route.ComponentProps) => {
	const [query, setQuery] = useState("");

	const filteredArticles = useMemo<SubstackArticle[]>(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return loaderData.articles;
		}

		return loaderData.articles.filter((article: SubstackArticle) => {
			const title = article.title?.toLowerCase() ?? "";
			const summary = articleSummary(article)?.toLowerCase() ?? "";

			return title.includes(normalizedQuery)
				|| summary.includes(normalizedQuery);
		});
	}, [loaderData.articles, query]);

	return (
		<div className="min-h-screen bg-background max-w-7xl mx-auto px-4 py-6 space-y-12 md:space-y-6">
			<NavbarLogo />
			<div className="space-y-3">
				<div className="text-2xl font-semibold">Browse all articles</div>
				<div className="relative">
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search by title or summary"
						className="w-full rounded-full border border-muted/60 bg-background px-5 py-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
						aria-label="Search articles"
					/>
				</div>
			</div>
			<ArticleShowcase articles={filteredArticles} limit={null} showCta={false} />
		</div>
	);
};

export default Articles;
