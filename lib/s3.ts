// ============================================================================
// FILE: lib/s3.ts
// No key transformation — snake_case from Python backend used directly.
// ============================================================================
import { SiteConfig, PageContent, ThemeConfig, SiteContent, CategoryContent } from './types'

const CONTENT_BASE_URL = process.env.CONTENT_BASE_URL

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const url = `${CONTENT_BASE_URL}/site-config.json`
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`Failed to fetch site config: ${response.statusText}`)
  return response.json()
}

export async function fetchThemeConfig(): Promise<ThemeConfig> {
  const url = `${CONTENT_BASE_URL}/theme-config.json`
  console.log("Fetching theme config from:", url)
  try {
    const response = await fetch(url, { cache: 'force-cache' })
    if (!response.ok) return getDefaultThemeConfig()
    return response.json()
  } catch {
    return getDefaultThemeConfig()
  }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const url = `${CONTENT_BASE_URL}/site-content.json`
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`Failed to fetch site content: ${response.statusText}`)
  return response.json()
}

export async function fetchCategoryContent(categoryId: string): Promise<CategoryContent | null> {
  try {
    const url = `${CONTENT_BASE_URL}/categories/${categoryId}/category-content.json`
    const response = await fetch(url, { cache: 'force-cache' })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function fetchPageContent(category: string, page: string): Promise<PageContent> {
  const url = `${CONTENT_BASE_URL}/categories/${category}/pages/${page}/page-content.json`
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`Failed to fetch page content: ${response.statusText}`)
  return response.json()
}

export function getLogoUrl(path: string): string {
  return `${CONTENT_BASE_URL}/${path}`
}

export function getCategoryLogoUrl(categoryId: string): string {
  return `${CONTENT_BASE_URL}/categories/${categoryId}/category-logo-image.png`
}

export function getPageLogoUrl(categoryId: string, pageId: string): string {
  return `${CONTENT_BASE_URL}/categories/${categoryId}/pages/${pageId}/page-logo-image.png`
}

export function getSiteHeaderLogoUrl(siteId?: string): string {
  if (!siteId) return ''
  return `${process.env.CONTENT_BASE_URL}/${siteId}/site-header-logo-image.png`
}

export function hasSiteLogo(themeConfig: any): boolean {
  return !!(themeConfig.logo && themeConfig.logo.url)
}

export async function fetchArticleContent(slug: string): Promise<string> {
  const url = `${CONTENT_BASE_URL}/articles/${slug}.md`
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`Failed to fetch article content: ${response.statusText}`)
  return response.text()
}

export function getArticleImageUrl(articleSlug: string): string {
  return `${CONTENT_BASE_URL}/articles/${articleSlug}-image.png`
}

function getDefaultThemeConfig(): ThemeConfig {
  return {
    schemaVersion: "1.0",
    lastUpdated: new Date().toISOString(),
    colors: { primary: "#2563eb", secondary: "#8b5cf6", accent: "#f59e0b" },
    typography: { fontFamily: "Inter", headingFont: "Inter", bodyFont: "Inter" },
    layout: { maxWidth: "1280px", containerPadding: "2rem", headerHeight: "80px" },
    components: {
      hero: {
        badge: { enabled: true, text: "✨ Updated for 2026", style: "blue", position: "top" },
        layout: "centered",
        backgroundStyle: "gradient",
      },
      trustBadges: { enabled: true, mode: "auto", style: "minimal" },
      categoriesSection: { enabled: true, title: "Browse by Category", layout: "grid", columns: 3, gap: "2rem" }
    },
    animations: { enabled: true, duration: "300ms" }
  }
}