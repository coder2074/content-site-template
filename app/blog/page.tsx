// ============================================================================
// FILE: app/blog/page.tsx
// ============================================================================
import { fetchSiteConfig } from '@/lib/s3'
import { ArticleMeta } from '@/lib/types'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await fetchSiteConfig()
  return {
    title: `Guides & Articles`,
    description: `Woodworking guides, tips, and tutorials to help you build your dream shop.`,
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const siteConfig = await fetchSiteConfig()
  const { tag } = await searchParams

  // Get published articles only
  const allArticles: ArticleMeta[] = (siteConfig.articles || [])
    .filter(a => a.status === 'published')
    .sort((a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )

  // Filter by tag if provided
  const articles = tag
    ? allArticles.filter(a => a.tags.includes(tag))
    : allArticles

  // Collect all unique tags across all articles
  const allTags = Array.from(
    new Set(allArticles.flatMap(a => a.tags))
  ).sort()

  return (
    <div
      className="mx-auto px-4 py-12"
      style={{ maxWidth: 'var(--layout-max-width)' }}
    >
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1
          className="text-5xl font-black mb-4"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          Guides & Articles
        </h1>
        <p
          className="text-xl max-w-2xl mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Everything you need to set up your shop, choose the right tools, and start building.
        </p>
      </div>

      {/* Tag Filter Row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {/* All tag */}
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              !tag
                ? 'text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={!tag ? { backgroundColor: 'var(--color-primary)', color: 'white' } : {}}
          >
            All
          </Link>

          {allTags.map(t => (
            <Link
              key={t}
              href={`/blog?tag=${t}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition capitalize`}
              style={
                tag === t
                  ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                  : { backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-secondary)' }
              }
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {/* No articles state */}
      {articles.length === 0 && (
        <div className="text-center py-20">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {tag ? `No articles found for tag "${tag}".` : 'No articles published yet.'}
          </p>
          {tag && (
            <Link
              href="/blog"
              className="mt-4 inline-block underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View all articles
            </Link>
          )}
        </div>
      )}

      {/* Article Cards Grid */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.articleId} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ARTICLE CARD COMPONENT (inline — small enough to keep here)
// ============================================================================
function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/blog/${article.articleSlug}`}
      className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Card Body */}
      <div className="p-6">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 rounded text-xs font-semibold capitalize"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="text-xl font-bold mb-3 group-hover:underline leading-snug"
          style={{
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)'
          }}
        >
          {article.articleTitle}
        </h2>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {new Date(article.publishedDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span
            className="text-sm font-semibold group-hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Read more →
          </span>
        </div>
      </div>
    </Link>
  )
}