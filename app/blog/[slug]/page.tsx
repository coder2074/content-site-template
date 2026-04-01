// app/blog/[slug]/page.tsx
import { fetchSiteConfig, fetchArticleContent, getArticleImageUrl } from '@/lib/s3'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { ArticleMeta, ArticleContent } from '@/lib/types'
import RelatedContent from '@/components/RelatedContent'
import RecipeCard from '@/components/RecipeCard'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  console.log('=== generateStaticParams /blog/[slug] called ===')
  const siteConfig = await fetchSiteConfig()
  const articles = siteConfig.articles || []
  if (articles.length === 0) return [{ slug: '_placeholder' }]
  return articles.map((article: ArticleMeta) => ({ slug: article.article_slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const siteConfig = await fetchSiteConfig()
    const article = (siteConfig.articles || []).find(a => a.article_slug === slug)
    if (!article) return {}

    // Try to get richer metadata from article-content.json
    let articleContent: ArticleContent | null = null
    try {
      articleContent = await fetchArticleContent(slug)
    } catch {
      // Fall back to site-config data
    }

    return {
      title: article.article_title,
      description: articleContent?.meta_description ?? article.meta_description,
      keywords: articleContent?.seo_keywords?.join(', ') ?? article.tags?.join(', ') ?? '',
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  if (slug === '_placeholder') notFound()

  const siteConfig = await fetchSiteConfig()
  const article: ArticleMeta | undefined = (siteConfig.articles || [])
    .find(a => a.article_slug === slug && a.status === 'published')

  if (!article) notFound()

  let articleContent: ArticleContent
  try {
    articleContent = await fetchArticleContent(slug)
  } catch {
    notFound()
  }

  const isRecipe = articleContent.article_content_type === 'recipe'
  const recipe = articleContent.content_type_data?.recipe
  const schemaJson = articleContent.schema

  // Tag-based related content
  const articleTags = article.tags || []

  const relatedPages = articleTags.length > 0
    ? siteConfig.categories.flatMap(cat =>
        cat.pages
          .filter(p => p.tags?.some((t: string) => articleTags.includes(t)))
          .map(p => ({ page: p, category: cat }))
      )
    : []

  const relatedArticles = articleTags.length > 0
    ? (siteConfig.articles || []).filter(
        a => a.status === 'published' &&
        a.article_slug !== slug &&
        a.tags?.some((t: string) => articleTags.includes(t))
      )
    : []

  return (
    <div className="mx-auto px-4 py-12" style={{ maxWidth: 'var(--layout-max-width)' }}>

      {/* JSON-LD structured data — injected into <head> */}
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <nav className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          <Link href="/" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Home</Link>
          {' > '}
          <Link href="/blog" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Guides & Articles</Link>
          {' > '}
          <span>{article.article_title}</span>
        </nav>

        <header className="mb-10">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-3 py-1 rounded-full text-xs font-semibold capitalize hover:opacity-80 transition"
                  style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-bg-secondary)' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <h1
            className="text-4xl md:text-5xl font-black mb-4 leading-tight"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {article.article_title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {/* Author attribution */}
            {schemaJson?.author && typeof schemaJson.author === 'object' && 'name' in schemaJson.author && (
              <>By {(schemaJson.author as { name: string }).name} · </>
            )}
            Published {new Date(article.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {article.last_updated !== article.published_date && (
              <> · Updated {new Date(article.last_updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</>
            )}
          </p>
          <hr className="mt-8" style={{ borderColor: 'var(--color-bg-secondary)' }} />
        </header>

        {article.image_prompt && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={getArticleImageUrl(article.article_slug)}
              alt={article.article_title}
              width={896}
              height={504}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Introduction / body markdown — shown for all article types */}
        {articleContent.body_markdown && (
          <article
            className="prose prose-lg max-w-none mb-12 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-li:leading-relaxed prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-strong:font-semibold prose-a:underline prose-a:font-medium hover:prose-a:opacity-80"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent.body_markdown}</ReactMarkdown>
          </article>
        )}

        {/* Recipe card — only rendered for recipe articles */}
        {isRecipe && recipe && (
          <RecipeCard recipe={recipe} title={article.article_title} />
        )}

        <RelatedContent relatedArticles={relatedArticles} relatedPages={relatedPages} />

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 rounded-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            ← All Guides & Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
