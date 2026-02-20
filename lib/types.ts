// ============================================================================
// FILE: lib/types.ts - UPDATED WITH NEW THEME STRUCTURE
// ============================================================================

export interface SiteConfig {
  siteId: string
  siteTitle: string
  siteDescription?: string
  categories: Category[]
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
  lastUpdated: string
}

export interface Category {
  categoryId: string
  categoryTitle: string
  categorySlug?: string
  pages: PageMeta[]
  stats?: CategoryStats
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
  priceRange?: {
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
// THEME CONFIG (DESIGN ONLY - NO CONTENT)
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
    style: string  // "blue" | "green" | "purple" | "yellow"
    position: string  // "top" | "center"
  }
  layout: string  // "centered" | "left" | "right"
  backgroundStyle: string  // "gradient" | "solid" | "none"
  headline?: string
  subheadline?: string
}

export interface TrustBadgesComponentConfig {
  enabled: boolean
  mode: "auto" | "custom"
  style: string  // "minimal" | "elevated" | "outlined"
  iconSize?: string
  customBadges?: Array<{
    value: string
    label: string
  }>
}

export interface CategoriesSectionComponentConfig {
  enabled: boolean
  layout: "grid" | "list"
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
// PAGE CONTENT
// ============================================================================

export interface PageContent {
  // ============================================================================
  // SCHEMA & VERSIONING
  // ============================================================================
  schemaVersion: string
  pageContentType: 'physical_product' | 'service_offer' | 'list_item' | 'place' | 'person'
  
  // ============================================================================
  // PAGE METADATA (Top Level - Flat Structure)
  // ============================================================================
  pageTitle: string
  metaDescription: string
  h1: string
  introduction: string
  seoKeywords: string[]
  summary: string
  lastUpdated?: string
  disclosure?: string
  
  // ============================================================================
  // SCHEMA.ORG STRUCTURED DATA
  // ============================================================================
  schema: {
    "@context": string
    "@type": string
    numberOfItems?: number
    itemListElement?: Array<{
      "@type": string
      position: number
      name: string
      url?: string
      description?: string
    }>
    aggregateRating?: {
      "@type": string
      ratingValue: number
      reviewCount: number
    }
  }
  
  // ============================================================================
  // MAIN CONTENT
  // ============================================================================
  items: Offer[]
  
  // ============================================================================
  // OPTIONAL CONTENT SECTIONS
  // ============================================================================
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
  
  relatedContent?: {
    pages?: RelatedPage[]
    tags?: string[]
  }
  
  // ============================================================================
  // ANALYTICS & COMPLIANCE (Optional)
  // ============================================================================
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

export interface Offer {
  // ============================================================================
  // BASE FIELDS - ALL CONTENT TYPES HAVE THESE
  // ============================================================================
  rank: number
  name: string
  summary: string
  badge?: string
  bestFor: string
  descriptionHtml: string
  attributes: Record<string, string>
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
  
  // Generic CTA array - supports multiple CTAs per item
  // CHANGED: Was single object, now array to support multi-retailer/multi-action
  cta: Array<{
    text: string
    url: string
    type: 'primary' | 'secondary'
    merchant?: string  // Optional merchant identifier for tracking
  }>
  

  // ============================================================================
  // COMMERCE FIELDS - OPTIONAL (physical_product, service_offer only)
  // ============================================================================
  pricing?: {
    display: string
    current?: string
    value?: number
    currency?: string
    type?: string
    priceRange?: {
      min: number
      max: number
    }
    notes?: string
  }
  price?: string
  pricingModel?: string
  
  merchant?: string
  rating?: {
    value: number
    scale: number
    count?: number
    source: string
  }
  pros?: string[]
  cons?: string[]
  review?: {
    editorial: string
    verdict?: string
  }

  keyFeatures?: string[]

  // ============================================================================
  // INFORMATIONAL FIELDS - OPTIONAL (list_item, place, person)
  // ============================================================================
  highlights?: string[]
  
