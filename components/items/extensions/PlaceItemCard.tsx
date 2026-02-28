// components/items/extensions/PlaceItemCard.tsx
import { Item, getLocation } from '@/lib/types'
import BaseItemCard from '../BaseItemCard'

interface PlaceItemCardProps {
  item: Item
}

export default function PlaceItemCard({ item }: PlaceItemCardProps) {
  const location = getLocation(item)

  return (
    <BaseItemCard
      item={item}
      accentColor="from-emerald-600 to-teal-700"
      attributesLabel="Details"
    >
      {/* Location block */}
      {location?.address && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-lg">📍</span> Location
          </h4>
          <p className="text-gray-700">{location.address}</p>
          {location.coordinates && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-700 hover:underline mt-1 inline-block"
            >
              View on Google Maps →
            </a>
          )}
        </div>
      )}
    </BaseItemCard>
  )
}
