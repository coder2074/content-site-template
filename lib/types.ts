// ============================================================================
// FILE: lib/types.ts
// Schema v2.0 - content_type_data pattern, universal item fields at root
// ============================================================================

// ============================================================================
// CONTENT TYPE REGISTRY
// Add new content types here — one place, propagates everywhere via union type
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
  siteId: string
  siteTitle: string
  siteDescription?: string
  categories: Category[]
  articles?: ArticleMeta[]
  stats?: SiteStats
}

export interface SiteContent {
  schemaVersion: string
  lastUpdated: string
  branding: {
    siteName: string
    tagline: string
    description: string
  }
  hero: {
    badge: {
      text: string
    }
    headline: string
    subheadline: string
    cta: {
      text: string
      url: string
    }
  }
  trustIndicators: string[]
  categoriesSection: {
    title: string
  }
  about: {
    title: string
    content: string
  }
  footer: {
    aboutText: string
    copyright: string
    links: Array<{
      text: string
      url: string
    }>
  }
  metaDescription: string
  seoKeywords: string[]
}

export interface SiteStats {
  totalItemsAnalyzed: number
  totalItemsFeatured: number
  totalPages: number
  totalCategories: number
  totalArticles?: number
  totalArticlesPublished?: number
  lastUpdated: string
}

export interface Category {
  categoryId: string
  categoryTitle: string
  categorySlug?: string
  iconPrompt?: string
  pages: PageMeta[]
  stats?: CategoryStats
}

export interface CategoryContent {
  schemaVersion: string
  categoryId: string
  categoryTitle: string
  categoryDescription: string
  metaDescription: string
  seoKeywords: string[]
  lastUpdated: string
}

export interface CategoryStats {
  totalProductsAnalyzed: number
  totalProductsFeatured: number
  totalPages: number
  lastUpdated: string
}

export interface PageMeta {
  pageId: string
  pageTitle: string
  pageSlug?: string
  itemsFeatured?: number
  itemsAnalyzed?: number
  lastUpdated?: string
  metadata?: PageMetadata
}

export interface PageMetadata {
  avgRating?: number
  totalReviews?: number
  priceRange?: string | {
    min: number
    max: number
    currency: string
  }
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
  text?: {
    primary: string
    secondary: string
  }
  background?: {
    primary: string
    secondary: string
  }
}

export interface TypographyConfig {
  fontFamily: string
  headingFont: string
  bodyFont: string
  sizes?: {
    h1: string
    h2: string
    h3: string
    body: string
  }
}

export interface LogoConfig {
  url: string
  width: number
  height: number
  position: string
}

export interface LayoutConfig {
  maxWidth: string
  containerPadding: string
  headerHeight: string
}

export interface ComponentsConfig {
  hero: HeroComponentConfig
  trustBadges: TrustBadgesComponentConfig
  categoriesSection: CategoriesSectionComponentConfig
  comparisonTable?: ComparisonTableComponentConfig
  offerCard?: OfferCardComponentConfig
  footer?: FooterComponentConfig
}

export interface HeroComponentConfig {
  badge: {
    enabled: boolean
    text?: string
    style: string
    position: string
  }
  layout: string
  backgroundStyle: string
  headline?: string
  subheadline?: string
}

export interface TrustBadgesComponentConfig {
  enabled: boolean
  mode: 'auto' | 'custom'
  style: string
  iconSize?: string
  customBadges?: Array<{
    value: string
    label: string
  }>
}

export interface CategoriesSectionComponentConfig {
  enabled: boolean
  layout: 'grid' | 'list'
  columns: number
  gap: string
  title?: string
}

export interface ComparisonTableComponentConfig {
  style: string
  zebraStripes: boolean
}

export interface OfferCardComponentConfig {
  style: string
  showBadge: boolean
  imageAspectRatio: string
}

export interface FooterComponentConfig {
  layout: string
  backgroundColor: string
}

export interface AnimationsConfig {
  enabled: boolean
  duration: string
}

// ============================================================================
// CONTENT TYPE DATA
// Type-specific fields live here, NOT at the item root.
// Adding a new content type = add a new interface here + add to ContentTypeData.
// ============================================================================

