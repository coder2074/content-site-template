'use client'

// components/pages/extensions/PlacePage.tsx
import { PageContent, PageMeta, Category } from '@/lib/types'
import BasePage from '../BasePage'
import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
})

interface PlacePageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
}

export default function PlacePage({
  pageContent,
  pageMeta,
  category,
  categoryId,
}: PlacePageProps) {
  const locationMap = pageContent.additionalSections?.locationMap

  const footerSlot = locationMap?.places && locationMap.places.length > 0 ? (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-6">📍 All Locations</h2>
      <LocationMap center={locationMap.center} places={locationMap.places} />
    </div>
  ) : null

  return (
    <BasePage
      pageContent={pageContent}
      pageMeta={pageMeta}
      category={category}
      categoryId={categoryId}
      footerSlot={footerSlot}
    />
  )
}
