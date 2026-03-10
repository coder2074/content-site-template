'use client'

// components/pages/ContentPage.tsx
import { PageContent, PageMeta, Category, ContentType, ArticleMeta } from '@/lib/types'
import CommercePage from './extensions/CommercePage'
import PlacePage from './extensions/PlacePage'
import BasePage from './BasePage'
import { ComponentType } from 'react'

interface PageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
  relatedArticles: ArticleMeta[]
  relatedPages: Array<{ page: PageMeta; category: Category }>
}

const PAGE_MAP: Partial<Record<ContentType, ComponentType<PageProps>>> = {
  physical_product: CommercePage,
  service_offer:    CommercePage,
  place:            PlacePage,
}

export default function ContentPage(props: PageProps) {
  const Page = PAGE_MAP[props.pageContent.page_content_type] ?? BasePage
  return <Page {...props} />
}
