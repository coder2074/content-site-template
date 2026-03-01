'use client'

// components/PageCard.tsx
import { PageMeta } from "@/lib/types"
import Link from 'next/link'

export default function PageCard({ page, categoryId }: { page: PageMeta; categoryId: string }) {
  const itemsAnalyzed = page.itemsAnalyzed || 0
  const itemsFeatured = page.itemsFeatured || 0

  const pageSelectivity = itemsAnalyzed > 0 && itemsFeatured > 0
    ? ((itemsFeatured / itemsAnalyzed) * 100).toFixed(1)
    : null

  return (
    <Link
      href={`/${categoryId}/${page.pageId}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 group"
    >
      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-3">
        {page.pageTitle}
      </h3>

      {itemsAnalyzed > 0 ? (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span>{itemsAnalyzed} analyzed</span>
            <span className="font-semibold text-blue-600">{itemsFeatured} picks</span>
          </div>

          {page.metadata?.diversityMetric && (
            <div className="text-xs text-gray-500 mb-1">
              {page.metadata.diversityMetric.count} {page.metadata.diversityMetric.label}
            </div>
          )}

          {pageSelectivity && (
            <div className="text-xs text-gray-500 mb-1">
              Top {pageSelectivity}% selected
            </div>
          )}

          {page.lastUpdated && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600">Expert reviews and recommendations</p>
      )}

      <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
        View picks →
      </div>
    </Link>
  )
}
