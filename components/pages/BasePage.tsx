'use client'

// components/pages/BasePage.tsx
import { PageContent, PageMeta, Category, ContentType, formatPageStats } from '@/lib/types'
import Link from 'next/link'
import ItemCard from '@/components/items/ItemCard'

interface BasePageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
}

export default function BasePage({
  pageContent,
  pageMeta,
  category,
  categoryId,
  headerSlot,
  footerSlot,
}: BasePageProps) {
  const stats = formatPageStats(pageMeta)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <Link href={`/${categoryId}`} className="hover:text-blue-600">{category.category_title}</Link>
        {' > '}
        <span className="text-gray-900">{pageContent.page_title}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4">{pageContent.page_title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {pageContent.last_updated && (
            <span>Last updated: {new Date(pageContent.last_updated).toLocaleDateString()}</span>
          )}
          {stats.hasStats && (
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs">
              <strong className="text-blue-600">{stats.itemsAnalyzed} analyzed</strong>
              → {stats.itemsFeatured} picks
            </span>
          )}
        </div>
      </div>

      {/* Research Stats */}
      {stats.hasStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-10 border border-blue-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.itemsAnalyzed}</div>
              <div className="text-xs text-gray-600">Items Analyzed</div>
            </div>
            {stats.diversityMetric && (
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.diversityMetric.count}</div>
                <div className="text-xs text-gray-600 capitalize">{stats.diversityMetric.label}</div>
              </div>
            )}
            {stats.itemsAnalyzed > 0 && (
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {((100 - (stats.selectivity || 0)) || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Filtered Out</div>
              </div>
            )}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.itemsFeatured}</div>
              <div className="text-xs text-gray-600">Expert Picks</div>
            </div>
          </div>
        </div>
      )}

      {/* Introduction */}
      {pageContent.introduction && (
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">{pageContent.introduction}</p>
      )}

      {/* Header Slot (e.g. ComparisonTable for commerce) */}
      {headerSlot}

      {/* Detailed Reviews */}
      <h2 className="text-3xl font-bold mb-8">Detailed Reviews</h2>
      <div className="space-y-10">
        {pageContent.items.map((item) => (
          <ItemCard
            key={item.rank}
            item={item}
            contentType={pageContent.page_content_type as ContentType}
          />
        ))}
      </div>

      {/* Footer Slot (e.g. BuyerGuide + FinalRecommendation for commerce) */}
      {footerSlot && <div className="mt-12">{footerSlot}</div>}

      {/* FAQ */}
      {pageContent.faq && pageContent.faq.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {pageContent.faq.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Content */}
      {pageContent.related_content?.pages && pageContent.related_content.pages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pageContent.related_content.pages.map((related, idx) => (
              <Link
                key={idx}
                href={related.url}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition flex items-center gap-3"
              >
                <span className="text-blue-600">→</span>
                <span className="font-semibold text-sm">{related.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
