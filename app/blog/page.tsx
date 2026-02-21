// ============================================================================
// FILE: app/blog/page.tsx
// ============================================================================
import { fetchSiteConfig } from '@/lib/s3'
import { ArticleMeta } from '@/lib/types'
import Link from 'next/link'
import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Guides & Articles',
    description: 'Woodworking guides, tips, and tutorials to help you build your dream shop.',
  }
}

export default async function BlogPage() {
  const siteConfig = await fetchSiteConfig()

  const allArticles: ArticleMeta[] = (siteConfig.articles || [])
    .filter((a: ArticleMeta) => a.status === 'published')
    .sort((a: ArticleMeta, b: ArticleMeta) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )

  const allTags = Array.from(
    new Set(allArticles.flatMap((a: ArticleMeta) => a.tags))
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
          <span
            className="px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            All
          </span>
          {allTags.map(tag => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-secondary)'
              }}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* No articles state */}
      {allArticles.length === 0 && (
        <div className="text-center py-20">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No articles published yet.
          </p>
        </div>
      )}

      {/* Article Cards Grid */}
      {allArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map(article => (
            <ArticleCard key={article.articleId} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}