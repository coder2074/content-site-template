// components/items/extensions/PersonItemCard.tsx
// Person items store stats as attributes (key/value) in schema v2.0.
// This card renders attributes as a prominent stats grid instead of
// the default key/value list, then passes null attributesLabel to
// suppress the default attributes rendering in BaseItemCard.

import { Item } from '@/lib/types'
import BaseItemCard from '../BaseItemCard'
import MediaBlock from '../shared/MediaBlock'
import RatingBadge from '../shared/RatingBadge'
import Highlights from '../shared/Highlights'
import CTAButtons from '../shared/CTAButtons'

interface PersonItemCardProps {
  item: Item
}

export default function PersonItemCard({ item }: PersonItemCardProps) {
  const hasAttributes = item.attributes && Object.keys(item.attributes).length > 0

  return (
    <BaseItemCard
      item={item}
      accentColor="from-violet-600 to-purple-700"
      // Pass empty string to suppress default attributes rendering —
      // we render attributes ourselves as a stats grid below
      attributesLabel=""
    >
      {/* Stats grid — attributes displayed prominently for people */}
      {hasAttributes && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 text-lg">Stats & Info</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(item.attributes).map(([key, value]) => (
              <div
                key={key}
                className="p-3 bg-violet-50 rounded-lg border border-violet-100 text-center"
              >
                <div className="text-xs text-violet-600 font-medium mb-1 uppercase tracking-wide">
                  {key}
                </div>
                <div className="text-lg font-bold text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseItemCard>
  )
}
