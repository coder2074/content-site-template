// ============================================================================
// FILE: components/ArticleCard.tsx
// ============================================================================
import Link from 'next/link'
import Image from 'next/image'
import { ArticleMeta } from '@/lib/types'
import { getArticleImageUrl } from '@/lib/s3'

interface ArticleCardProps {
  article: ArticleMeta
  activeTag?: string  // highlights the active tag on tag pages
}

export default function ArticleCard({ article, activeTag }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.articleSlug}`}
      className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Thumbnail */}
      {article.imagePrompt && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={getArticleImageUrl(article.articleSlug)}
            alt={article.articleTitle}
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
                    ? 'var(--color-primary)'
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