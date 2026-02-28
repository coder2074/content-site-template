// components/items/extensions/ListItemCard.tsx
// List items use the base card with no additions.
// Highlights and attributes from research are sufficient.
import { Item } from '@/lib/types'
import BaseItemCard from '../BaseItemCard'

interface ListItemCardProps {
  item: Item
}

export default function ListItemCard({ item }: ListItemCardProps) {
  return (
    <BaseItemCard
      item={item}
      accentColor="from-gray-700 to-gray-900"
      attributesLabel="Details"
    />
  )
}