export interface CommerceContentTypeData {
  source: {
    merchant: string
    merchantDisplay: string  // humps: merchant_display -> merchantDisplay
    url: string
    pricing: {
      display: string       // "$299.99" or "Free" or "$95/year"
      value?: number        // numeric for comparison logic
      currency?: string
      type?: string         // "one_time" | "monthly" | "annual" | "free"
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
    coordinates?: {
      lat: number
      lng: number
    }
  }
}

export interface PersonContentTypeData {
  // person has no structured content_type_data fields —
  // role, stats, achievements are all in root attributes and highlights
  // This interface is a placeholder for future person-specific fields
  [key: string]: unknown
}

export interface ListItemContentTypeData {
  // list_item has no type-specific structured data
  [key: string]: unknown
}

// Union of all possible content_type_data shapes
export interface ContentTypeData {
  commerce?: CommerceContentTypeData
  place?: PlaceContentTypeData
  person?: PersonContentTypeData
  list_item?: ListItemContentTypeData
}

// ============================================================================
// ITEM (was Offer — renamed to match schema language)
// Universal fields at root. Type-specific fields in content_type_data.
// ============================================================================

export interface Item {
  // ---- Universal root fields (ALL content types) ----
  rank: number
  name: string
  summary: string
  tagline: string                    // v2.0 — was bestFor
  badge?: string
  highlights: string[]               // v2.0 — universal (was informational-only)
  attributes: Record<string, string> // key/value facts, universal
  descriptionHtml: string
  rating?: {
    value: number
    scale: number
    count?: number
    source?: string
  }
  media?: {
    images?: Array<{
      url: string
      alt: string
      caption?: string
    }>
    video?: {
      url: string
      thumbnail: string
    }
  }
  cta: Array<{
    text: string
    url: string
    type: 'primary' | 'secondary'
    merchant?: string
  }>

  // ---- Type-specific fields (commerce, place, person, etc.) ----
  contentTypeData: ContentTypeData
}

// Keep Offer as an alias during migration — remove once all components updated
export type Offer = Item

// ============================================================================
// PAGE CONTENT
// ============================================================================

export interface PageContent {
  schemaVersion: string
  pageContentType: ContentType

  // Page metadata
  pageTitle: string
  metaDescription: string
  h1: string
  introduction: string
  seoKeywords: string[]
  summary: string
  lastUpdated?: string
  disclosure?: string

  // Schema.org
  schema: {
    '@context': string
    '@type': string
    numberOfItems?: number
    itemListElement?: Array<{
      '@type': string
      position: number
      name: string
      url?: string
      description?: string
    }>
    aggregateRating?: {
      '@type': string
      ratingValue: number
      reviewCount: number
    }
  }

  // Main items
  items: Item[]

  // Sections — present depends on content type
  comparisonTable?: {
    enabled: boolean
    columns: ComparisonColumn[]
  }
  buyerGuide?: BuyerGuideSection[]
  faq?: FAQItem[]
  finalRecommendation?: {
    text: string
    cta?: {
      label: string
      url: string
    }
  }

  // Place-specific sections
  additionalSections?: {
    locationMap?: {
      center: string
      places: Array<{
        name: string
        lat: number
        lng: number
        address?: string
      }>
    }
    [key: string]: unknown
  }

  relatedContent?: {
    pages?: RelatedPage[]
    tags?: string[]
  }

  analytics?: {
    trackingPixels?: TrackingPixel[]
    conversionTracking?: {
      enabled: boolean
      goals?: Goal[]
    }
  }

