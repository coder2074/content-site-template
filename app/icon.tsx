import { fetchThemeConfig } from '@/lib/s3'

export const dynamic = 'force-static'
export const contentType = 'image/png'
export const size = { width: 64, height: 64 }

export default async function Icon() {
  const themeConfig = await fetchThemeConfig()
  const faviconUrl = themeConfig.favicon?.url

  if (faviconUrl) {
    const response = await fetch(faviconUrl)
    const buffer = await response.arrayBuffer()
    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } })
  }

  return new Response(null, { status: 404 })
}