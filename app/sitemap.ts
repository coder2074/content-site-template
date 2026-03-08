// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { fetchSiteConfig, fetchCategoryContent } from '@/lib/s3'

export const dynamic = 'force-static'

const siteConfig = await fetchSiteConfig()
const SITE_URL = siteConfig.custom_domain || siteConfig.deployment_url || 'https://yourdomain.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await fetchSiteConfig()

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

    // Page routes within each category
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

  return routes
}