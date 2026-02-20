// ============================================================================
// FILE: app/blog/[slug]/page.tsx
// ============================================================================
import { fetchSiteConfig, fetchArticleContent } from '@/lib/s3'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import { ArticleMeta } from '@/lib/types'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  console.log('=== generateStaticParams /blog/[slug] called ===')
  
  const siteConfig = await fetchSiteConfig()
  const articles = siteConfig.articles || []

  // output: export requires at least one static param
  // return a placeholder when no articles exist yet
  if (articles.length === 0) {
    return [{ slug: '_placeholder' }]
  }

  return articles.map((article: ArticleMeta) => ({
    slug: article.articleSlug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const siteConfig = await fetchSiteConfig()
    const article = (siteConfig.articles || []).find(a => a.articleSlug === slug)

    if (!article) return {}

    return {
      title: article.articleTitle,
      description: article.metaDescription,
      keywords: article.tags.join(', '),
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  // Handle placeholder slug used during static build
  // when no articles exist yet
  if (slug === '_placeholder') notFound()

  // 1. Get article metadata from site-config
  const siteConfig = await fetchSiteConfig()
  const article: ArticleMeta | undefined = (siteConfig.articles || [])
    .find(a => a.articleSlug === slug && a.status === 'published')

  if (!article) notFound()

  // 2. Fetch markdown content from S3
  let markdownContent: string
  try {
    markdownContent = await fetchArticleContent(slug)
  } catch {
    notFound()
  }

  // 3. Get related pages for the "Related Picks" section
  const relatedPages = article.relatedPages
    .map(pageId => {
      for (const category of siteConfig.categories) {
        const page = category.pages.find(p => p.pageId === pageId)
        if (page) return { page, category }
      }
      return null
    })
    .filter(Boolean) as Array<{ page: any; category: any }>

  // 4. Get other featured articles for "More Articles" section
  const moreArticles = (siteConfig.articles || [])
    .filter(a => a.status === 'published' && a.articleSlug !== slug)
    .slice(0, 3)

  return (
    <div
      className="mx-auto px-4 py-12"
      style={{ maxWidth: 'var(--layout-max-width)' }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          <Link href="/" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          {' > '}
          <Link href="/blog" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
            Guides & Articles
          </Link>
          {' > '}
          <span>{article.articleTitle}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 rounded-full text-xs font-semibold capitalize hover:opacity-80 transition"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-bg-secondary)'
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-black mb-4 leading-tight"
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {article.articleTitle}
          </h1>

          {/* Date */}
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Published {new Date(article.publishedDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
            {article.lastUpdated !== article.publishedDate && (
              <> · Updated {new Date(article.lastUpdated).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</>
            )}
          </p>
        </header>

        {/* Article Content — Markdown rendered */}
        <article
          className="prose prose-lg max-w-none mb-16"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </article>

        {/* Related Picks — affiliate pages linked from this article */}
        {relatedPages.length > 0 && (
          <div
            className="mb-16 p-8 rounded-xl"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Our Top Picks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPages.map(({ page, category }) => (
                <Link
                  key={page.pageId}
                  href={`/${category.categoryId}/${page.pageId}`}
                  className="flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <span
                    className="text-2xl"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    →
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{page.pageTitle}</div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {category.categoryTitle}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More Articles */}
        {moreArticles.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              More Guides
            </h2>
            <div className="space-y-4">
              {moreArticles.map(a => (
                <Link
                  key={a.articleId}
                  href={`/blog/${a.articleSlug}`}
                  className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition"
                  style={{ backgroundColor: 'var(--color-bg-primary)' }}
                >
                  <div className="flex-1">
                    <div
                      className="font-semibold mb-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {a.articleTitle}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {a.excerpt}
                    </div>
                  </div>
                  <span
                    className="font-semibold text-sm shrink-0"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to all articles */}
        <div className="text-center">
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
    </div>
  )
}