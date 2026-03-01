'use client'

// components/pages/ContentPage.tsx
// Registry: maps content type → page component.
// This is the ONLY file that knows which page layout to use for which content type.
// Adding a new content type = add one line to PAGE_MAP.

import { PageContent, PageMeta, Category, ContentType } from '@/lib/types'
import CommercePage from './extensions/CommercePage'
import PlacePage from './extensions/PlacePage'
import BasePage from './BasePage'
import { ComponentType } from 'react'

interface PageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
}

// ---- REGISTRY ----
// To add a new content type:
// 1. Create components/pages/extensions/RecipePage.tsx
// 2. Import it above
// 3. Add one line here: recipe: RecipePage
const PAGE_MAP: Partial<Record<ContentType, ComponentType<PageProps>>> = {
  physical_product: CommercePage,
  service_offer:    CommercePage,
  place:            PlacePage,
  // person and list_item use BasePage — no additions needed
}

export default function ContentPage(props: PageProps) {
  const Page = PAGE_MAP[props.pageContent.pageContentType] ?? BasePage
  return <Page {...props} />
}
