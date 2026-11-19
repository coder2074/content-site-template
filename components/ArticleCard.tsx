// components/ArticleCard.tsx
// The one article card: home page featured section, listing and tag pages
// ('grid'), and related articles on article and category pages ('compact').
//
// The title link is "stretched" (an ::after overlay covering the card), so the
// whole card still opens the article while card-info links (e.g. a portfolio
// item's "Visit site") can sit on top with relative z-10. A card can't be one
// big <a>: links inside links are invalid HTML.
//
// Type-specific content comes only from ARTICLE_CARD_INFO; no type checks here.
import Link from 'next/link'
import Image from 'next/image'
import { ArticleMeta, ContentTypeLabels } from '@/lib/types'
import { getArticleImageUrl } from '@/lib/s3'
import { ARTICLE_CARD_INFO } from '@/components/articleCardInfo'

interface ArticleCardProps {
  article: ArticleMeta
  activeTag?: string
  variant?: 'grid' | 'compact'
  contentTypeLabels?: ContentTypeLabels
}

export default function ArticleCard({ article, activeTag, variant = 'grid', contentTypeLabels }: ArticleCardProps) {
  const CardInfo = ARTICLE_CARD_INFO[article.article_content_type]
  const href = `/blog/${article.article_slug}`

  if (variant === 'compact') {
    return (
      <div
        className="group relative flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        <div className="flex-1">
          <div className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            <Link href={href} className="after:absolute after:inset-0 after:content-['']">
              {article.article_title}
            </Link>
          </div>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {article.excerpt}
          </div>
          {CardInfo && <CardInfo article={article} labels={contentTypeLabels} compact />}
        </div>
        <span className="font-semibold text-sm shrink-0" style={{ color: 'var(--color-primary)' }}>
          Read →
        </span>
      </div>
    )
  }

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Thumbnail */}
      {article.image_prompt && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={getArticleImageUrl(article.article_slug)}
            alt={article.article_title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 rounded text-xs font-semibold capitalize"
                style={{
                  backgroundColor: tag === activeTag
                    ? 'var(--color-tag)'
                    : 'var(--color-bg-secondary)',
                  color: tag === activeTag
                    ? 'white'
                    : 'var(--color-text-secondary)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title (stretched link: the whole card opens the article) */}
        <h2
          className="text-xl font-bold mb-3 group-hover:underline leading-snug"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {article.article_title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {article.excerpt}
        </p>

        {/* Per-type card info (e.g. portfolio status, price, link) */}
        {CardInfo && <CardInfo article={article} labels={contentTypeLabels} />}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {new Date(article.published_date).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
          <span
            className="text-sm font-semibold group-hover:underline"
            style={{ color: 'var(--color-link)' }}
          >
            Read more →
          </span>
        </div>
      </div>
    </div>
  )
}
