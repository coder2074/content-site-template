// app/robots.ts
import type { MetadataRoute } from 'next'
import { fetchSiteConfig, fetchCategoryContent } from '@/lib/s3'

export const dynamic = 'force-static'

const siteConfig = await fetchSiteConfig()
const SITE_URL = siteConfig.custom_domain || siteConfig.deployment_url || 'https://yourdomain.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}