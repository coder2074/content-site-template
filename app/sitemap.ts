import type { MetadataRoute } from 'next'
import { fetchSiteConfig, fetchSiteContent, fetchCategoryContent, fetchArticles } from '@/lib/s3'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteConfig, siteContent] = await Promise.all([
    fetchSiteConfig(),
    fetchSiteContent(),
  ])

  const SITE_URL = siteContent.branding?.customDomain
    ? `https://${siteContent.branding.customDomain}`
    : 'https://yourdomain.com'

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Category pages
  for (const category of siteConfig.categories) {
    const categoryContent = await fetchCategoryContent(category.category_id)

    routes.push({
      url: `${SITE_URL}/${category.category_id}`,
      lastModified: categoryContent?.last_updated
        ? new Date(categoryContent.last_updated)
        : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    for (const page of category.pages) {
      routes.push({
        url: `${SITE_URL}/${category.category_id}/${page.page_id}`,
        lastModified: page.last_updated
          ? new Date(page.last_updated)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // Articles
  const articles = siteConfig.articles || []
  for (const article of articles) {
    if (article.status === 'published') {
      routes.push({
        url: `${SITE_URL}/blog/${article.article_id}`,
        lastModified: article.last_updated
          ? new Date(article.last_updated)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return routes
}