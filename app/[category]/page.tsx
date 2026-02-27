// ============================================================================
// FILE: app/[category]/page.tsx
// ============================================================================
import { fetchSiteConfig, fetchCategoryContent, getCategoryLogoUrl } from '@/lib/s3'
import { PageMeta, calculateCategoryStats } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROSE_CLASSES } from '@/lib/constants'
import PageCard from '@/components/PageCard'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const siteConfig = await fetchSiteConfig()
  return siteConfig.categories.map((category) => ({
    category: category.categoryId,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { category: categoryId } = await params
    const categoryContent = await fetchCategoryContent(categoryId)
    if (!categoryContent) return {}
    return {
      title: categoryContent.categoryTitle,
      description: categoryContent.metaDescription,
      keywords: categoryContent.seoKeywords?.join(', '),
    }
  } catch {
    return {}
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params
  const siteConfig = await fetchSiteConfig()
  const category = siteConfig.categories.find((c) => c.categoryId === categoryId)

  if (!category) notFound()

  const categoryContent = await fetchCategoryContent(categoryId)
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

      {/* Category Header — with or without hero image */}
      {category.iconPrompt ? (
        <div className="relative rounded-xl overflow-hidden mb-6 h-48 md:h-64">
          <Image
            src={getCategoryLogoUrl(categoryId)}
            alt={category.categoryTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="text-4xl font-bold text-white">{category.categoryTitle}</h1>
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold mb-6">{category.categoryTitle}</h1>
      )}

      {/* Stats Badge */}
      {stats.totalAnalyzed > 0 && (
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs">
            <strong className="text-blue-600">{stats.totalAnalyzed} analyzed</strong>
            → {stats.totalFeatured} picks
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {categorySelectivity}%
            </span>
          </span>
        </div>
      )}

      {/* Category Stats Banner */}
      {stats.hasStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12 border border-blue-100">
          <p className="text-lg text-gray-700 mb-4 text-center">
            We analyzed <strong className="text-blue-600">{stats.totalAnalyzed} items</strong>
            {' '}to bring you{' '}
            <strong className="text-blue-600">{stats.totalFeatured} expert recommendations</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAnalyzed}</div>
              <div className="text-xs text-gray-600">Items Analyzed</div>
            </div>

            {stats.diversityMetrics.map(metric => (
              <div key={metric.type} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{metric.count}</div>
                <div className="text-xs text-gray-600 capitalize">{metric.label}</div>
              </div>
            ))}

            {stats.rejectionRate > 0 && (
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">{stats.rejectionRate}%</div>
                <div className="text-xs text-gray-600">Filtered Out</div>
              </div>
            )}

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.totalFeatured}</div>
              <div className="text-xs text-gray-600">Expert Picks</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.totalPages}</div>
              <div className="text-xs text-gray-600">
                {stats.totalPages === 1 ? 'Guide' : 'Guides'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Description */}
      {categoryContent?.categoryDescription && (
        <div
          className={`mb-16 ${PROSE_CLASSES}`}
          dangerouslySetInnerHTML={{ __html: categoryContent.categoryDescription }}
        />
      )}

      {/* Page Cards */}
      <h2 className="text-2xl font-semibold mb-6">Top Picks</h2>
      {category.pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.pages.map((page: PageMeta) => (
            <PageCard
              key={page.pageId}
              page={page}
              categoryId={categoryId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-8 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Guides Coming Soon</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            We're currently researching and testing the best {category.categoryTitle.toLowerCase()} — check back soon for our expert picks.
          </p>
        </div>
      )}

    </div>
  )
}