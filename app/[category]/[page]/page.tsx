// app/[category]/[page]/page.tsx
import { fetchSiteConfig, fetchPageContent, fetchThemeConfig, getSiteHeaderLogoUrl, getSiteBaseUrl } from '@/lib/s3'
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
    const [pageContent, baseUrl] = await Promise.all([
      fetchPageContent(category, page),
      getSiteBaseUrl(),
    ])
    const themeConfig = await fetchThemeConfig()

    const ogImage = pageContent.items?.[0]?.media?.images?.[0]?.url
      || themeConfig.logo?.url
      || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)

    return {
      title: pageContent.page_title,
      description: pageContent.meta_description,
      keywords: pageContent.seo_keywords?.join(', ') ?? '',
      alternates: {
        canonical: `${baseUrl}/${category}/${page}/`,
      },
      openGraph: {
        title: pageContent.page_title,
        description: pageContent.meta_description,
        type: 'article',
        images: [{ url: ogImage }],
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

  const pageTags = pageMeta.tags || []


console.log('pageTags:', pageTags)
console.log('all pages with tags:', siteConfig.categories.flatMap(cat =>
  cat.pages.map(p => ({ page_id: p.page_id, tags: p.tags || [] }))
))

  const relatedArticles = pageTags.length > 0
    ? (siteConfig.articles || []).filter(
        a => a.status === 'published' &&
        a.tags?.some((t: string) => pageTags.includes(t))
      )
    : []

  const relatedPages = pageTags.length > 0
    ? siteConfig.categories.flatMap(cat =>
        cat.pages
          .filter(p =>
            p.page_id !== pageId &&
            p.tags?.some((t: string) => pageTags.includes(t))
          )
          .map(p => ({ page: p, category: cat }))
      )
    : []
  console.log('relatedPages found:', relatedPages.length)
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
        relatedArticles={relatedArticles}
        relatedPages={relatedPages}
      />
    </>
  )
}
