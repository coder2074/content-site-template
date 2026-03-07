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
        category: category.category_id,
        page: page.page_id,
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
    const imageUrl = content.items?.[0]?.media?.images?.[0]?.url

    return {
      title: content.page_title,               // ← layout template appends site name
      description: content.meta_description,
      keywords: content.seo_keywords?.join(', ') ?? '',
      alternates: {
        canonical: `/${category}/${page}`,    // ← canonical tag
      },
      openGraph: {
        title: content.page_title,
        description: content.meta_description,
        type: 'article',
        ...(imageUrl && { images: [{ url: imageUrl }] }),
      },
    }
  } catch {
    return {}
  }
}

export default async function AffiliatePage({ params }: AffiliatePageProps) {
  const { category: categoryId, page: pageId } = await params

  const siteConfig = await fetchSiteConfig()

  const category = siteConfig.categories.find((c) => c.category_id === categoryId)
  if (!category) notFound()

  const pageMeta = category.pages.find((p) => p.page_id === pageId)
  if (!pageMeta) notFound()

  let pageContent
  try {
    pageContent = await fetchPageContent(categoryId, pageId)
  } catch {
    notFound()
  }

  const jsonLd = pageContent.schema ?? null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ContentPage
        pageContent={pageContent}
        pageMeta={pageMeta}
        category={category}
        categoryId={categoryId}
      />
    </>
  )
}
