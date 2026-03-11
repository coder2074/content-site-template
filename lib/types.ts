// ============================================================================
// FILE: lib/types.ts
// Snake_case throughout — matches Python backend JSON directly.
// No transformation layer, what's in S3 is what TypeScript sees.
// ============================================================================

export type ContentType =
  | 'physical_product'
  | 'service_offer'
  | 'list_item'
  | 'place'
  | 'person'

// ============================================================================
// SITE CONFIG
// ============================================================================

export interface SiteConfig {
  site_id: string
  site_title: string
  site_description?: string
  categories: Category[]
  articles?: ArticleMeta[]
  stats?: SiteStats
  custom_domain?: string
  deployment_url?: string
}

export interface SiteStats {
  total_items_analyzed: number
  total_items_featured: number
  total_pages: number
  total_categories: number
  total_articles?: number
  last_updated: string
}

export interface Category {
  category_id: string
  category_title: string
  category_slug?: string
  icon_prompt?: string
  pages: PageMeta[]
  stats?: CategoryStats
}

export interface CategoryContent {
  schema_version: string
  category_id: string
  category_title: string
  category_description: string
  meta_description: string
  seo_keywords: string[]
  last_updated: string
}

export interface CategoryStats {
  total_pages: number
  last_updated: string
}

export interface PageMeta {
  page_id: string
  page_title: string
  page_slug?: string
  items_featured?: number
  items_analyzed?: number
  last_updated?: string
  tags?: string[]         
  seo_keywords?: string[] 
  metadata?: PageMetadata
}

export interface PageMetadata {
  avgRating?: number
  totalReviews?: number
  priceRange?: string | { min: number; max: number; currency: string }
  diversityMetric?: {
    type: string
    count: number
    label: string
  }
  researchDate?: string
}

// ============================================================================
// THEME CONFIG
// ============================================================================

export interface ThemeConfig {
  schemaVersion: string
  lastUpdated: string
  colors: ColorsConfig
  typography: TypographyConfig
  logo?: LogoConfig
  layout?: LayoutConfig
  components: ComponentsConfig
  animations?: AnimationsConfig
}

export interface ColorsConfig {
  primary: string
  secondary: string
  accent: string
  text?: { primary: string; secondary: string }
  background?: { primary: string; secondary: string }
}

export interface TypographyConfig {
  fontFamily: string
  headingFont: string
  bodyFont: string
  sizes?: { h1: string; h2: string; h3: string; body: string }
}

export interface LogoConfig {
  url: string; width: number; height: number; position: string
}

export interface LayoutConfig {
  maxWidth: string; containerPadding: string; headerHeight: string
}

export interface ComponentsConfig {
  hero: HeroComponentConfig
  trustBadges: TrustBadgesComponentConfig
  categoriesSection: CategoriesSectionComponentConfig
  comparisonTable?: ComparisonTableComponentConfig
  footer?: FooterComponentConfig
}

export interface HeroComponentConfig {
  badge: { enabled: boolean; text?: string; style: string; position: string }
  layout?: 'centered' | 'left' | 'right'
  backgroundStyle?: string
  headline?: string
  subheadline?: string
}

export interface TrustBadgesComponentConfig {
  enabled: boolean; mode: 'auto' | 'custom'; style: string
  customBadges?: Array<{ value: string; label: string }>
}

export interface CategoriesSectionComponentConfig {
  enabled: boolean; layout?: 'grid' | 'list'; columns?: number; gap?: string; title?: string
}

export interface ComparisonTableComponentConfig {
  style?: string; zebraStripes?: boolean
}

export interface FooterComponentConfig {
  layout?: string; backgroundColor?: string
}

export interface AnimationsConfig {
  enabled: boolean; duration: string
}

// ============================================================================
// CONTENT TYPE DATA — snake_case matches Python output
// ============================================================================

export interface CommerceContentTypeData {
  source: {
    merchant: string
    merchant_display: string
    url: string
    pricing: {
      display: string
      value?: number
      currency?: string
      type?: string
      notes?: string
    }
  }
  pros: string[]
  cons: string[]
  review: {
    editorial: string
    verdict: string
  }
}

export interface PlaceContentTypeData {
  location: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
}

export interface ContentTypeData {
  commerce?: CommerceContentTypeData
  place?: PlaceContentTypeData
  [key: string]: unknown
}

// ============================================================================
// ITEM — snake_case root fields matching Python schema v2.0
// ============================================================================

export interface Item {
  rank: number
  name: string
  summary: string
  tagline: string
  badge?: string
  highlights: string[]
  attributes: Record<string, string>
  description_html: string
  rating?: {
    value: number
    scale: number
    count?: number
    source?: string
  }
  media?: {
    images?: Array<{ url: string; alt: string; caption?: string }>
    video?: { url: string; thumbnail: string }
  }
  cta: Array<{
    text: string
    url: string
    type: 'primary' | 'secondary'
    merchant?: string
  }>
  content_type_data: ContentTypeData
}

// Keep Offer as alias during migration
export type Offer = Item

// ============================================================================
// PAGE CONTENT — snake_case matches Python output
// ============================================================================