  compliance?: {
    requiresDisclosure: boolean
    regulatedCategory: boolean
    ftcCompliant?: boolean
    gdprCompliant?: boolean
    notes?: string
  }
}

export interface ComparisonColumn {
  id: string
  label: string
  field: string
  type: string
}

export interface BuyerGuideSection {
  title: string
  contentHtml: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface RelatedPage {
  title: string
  url: string
  category: string
}

export interface TrackingPixel {
  provider: string
  id: string
}

export interface Goal {
  name: string
  eventName: string
}

// ============================================================================
// CONTENT TYPE HELPERS
// Type guards and accessors — keeps content_type_data access clean in components
// ============================================================================

export function isCommerceType(contentType: ContentType): boolean {
  return contentType === 'physical_product' || contentType === 'service_offer'
}

export function isPlaceType(contentType: ContentType): boolean {
  return contentType === 'place'
}

export function isPersonType(contentType: ContentType): boolean {
  return contentType === 'person'
}

// Safe accessors — return undefined gracefully if data not present

export function getCommerce(item: Item): CommerceContentTypeData | undefined {
  return item.contentTypeData?.commerce
}

export function getPlace(item: Item): PlaceContentTypeData | undefined {
  return item.contentTypeData?.place
}

export function getPricing(item: Item): CommerceContentTypeData['source']['pricing'] | undefined {
  return item.contentTypeData?.commerce?.source?.pricing
}

export function getLocation(item: Item): PlaceContentTypeData['location'] | undefined {
  return item.contentTypeData?.place?.location
}

// ============================================================================
// ARTICLE META
// ============================================================================

export interface ArticleMeta {
  articleId: string
  articleSlug: string
  articleTitle: string
  articlePrompt: string
  articleContentType: string
  excerpt: string
  metaDescription: string
  publishedDate: string
  lastUpdated: string
  featured: boolean
  featuredOrder: number
  status: string
  tags: string[]
  imagePrompt: string
  relatedPages: string[]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateSelectivity(featured: number, analyzed: number): number {
  if (!analyzed || analyzed === 0 || !featured) return 0
  return parseFloat(((featured / analyzed) * 100).toFixed(1))
}

export function calculateRejectionRate(featured: number, analyzed: number): number {
  const selectivity = calculateSelectivity(featured, analyzed)
  return parseFloat((100 - selectivity).toFixed(1))
}

export function formatPageStats(page: PageMeta) {
  const stats = {
    itemsAnalyzed: page.itemsAnalyzed || (page as any).items_analyzed || 0,
    itemsFeatured: page.itemsFeatured || (page as any).items_featured || 0,
    selectivity: calculateSelectivity(
      page.itemsFeatured || (page as any).items_featured || 0,
      page.itemsAnalyzed || (page as any).items_analyzed || 0
    ),
  }

  const metadata = page.metadata || {}

  return {
    ...stats,
    hasStats: stats.itemsAnalyzed > 0,
    avgRating: metadata.avgRating,
    totalReviews: metadata.totalReviews,
    priceRange: metadata.priceRange,
    diversityMetric: metadata.diversityMetric,
    reviewsDisplay: metadata.totalReviews
      ? `${metadata.totalReviews.toLocaleString()}+ verified reviews`
      : null,
    priceDisplay: metadata.priceRange
      ? typeof metadata.priceRange === 'string'
        ? metadata.priceRange
        : `$${metadata.priceRange.min?.toFixed(2) ?? "?"}-$${metadata.priceRange.max?.toFixed(2) ?? "?"}`
      : null,
    ratingDisplay: metadata.avgRating ? `${Number(metadata.avgRating).toFixed(1)}★ average` : null,
    diversityDisplay: metadata.diversityMetric
      ? `${metadata.diversityMetric.count} ${metadata.diversityMetric.label}`
      : null,
  }
}

export function calculateCategoryStats(category: Category) {
  let totalAnalyzed = 0
  let totalFeatured = 0
  const diversityMetrics: Array<{ type: string; count: number; label: string }> = []

  category.pages.forEach((page) => {
    totalAnalyzed += page.itemsAnalyzed || 0
    totalFeatured += page.itemsFeatured || 0
    if (page.metadata?.diversityMetric) {
      diversityMetrics.push(page.metadata.diversityMetric)
    }
  })

  const selectivity =
    totalAnalyzed > 0
      ? parseFloat(((totalFeatured / totalAnalyzed) * 100).toFixed(1))
      : 0
  const rejectionRate =
    totalAnalyzed > 0 ? parseFloat((100 - selectivity).toFixed(1)) : 0

  const diversityByType: Record<string, { count: number; label: string }> = {}
  diversityMetrics.forEach((metric) => {
    if (!diversityByType[metric.type]) {
      diversityByType[metric.type] = { count: 0, label: metric.label }
    }
    diversityByType[metric.type].count = Math.max(
      diversityByType[metric.type].count,
      metric.count
    )
  })

  return {
    totalAnalyzed,
    totalFeatured,
    selectivity,
    rejectionRate,
    totalPages: category.pages.length,
    diversityMetrics: Object.entries(diversityByType).map(([type, data]) => ({
      type,
      count: data.count,
      label: data.label,
    })),
    hasStats: totalAnalyzed > 0,
  }
}