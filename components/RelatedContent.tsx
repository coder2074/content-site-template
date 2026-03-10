// components/RelatedContent.tsx
'use client'

import Link from 'next/link'
import { ArticleMeta, PageMeta, Category } from '@/lib/types'

interface RelatedContentProps {
  relatedArticles: ArticleMeta[]
  relatedPages: Array<{ page: PageMeta; category: Category }>
}

export default function RelatedContent({ relatedArticles, relatedPages }: RelatedContentProps) {
  if (relatedArticles.length === 0 && relatedPages.length === 0) return null

  return (
    <div className="mt-12 space-y-12">
      {relatedPages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Related Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPages.map(({ page, category }) => (
              <Link
                key={page.page_id}
                href={`/${category.category_id}/${page.page_id}`}
                className="flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition"
                style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              >
                <span className="text-2xl" style={{ color: 'var(--color-primary)' }}>→</span>
                <div>
                  <div className="font-semibold text-sm">{page.page_title}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {category.category_title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedArticles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Related Articles
          </h2>
          <div className="space-y-4">
            {relatedArticles.map(a => (
              <Link
                key={a.article_id}
                href={`/blog/${a.article_slug}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition"
                style={{ backgroundColor: 'var(--color-bg-primary)' }}
              >
                <div className="flex-1">
                  <div className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    {a.article_title}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {a.excerpt}
                  </div>
                </div>
                <span className="font-semibold text-sm shrink-0" style={{ color: 'var(--color-primary)' }}>
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}