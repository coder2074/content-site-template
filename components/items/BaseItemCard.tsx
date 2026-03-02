'use client'

// components/items/BaseItemCard.tsx
import { Item } from '@/lib/types'
import MediaBlock from './shared/MediaBlock'
import RatingBadge from './shared/RatingBadge'
import Highlights from './shared/Highlights'
import Attributes from './shared/Attributes'
import CTAButtons from './shared/CTAButtons'

export interface BaseItemCardProps {
  item: Item
  accentColor?: string
  attributesLabel?: string
  children?: React.ReactNode
}

export default function BaseItemCard({
  item,
  accentColor = 'from-blue-600 to-blue-700',
  attributesLabel = 'Details',
  children,
}: BaseItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${accentColor} text-white p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-bold">#{item.rank}</span>
              {item.badge && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.badge}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
            {item.tagline && (
              <p className="text-white/80 text-sm">{item.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <MediaBlock media={item.media} name={item.name} />

        {item.summary && (
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{item.summary}</p>
        )}

        <RatingBadge rating={item.rating} />
        <Highlights highlights={item.highlights} />
        <Attributes attributes={item.attributes} label={attributesLabel} />

        {/* Slot for type-specific content */}
        {children}

        {item.description_html && (
          <div
            className="prose prose-sm max-w-none mb-6 text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.description_html }}
          />
        )}

        <CTAButtons cta={item.cta} />
      </div>
    </div>
  )
}
