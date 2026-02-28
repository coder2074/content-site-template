// components/items/shared/RatingBadge.tsx
import { Item } from '@/lib/types'

interface RatingBadgeProps {
  rating: Item['rating']
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-yellow-500 text-2xl">★</span>
        <span className="text-3xl font-bold text-gray-900">{rating.value}</span>
        <span className="text-gray-500">/ {rating.scale}</span>
      </div>
      {rating.count && (
        <span className="text-gray-600">
          ({rating.count.toLocaleString()} reviews)
        </span>
      )}
      {rating.source && (
        <span className="text-gray-500 text-sm ml-auto">{rating.source}</span>
      )}
    </div>
  )
}
