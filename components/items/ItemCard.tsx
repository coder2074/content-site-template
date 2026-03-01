'use client'

// components/items/ItemCard.tsx
// Registry: maps content type → card component.
// This is the ONLY file that knows which card to use for which content type.
// Adding a new content type = add one line to ITEM_CARD_MAP.

import { Item, ContentType } from '@/lib/types'
import CommerceItemCard from './extensions/CommerceItemCard'
import PlaceItemCard from './extensions/PlaceItemCard'
import PersonItemCard from './extensions/PersonItemCard'
import ListItemCard from './extensions/ListItemCard'
import BaseItemCard from './BaseItemCard'
import { ComponentType } from 'react'

// ---- REGISTRY ----
// To add a new content type:
// 1. Create components/items/extensions/RecipeItemCard.tsx
// 2. Import it above
// 3. Add one line here: recipe: RecipeItemCard
const ITEM_CARD_MAP: Record<ContentType, ComponentType<{ item: Item }>> = {
  physical_product: CommerceItemCard,
  service_offer:    CommerceItemCard,
  place:            PlaceItemCard,
  person:           PersonItemCard,
  list_item:        ListItemCard,
}

interface ItemCardProps {
  item: Item
  contentType: ContentType
}

export default function ItemCard({ item, contentType }: ItemCardProps) {
  const Card = ITEM_CARD_MAP[contentType] ?? BaseItemCard
  return <Card item={item} />
}
