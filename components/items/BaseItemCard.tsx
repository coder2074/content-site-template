'use client'

// components/items/BaseItemCard.tsx
// Renders universal schema fields only.
// Extended by content-type-specific cards via the `children` slot.

import { Item } from '@/lib/types'
import MediaBlock from './shared/MediaBlock'
import RatingBadge from './shared/RatingBadge'
import Highlights from './shared/Highlights'
import Attributes from './shared/Attributes'
import CTAButtons from './shared/CTAButtons'

export interface BaseItemCardProps {
  item: Item
  // Header accent color — each content type can pass its own
  accentColor?: string
  // Label for attributes section — content types can override
  attributesLabel?: string
  // Slot for content-type-specific content rendered after highlights/attributes
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
        {/* Media */}
        <MediaBlock media={item.media} name={item.name} />

        {/* Summary */}
        {item.summary && (
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">{item.summary}</p>
        )}

        {/* Rating */}
        <RatingBadge rating={item.rating} />

        {/* Highlights — universal in v2.0 */}
        <Highlights highlights={item.highlights} />

        {/* Attributes — universal key/value facts */}
        <Attributes attributes={item.attributes} label={attributesLabel} />

        {/* Slot: content-type-specific sections injected here */}
        {children}

        {/* Description HTML — universal */}
        {item.descriptionHtml && (
          <div
            className="prose prose-sm max-w-none mb-6 text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
          />
        )}

        {/* CTAs */}
        <CTAButtons cta={item.cta} />
      </div>
    </div>
  )
}