  location?: {
    address?: string
    city?: string
    state?: string
    country?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  
  stats?: Record<string, string | number>
  achievements?: string[]
  role?: string
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
// ARTICLE META (FOR FUTURE BLOG/ARTICLE INTEGRATION)
// ============================================================================

export interface ArticleMeta {
  articleId: string
  articleSlug: string
  articleTitle: string
  excerpt: string
  metaDescription: string
  publishedDate: string
  lastUpdated: string
  featured: boolean
  featuredOrder: number
  status: string
  tags: string[]
  featuredImagePrompt?: string
  relatedPages: string[]
}

export interface SiteConfig {
  siteId: string
  siteTitle: string
  siteDescription?: string
  categories: Category[]
  articles?: ArticleMeta[]  // ← ADD to existing SiteConfig
  stats?: SiteStats
}

// Also update SiteStats to include article counts
export interface SiteStats {
  totalItemsAnalyzed: number
  totalItemsFeatured: number
  totalPages: number
  totalCategories: number
  totalArticles?: number           // ← ADD
  totalArticlesPublished?: number  // ← ADD
  lastUpdated: string
}


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate selectivity rate as a percentage
 */
export function calculateSelectivity(
  featured: number,
  analyzed: number
): number {
  if (analyzed === 0) return 0
  return parseFloat(((featured / analyzed) * 100).toFixed(1))
}

/**
 * Calculate rejection rate (opposite of selectivity)
 */
export function calculateRejectionRate(
  featured: number,
  analyzed: number
): number {
  return parseFloat((100 - calculateSelectivity(featured, analyzed)).toFixed(1))
}

/**
 * Format page stats with metadata
 */
export function formatPageStats(page: PageMeta) {
  const stats = {
    itemsAnalyzed: page.itemsAnalyzed || 0,
    itemsFeatured: page.itemsFeatured || 0,
    selectivity: calculateSelectivity(
      page.itemsFeatured || 0, 
      page.itemsAnalyzed || 0
    )
  }
  
  const metadata = page.metadata || {}
  
  return {
    // Core stats
    ...stats,
    hasStats: stats.itemsAnalyzed > 0,
    
    // Enhanced metadata
    avgRating: metadata.avgRating,
    totalReviews: metadata.totalReviews,
    priceRange: metadata.priceRange,
    diversityMetric: metadata.diversityMetric,
    
    // Formatted strings for display
    reviewsDisplay: metadata.totalReviews 
      ? `${metadata.totalReviews.toLocaleString()}+ verified reviews`
      : null,
    priceDisplay: metadata.priceRange
      ? `$${metadata.priceRange.min.toFixed(2)}-$${metadata.priceRange.max.toFixed(2)}`
      : null,
    ratingDisplay: metadata.avgRating
      ? `${metadata.avgRating.toFixed(1)}★ average`
      : null,
    diversityDisplay: metadata.diversityMetric
      ? `${metadata.diversityMetric.count} ${metadata.diversityMetric.label}`
      : null
  }
}

export function calculateCategoryStats(category: Category) {
  let totalAnalyzed = 0
  let totalFeatured = 0
  const diversityMetrics: Array<{type: string, count: number, label: string}> = []
  
  // Aggregate from all pages in category
  category.pages.forEach(page => {
    totalAnalyzed += page.itemsAnalyzed || 0
    totalFeatured += page.itemsFeatured || 0
    
    // Collect diversity metrics
    if (page.metadata?.diversityMetric) {
      diversityMetrics.push(page.metadata.diversityMetric)
    }
  })
  
  // Calculate selectivity
  const selectivity = totalAnalyzed > 0 
    ? parseFloat(((totalFeatured / totalAnalyzed) * 100).toFixed(1))
    : 0
  const rejectionRate = totalAnalyzed > 0 ? parseFloat((100 - selectivity).toFixed(1)) : 0
  
  // Aggregate diversity metrics by type
  const diversityByType: Record<string, {count: number, label: string}> = {}
  
  diversityMetrics.forEach(metric => {
    if (!diversityByType[metric.type]) {
      diversityByType[metric.type] = {
        count: 0,
        label: metric.label
      }
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
      label: data.label
    })),
    hasStats: totalAnalyzed > 0
  }
}