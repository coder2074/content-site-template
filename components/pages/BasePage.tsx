// components/pages/BasePage.tsx
// Renders the universal page structure shared by all content types:
// breadcrumbs, header, research stats, intro, items list, FAQ, related content.
// Extended by content-type-specific pages via the `headerSlot` and `footerSlot` props.

import Link from 'next/link'
import { PageContent, ContentType, formatPageStats } from '@/lib/types'
import { PageMeta, Category } from '@/lib/types'
import ItemCard from '@/components/items/ItemCard'
import FAQ from '@/components/FAQ'

interface BasePageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
  // Slot rendered between intro text and items list (e.g. comparison table)
  headerSlot?: React.ReactNode
  // Slot rendered after items list (e.g. buyer guide, map, final recommendation)
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
  const isCommerce = ['physical_product', 'service_offer'].includes(pageContent.pageContentType)

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <Link href={`/${categoryId}`} className="hover:text-blue-600">
          {category.categoryTitle}
        </Link>
        {' > '}
        <span className="text-gray-900">{pageContent.pageTitle}</span>
      </nav>

      {/* Page Header */}
      <h1 className="text-5xl font-bold mb-4">{pageContent.pageTitle}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        {pageContent.lastUpdated && (
          <span>Last updated: {new Date(pageContent.lastUpdated).toLocaleDateString()}</span>
        )}
        {stats.hasStats && (
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs">
            <strong className="text-blue-600">{stats.itemsAnalyzed} analyzed</strong>
            → {stats.itemsFeatured} picks
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {stats.selectivity}%
            </span>
          </span>
        )}
      </div>

      {/* Disclosure */}
      {isCommerce && pageContent.disclosure && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
          <p className="text-sm text-gray-700">{pageContent.disclosure}</p>
        </div>
      )}

      {/* Research Stats */}
      {stats.hasStats && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isCommerce ? 'Our Research Process' : 'Our Selection Process'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.itemsAnalyzed}</div>
              <div className="text-sm text-gray-600 mb-2">
                {isCommerce ? 'Products Analyzed' : 'Items Analyzed'}
              </div>
              <div className="text-xs text-gray-500">We researched every highly-rated option</div>
            </div>
            {pageMeta.metadata?.diversityMetric && (
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pageMeta.metadata.diversityMetric.count}
                </div>
                <div className="text-sm text-gray-600 mb-2 capitalize">
                  {pageMeta.metadata.diversityMetric.label}
                </div>
                <div className="text-xs text-gray-500">Comprehensive coverage</div>
              </div>
            )}
            {stats.itemsAnalyzed > 0 && (
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {(100 - stats.selectivity).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mb-2">Filtered Out</div>
                <div className="text-xs text-gray-500">Only the best made our list</div>
              </div>
            )}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.itemsFeatured}</div>
              <div className="text-sm text-gray-600 mb-2">Top Picks</div>
              <div className="text-xs text-gray-500">Our expert recommendations</div>
            </div>
          </div>
        </div>
      )}

      {/* Introduction */}
      <p className="text-xl text-gray-700 mb-12 leading-relaxed">{pageContent.introduction}</p>

      {/* Header slot (e.g. comparison table for commerce) */}
      {headerSlot}

      {/* Items */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          {isCommerce ? 'Detailed Reviews' : 'Complete List'}
        </h2>
        <div className="space-y-12">
          {pageContent.items.map((item) => (
            <ItemCard
              key={item.rank}
              item={item}
              contentType={pageContent.pageContentType}
            />
          ))}
        </div>
      </div>

      {/* FAQ — shown if present */}
      {pageContent.faq && pageContent.faq.length > 0 && (
        <div className="mb-16">
          <FAQ items={pageContent.faq} />
        </div>
      )}

      {/* Footer slot (e.g. buyer guide + final rec for commerce, map for place) */}
      {footerSlot}

      {/* Related Content */}
      {pageContent.relatedContent?.pages && pageContent.relatedContent.pages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageContent.relatedContent.pages.map((related) => (
              <Link
                key={related.url}
                href={related.url}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <h3 className="font-bold mb-2">{related.title}</h3>
                <p className="text-sm text-gray-600">{related.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
