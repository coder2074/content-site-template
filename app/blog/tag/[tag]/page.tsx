// ============================================================================
// FILE: app/blog/tag/[tag]/page.tsx
// ============================================================================
import { fetchSiteConfig, getSiteBaseUrl } from '@/lib/s3'
import { ArticleMeta } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const siteConfig = await fetchSiteConfig()
  const articles = siteConfig.articles || []

  const allTags = Array.from(
    new Set(
      articles
        .filter((a: ArticleMeta) => a.status === 'published')
        .flatMap((a: ArticleMeta) => a.tags)
    )
  )

  if (allTags.length === 0) {
    return [{ tag: '_placeholder' }]
  }

  return allTags.map(tag => ({ tag }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const baseUrl = await getSiteBaseUrl()
  return {
    title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Guides & Articles`,
    description: `Guides and articles tagged with "${tag}".`,
    alternates: {
      canonical: `${baseUrl}/blog/tag/${tag}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params

  if (tag === '_placeholder') notFound()

  const siteConfig = await fetchSiteConfig()

  const allArticles: ArticleMeta[] = (siteConfig.articles || [])
    .filter((a: ArticleMeta) => a.status === 'published')
    .sort((a: ArticleMeta, b: ArticleMeta) =>
      new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
    )

  const taggedArticles = allArticles.filter(a => a.tags.includes(tag))

  if (taggedArticles.length === 0) notFound()

  const allTags = Array.from(
    new Set(allArticles.flatMap((a: ArticleMeta) => a.tags))
  ).sort()

  return (
    <div
      className="mx-auto px-4 py-12"
      style={{ maxWidth: 'var(--layout-max-width)' }}
    >
      <div className="mb-12 text-center">
        <h1
          className="text-5xl font-black mb-4 capitalize"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          {tag} Guides
        </h1>
        <p
          className="text-xl max-w-2xl mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {taggedArticles.length} article{taggedArticles.length !== 1 ? 's' : ''} tagged with &ldquo;{tag}&rdquo;
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-secondary)'
            }}
          >
            All
          </Link>

          {allTags.map(t => (
            <Link
              key={t}
              href={`/blog/tag/${t}`}
              className="px-4 py-2 rounded-full text-sm font-semibold capitalize transition hover:opacity-80"
              style={
                t === tag
                  ? { backgroundColor: 'var(--color-primary)', color: 'white' }
                  : {
                      backgroundColor: 'var(--color-bg-primary)',
                      color: 'var(--color-text-secondary)'
                    }
              }
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {taggedArticles.map(article => (
          <ArticleCard
            key={article.article_id}
            article={article}
            activeTag={tag}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-block px-8 py-3 rounded-lg font-semibold transition hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white'
          }}
        >
          ← All Guides & Articles
        </Link>
      </div>
    </div>
  )
}