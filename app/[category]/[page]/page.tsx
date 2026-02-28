// app/[category]/[page]/page.tsx
import { fetchSiteConfig, fetchPageContent } from '@/lib/s3'
import { notFound } from 'next/navigation'
import ContentPage from '@/components/pages/ContentPage'
import type { Metadata } from 'next'

interface AffiliatePageProps {
  params: Promise<{ category: string; page: string }>
}

export async function generateStaticParams() {
  const siteConfig = await fetchSiteConfig()
  const params = []

  for (const category of siteConfig.categories) {
    for (const page of category.pages) {
      params.push({
        category: category.categoryId,
        page: page.pageId,
      })
    }
  }

  if (params.length === 0) {
    return [{ category: '_placeholder', page: '_placeholder' }]
  }

  return params
}

export async function generateMetadata({ params }: AffiliatePageProps): Promise<Metadata> {
  try {
    const { category, page } = await params
    const content = await fetchPageContent(category, page)
    return {
      title: content.pageTitle,
      description: content.metaDescription || content.introduction,
      keywords: content.seoKeywords?.join(', '),
    }
  } catch {
    return {}
  }
}

export default async function AffiliatePage({ params }: AffiliatePageProps) {
  const { category: categoryId, page: pageId } = await params

  const siteConfig = await fetchSiteConfig()

  const category = siteConfig.categories.find((c) => c.categoryId === categoryId)
  if (!category) notFound()

  const pageMeta = category.pages.find((p) => p.pageId === pageId)
  if (!pageMeta) notFound()

  let pageContent
  try {
    pageContent = await fetchPageContent(categoryId, pageId)
  } catch {
    notFound()
  }

  // Delegate entirely to ContentPage — it knows what to render based on pageContentType
  return (
    <ContentPage
      pageContent={pageContent}
      pageMeta={pageMeta}
      category={category}
      categoryId={categoryId}
    />
  )
}