export interface PageContent {
  schema_version: string
  page_content_type: ContentType
  page_title: string
  meta_description: string
  h1: string
  introduction: string
  seo_keywords: string[]
  summary: string
  last_updated?: string
  disclosure?: string
  schema: {
    '@context': string
    '@type': string
    numberOfItems?: number
    itemListElement?: Array<{
      '@type': string
      position: number
      name: string
      url?: string
    }>
    aggregateRating?: {
      '@type': string
      ratingValue: number
      reviewCount: number
    }
  }
  items: Item[]
  comparison_table?: { enabled: boolean }
  buyer_guide?: BuyerGuideSection[]
  faq?: FAQItem[]
  final_recommendation?: {
    text: string
    cta?: { label: string; url: string }
  }
  additional_sections?: {
    location_map?: {
      center: string
      places: Array<{ name: string; lat: number; lng: number; address?: string }>
    }
  }
}

export interface BuyerGuideSection {
  title: string
  content_html: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface SiteContent {
  schemaVersion: string
  lastUpdated: string
  branding: { siteName: string; tagline: string; description: string }
  hero: {
    badge: { text: string }
    headline: string
    subheadline: string
    cta: { text: string; url: string }
  }
  trustIndicators: string[]
  categoriesSection: { title: string }
  about: { title: string; content: string }
  footer: {
    aboutText: string
    copyright: string
    links: Array<{ text: string; url: string }>
  }
  metaDescription: string
  seoKeywords: string[]
  navLinks: { text: string; url: string }[]
    badgeLabels: {
    itemsAnalyzed: string
    itemsFeatured: string
    selectivity: string
  }
  featuredArticlesLabel: string
}

// ============================================================================
// ACCESSORS — clean access to nested content_type_data
// ============================================================================

export function isCommerceType(t: ContentType): boolean {
  return t === 'physical_product' || t === 'service_offer'
}

export function isPlaceType(t: ContentType): boolean {
  return t === 'place'
}

export function isPersonType(t: ContentType): boolean {
  return t === 'person'
}

export function getCommerce(item: Item): CommerceContentTypeData | undefined {
  return item.content_type_data?.commerce
}

export function getPlace(item: Item): PlaceContentTypeData | undefined {
  return item.content_type_data?.place
}

export function getPricing(item: Item): CommerceContentTypeData['source']['pricing'] | undefined {
  return item.content_type_data?.commerce?.source?.pricing
}

export function getLocation(item: Item): PlaceContentTypeData['location'] | undefined {
  return item.content_type_data?.place?.location
}

// ============================================================================
// ARTICLE META
// ============================================================================

export interface ArticleMeta {
  article_id: string
  article_slug: string
  article_title: string
  excerpt: string
  meta_description: string
  published_date: string
  last_updated: string
  featured: boolean
  featured_order: number
  status: string
  tags: string[]
  image_prompt: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateSelectivity(featured: number, analyzed: number): number {
  if (!analyzed || !featured || analyzed === 0) return 0
  return parseFloat(((featured / analyzed) * 100).toFixed(1))
}

export function calculateRejectionRate(featured: number, analyzed: number): number {
  return parseFloat((100 - calculateSelectivity(featured, analyzed)).toFixed(1))
}

export function formatPageStats(page: PageMeta) {
  const itemsAnalyzed = page.items_analyzed || 0
  const itemsFeatured = page.items_featured || 0
  const selectivity = calculateSelectivity(itemsFeatured, itemsAnalyzed)

  const metadata = page.metadata || {}
  const priceRange = metadata.priceRange
  const priceDisplay = priceRange
    ? typeof priceRange === 'string'
      ? priceRange
      : `$${(priceRange as any).min?.toFixed(2) ?? '?'}-$${(priceRange as any).max?.toFixed(2) ?? '?'}`
    : null

  return {
    itemsAnalyzed,
    itemsFeatured,
    selectivity,
    hasStats: itemsAnalyzed > 0,
    avgRating: metadata.avgRating,
    totalReviews: metadata.totalReviews,
    priceRange: metadata.priceRange,
    diversityMetric: metadata.diversityMetric,
    reviewsDisplay: metadata.totalReviews
      ? `${metadata.totalReviews.toLocaleString()}+ verified reviews` : null,
    priceDisplay,
    ratingDisplay: metadata.avgRating
      ? `${Number(metadata.avgRating).toFixed(1)}★ average` : null,
    diversityDisplay: metadata.diversityMetric
      ? `${metadata.diversityMetric.count} ${metadata.diversityMetric.label}` : null,
  }
}

export function calculateCategoryStats(category: Category) {
  let totalAnalyzed = 0
  let totalFeatured = 0
  const diversityMetrics: Array<{ type: string; count: number; label: string }> = []

  category.pages.forEach((page) => {
    totalAnalyzed += page.items_analyzed || 0
    totalFeatured += page.items_featured || 0
    if (page.metadata?.diversityMetric) diversityMetrics.push(page.metadata.diversityMetric)
  })

  const selectivity = totalAnalyzed > 0
    ? parseFloat(((totalFeatured / totalAnalyzed) * 100).toFixed(1)) : 0
  const rejectionRate = totalAnalyzed > 0
    ? parseFloat((100 - selectivity).toFixed(1)) : 0

  const diversityByType: Record<string, { count: number; label: string }> = {}
  diversityMetrics.forEach((m) => {
    if (!diversityByType[m.type]) diversityByType[m.type] = { count: 0, label: m.label }
    diversityByType[m.type].count = Math.max(diversityByType[m.type].count, m.count)
  })

  return {
    totalAnalyzed,
    totalFeatured,
    selectivity,
    rejectionRate,
    totalPages: category.pages.length,
    diversityMetrics: Object.entries(diversityByType).map(([type, data]) => ({
      type, count: data.count, label: data.label,
    })),
    hasStats: totalAnalyzed > 0,
  }
}
