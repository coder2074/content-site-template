'use client'

// components/PageCard.tsx
import { PageMeta } from "@/lib/types"
import Link from 'next/link'

export default function PageCard({ page, categoryId }: { page: PageMeta; categoryId: string }) {
  const items_analyzed = page.items_analyzed || 0
  const items_featured = page.items_featured || 0

  const selectivity = items_analyzed > 0 && items_featured > 0
    ? ((items_featured / items_analyzed) * 100).toFixed(1)
    : null

  return (
    <Link
      href={`/${categoryId}/${page.page_id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 group"
    >
      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-3">
        {page.page_title}
      </h3>

      {items_analyzed > 0 ? (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span>{items_analyzed} analyzed</span>
            <span className="font-semibold text-blue-600">{items_featured} picks</span>
          </div>

          {page.metadata?.diversityMetric && (
            <div className="text-xs text-gray-500 mb-1">
              {page.metadata.diversityMetric.count} {page.metadata.diversityMetric.label}
            </div>
          )}

          {selectivity && (
            <div className="text-xs text-gray-500 mb-1">Top {selectivity}% selected</div>
          )}

          {page.last_updated && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date(page.last_updated).toLocaleDateString()}
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
