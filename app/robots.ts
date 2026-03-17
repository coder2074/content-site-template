// app/robots.ts
import type { MetadataRoute } from 'next'
import { fetchSiteContent } from '@/lib/s3'

export const dynamic = 'force-static'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteContent = await fetchSiteContent()

  const SITE_URL = siteContent.branding?.customDomain
    ? `https://${siteContent.branding.customDomain}`
    : 'https://yourdomain.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}