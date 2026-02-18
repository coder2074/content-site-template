// ============================================================================
// FILE: lib/s3.ts (UPDATED FOR 2-LEVEL STRUCTURE)
// ============================================================================
import { SiteConfig, PageContent, ThemeConfig, SiteContent } from './types'
import humps from 'humps'

const CONTENT_BASE_URL = process.env.CONTENT_BASE_URL;

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const url = `${CONTENT_BASE_URL}/site-config.json`
  const response = await fetch(url, { next: { revalidate: 60 } })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch site config: ${response.statusText}`)
  }
  
  const snakeCaseData = await response.json()
  
  // Convert snake_case → camelCase
  return humps.camelizeKeys(snakeCaseData) as SiteConfig
}

// ← NEW: Fetch theme-config.json
export async function fetchThemeConfig(): Promise<ThemeConfig> {
  const themeConfigFullUrl = `${CONTENT_BASE_URL}/theme-config.json`
  console.log("Fetching theme config from:", themeConfigFullUrl)

  try {
    const response = await fetch(themeConfigFullUrl, { cache: "no-store" })

    if (!response.ok) {
      console.warn("Theme config not found, using defaults")
      return getDefaultThemeConfig()
    }

    const snakeCaseData = await response.json()
    
    // Convert snake_case → camelCase
    return humps.camelizeKeys(snakeCaseData) as ThemeConfig
  } catch (error) {
    console.warn("Failed to fetch theme config, using defaults:", error)
    return getDefaultThemeConfig()
  }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const url = `${CONTENT_BASE_URL}/site-content.json`
  const response = await fetch(url, { next: { revalidate: 60 } })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch site config: ${response.statusText}`)
  }
  
  const snakeCaseData = await response.json()
  
  // Convert snake_case → camelCase
  return humps.camelizeKeys(snakeCaseData) as SiteContent
}

// ← NEW: Default theme config (fallback)
function getDefaultThemeConfig(): ThemeConfig {
  return {
    schemaVersion: "1.0",
    lastUpdated: new Date().toISOString(),
    colors: {
      primary: "#2563eb",
      secondary: "#8b5cf6",
      accent: "#f59e0b"
    },
    typography: {
      fontFamily: "Inter",
      headingFont: "Inter",
      bodyFont: "Inter"
    },
    layout: {
      maxWidth: "1280px",
      containerPadding: "2rem",
      headerHeight: "80px"
    },
    components: {
      hero: {
        badge: {
          enabled: true,
          text: "✨ Updated for 2026",
          style: "blue",
          position: "top"
        },
        layout: "centered",
        backgroundStyle: "gradient",
        headline: "Find the Top Picks,<br />Make Smarter Choices",
        subheadline: "Expert reviews, honest comparisons, and real-world testing to help you choose products with confidence."
      },
      trustBadges: {
        enabled: true,
        mode: "auto",
        style: "minimal"
      },
      categoriesSection: {
        enabled: true,
        title: "Browse by Category",
        layout: "grid",
        columns: 3,
        gap: "2rem"
      }
    },
    animations: {
      enabled: true,
      duration: "300ms"
    }
  }
}

export async function fetchCategoryDescription(categoryId: string): Promise<string> {
  try {
    const response = await fetch(
      `${CONTENT_BASE_URL}/categories/${categoryId}/category-description.html`,
      { cache: 'no-store' }
    )
    if (!response.ok) return ''
    return response.text()
  } catch {
    return ''
  }
}

export async function fetchPageContent(
  category: string,
  page: string
): Promise<PageContent> {
  const url = `${CONTENT_BASE_URL}/categories/${category}/pages/${page}/page-content.json`
  const response = await fetch(url, { next: { revalidate: 60 } })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page content: ${response.statusText}`)
  }
  
  const snakeCaseData = await response.json()
  
  // Convert snake_case → camelCase
  return humps.camelizeKeys(snakeCaseData) as PageContent
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

/**
 * Get site header logo URL
 * Returns null if logo doesn't exist
 */
export function getSiteHeaderLogoUrl(siteId?: string): string {
  if (!siteId) return ''
  return `${process.env.CONTENT_BASE_URL}/${siteId}/site-header-logo-image.png`
}

/**
 * Check if site has a logo configured in theme
 */
export function hasSiteLogo(themeConfig: any): boolean {
  return !!(themeConfig.logo && themeConfig.logo.url)
}