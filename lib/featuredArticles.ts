// lib/featuredArticles.ts
// The home page featured section: which articles, how many, how laid out.
// Settings come from theme-config.json components.featuredArticles; anything
// missing falls back to DEFAULT_FEATURED_ARTICLES, which reproduces the
// original fixed section (published featured articles by featured_order,
// 3 items, 3 columns from md, 1.5rem gap = the old gap-6).
import { ArticleMeta, FeaturedArticlesComponentConfig } from '@/lib/types'

export type ResolvedFeaturedArticlesConfig = Required<Omit<FeaturedArticlesComponentConfig, 'articleContentType'>> &
  Pick<FeaturedArticlesComponentConfig, 'articleContentType'>

export const DEFAULT_FEATURED_ARTICLES: ResolvedFeaturedArticlesConfig = {
  enabled: true,
  columns: 3,
  gap: '1.5rem',
  count: 3,
  source: 'featured',
  articleContentType: null,
  showViewAllLink: true,
}

// Tailwind only ships classes it can see in the source, so columns map to
// fixed class names instead of being built at runtime. Always 1 column on
// mobile. A last row that isn't full stays left-aligned (normal CSS grid).
export const FEATURED_GRID_COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback
  return Math.min(max, Math.max(min, n))
}

export function resolveFeaturedArticlesConfig(
  config?: FeaturedArticlesComponentConfig,
): ResolvedFeaturedArticlesConfig {
  const d = DEFAULT_FEATURED_ARTICLES
  return {
    enabled: config?.enabled ?? d.enabled,
    columns: clampInt(config?.columns, 1, 4, d.columns),
    gap: config?.gap || d.gap,
    count: clampInt(config?.count, 1, 24, d.count),
    source: config?.source === 'newest' ? 'newest' : 'featured',
    articleContentType: config?.articleContentType || null,
    showViewAllLink: config?.showViewAllLink ?? d.showViewAllLink,
  }
}

export function selectFeaturedArticles(
  articles: ArticleMeta[],
  config: ResolvedFeaturedArticlesConfig,
): ArticleMeta[] {
  if (!config.enabled) return []

  const candidates = articles
    .filter(a => a.status === 'published')
    .filter(a => !config.articleContentType || a.article_content_type === config.articleContentType)

  const ordered = config.source === 'newest'
    ? [...candidates].sort((a, b) =>
        new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    : candidates
        .filter(a => a.featured)
        .sort((a, b) => a.featured_order - b.featured_order)

  return ordered.slice(0, config.count)
}
