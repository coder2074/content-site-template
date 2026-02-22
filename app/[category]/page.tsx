// ============================================================================
// FILE: app/[category]/page.tsx
// ============================================================================
import { fetchSiteConfig, fetchCategoryDescription, getCategoryLogoUrl } from '@/lib/s3'
import { PageMeta, calculateCategoryStats } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROSE_CLASSES } from '@/lib/constants'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const siteConfig = await fetchSiteConfig()
  return siteConfig.categories.map((category) => ({
    category: category.categoryId,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params
  const siteConfig = await fetchSiteConfig()
  const category = siteConfig.categories.find((c) => c.categoryId === categoryId)

  if (!category) notFound()

  const description = await fetchCategoryDescription(categoryId)

  const stats = calculateCategoryStats(category)

  const categorySelectivity = stats.totalAnalyzed > 0
    ? ((stats.totalFeatured / stats.totalAnalyzed) * 100).toFixed(1)
    : 0

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <span className="text-gray-900">{category.categoryTitle}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-6">{category.categoryTitle}</h1>

      {/* Category Hero Image */}
      {category.iconPrompt && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <Image
            src={getCategoryLogoUrl(categoryId)}
            alt={category.categoryTitle}
            width={896}
            height={504}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      {/* Stats Badge */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        {stats && stats.totalAnalyzed > 0 && (
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs">
            <strong className="text-blue-600">{stats.totalAnalyzed} analyzed</strong>
            → {stats.totalFeatured} picks
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {categorySelectivity}%
            </span>
          </span>
        )}
      </div>

      {/* Category Stats Banner */}
      {stats.hasStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12 border border-blue-100">
          <p className="text-lg text-gray-700 mb-4 text-center">
            We analyzed <strong className="text-blue-600">{stats.totalAnalyzed} items</strong>
            {' '}to bring you <strong className="text-blue-600">{stats.totalFeatured} expert recommendations</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAnalyzed}
              </div>
              <div className="text-xs text-gray-600">Items Analyzed</div>
            </div>

            {stats.diversityMetrics.map(metric => (
              <div key={metric.type} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {metric.count}
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {metric.label}
                </div>
              </div>
            ))}

            {stats.rejectionRate > 0 && (
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejectionRate}%
                </div>
                <div className="text-xs text-gray-600">Filtered Out</div>
              </div>
            )}

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalFeatured}
              </div>
              <div className="text-xs text-gray-600">Expert Picks</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalPages}
              </div>
              <div className="text-xs text-gray-600">
                {stats.totalPages === 1 ? 'Guide' : 'Guides'}
              </div>
            </div>
          </div>
        </div>
      )}

      {description && (
        <div
          className={`mb-16 ${PROSE_CLASSES}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      <h2 className="text-2xl font-semibold mb-6">Top Picks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.pages.map((page: PageMeta) => {
          const pageStats = {
            itemsFeatured: page.itemsFeatured || 0,
            itemsAnalyzed: page.itemsAnalyzed || 0
          }

          const pageSelectivity = pageStats.itemsAnalyzed > 0
            ? ((pageStats.itemsFeatured / pageStats.itemsAnalyzed) * 100).toFixed(1)
            : 0

          return (
            <Link
              key={page.pageId}
              href={`/${categoryId}/${page.pageId}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                    {page.pageTitle}
                  </h3>

                  {pageStats.itemsAnalyzed > 0 ? (
                    <div className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span>{pageStats.itemsAnalyzed} analyzed</span>
                        <span className="font-semibold text-blue-600">
                          {pageStats.itemsFeatured} picks
                        </span>
                      </div>

                      {page.metadata?.diversityMetric && (
                        <div className="text-xs text-gray-500 mb-1">
                          {page.metadata.diversityMetric.count} {page.metadata.diversityMetric.label}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mb-1">
                        Top {pageSelectivity}% selected
                      </div>
                      {page.lastUpdated && (
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Expert reviews and recommendations
                    </p>
                  )}
                </div>

                <div className="relative w-20 h-20 flex-shrink-0 ml-6 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={getCategoryLogoUrl(categoryId)}
                    alt={page.pageTitle}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}