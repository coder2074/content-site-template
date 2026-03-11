// app/page.tsx
import CategoryCard from '@/components/CategoryCard'
import { fetchSiteConfig, fetchSiteContent, fetchThemeConfig, getCategoryLogoUrl } from '@/lib/s3'
import { Category, ArticleMeta } from '@/lib/types'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  return {
    alternates: {
      canonical: '/',
    },
  }
}

export default async function HomePage() {
  const siteConfig = await fetchSiteConfig()
  const themeConfig = await fetchThemeConfig()
  const siteContent = await fetchSiteContent()

  const stats = siteConfig.stats || {
    total_items_analyzed: 0,
    total_items_featured: 0,
    total_pages: 0,
    total_categories: 0
  }

  const selectivityRate = stats.total_items_analyzed > 0
    ? ((stats.total_items_featured / stats.total_items_analyzed) * 100).toFixed(1)
    : 0

  const { components } = themeConfig
  const { hero: heroTheme, trustBadges, categoriesSection } = components
  const { hero: heroContent, trustIndicators, about } = siteContent

  const layout = (heroTheme.layout || 'centered') as 'centered' | 'left' | 'right'
  const heroAlignmentClass = { centered: 'text-center', left: 'text-left', right: 'text-right' }[layout]
  const heroContentMaxWidth = { centered: 'max-w-4xl mx-auto', left: 'max-w-4xl', right: 'max-w-4xl ml-auto' }[layout]

  const featuredArticles: ArticleMeta[] = (siteConfig.articles || [])
    .filter(a => a.featured && a.status === 'published')
    .sort((a, b) => a.featured_order - b.featured_order)
    .slice(0, 3)

  return (
    <div className="mx-auto px-4 py-16" style={{ maxWidth: 'var(--layout-max-width)' }}>
      {/* Hero */}
      <div
        className={`mb-16 ${heroContentMaxWidth}`}
        style={{
          background: heroTheme.backgroundStyle === 'gradient'
            ? 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
            : heroTheme.backgroundStyle === 'solid' ? 'var(--color-bg-primary)' : 'transparent',
          padding: heroTheme.backgroundStyle !== 'none' ? '3rem' : '0',
          borderRadius: heroTheme.backgroundStyle !== 'none' ? '1rem' : '0'
        }}
      >
        <div className={heroAlignmentClass}>
          {heroTheme.badge.enabled && (
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: `var(--color-primary)`, color: 'white', opacity: 0.9 }}
            >
              {heroContent.badge.text}
            </div>
          )}
          <h1
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
            dangerouslySetInnerHTML={{ __html: heroContent.headline }}
          />
          <p
            className="text-xl leading-relaxed mb-12"
            style={{
              color: 'var(--color-text-secondary)',
              maxWidth: heroTheme.layout === 'centered' ? '42rem' : 'none',
              marginLeft: heroTheme.layout === 'centered' ? 'auto' : '0',
              marginRight: heroTheme.layout === 'centered' ? 'auto' : '0'
            }}
          >
            {heroContent.subheadline}
          </p>
          <a
            href={heroContent.cta.url}
            className="inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            {heroContent.cta.text}
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      {trustBadges.enabled && (
        <div className="flex flex-wrap justify-center gap-8 mb-16 pb-12 border-b" style={{ borderColor: 'var(--color-bg-secondary)' }}>
          {stats.total_items_analyzed > 0 ? (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  {stats.total_items_analyzed.toLocaleString()}+
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {siteContent.badgeLabels?.itemsAnalyzed || 'Items Analyzed'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  {stats.total_items_featured}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {siteContent.badgeLabels?.itemsFeatured || 'Expert Picks'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  Top {selectivityRate}%
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {siteContent.badgeLabels?.selectivity || 'Selected'}
                </div>
              </div>
            </>
          ) : (
            <>
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl" style={{ color: 'var(--color-primary)' }}>✓</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{indicator}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      
      {/* Categories */}
      {categoriesSection.enabled && (
        <div id="categories"> 
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-text-primary)' }}>
            {siteContent.categoriesSection.title}
          </h2>
          <div
            className="mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: categoriesSection.layout === 'grid' ? 'repeat(auto-fill, minmax(300px, 320px))' : '1fr',
              gap: categoriesSection.gap,
              maxWidth: '1024px'
            }}
          >
            {siteConfig.categories.map((category: Category) => (
              <CategoryCard
                key={category.category_id}
                category={category}
                logoUrl={getCategoryLogoUrl(category.category_id)}
                layout={categoriesSection.layout || 'grid'}
                gap={categoriesSection.gap || '2rem'}
                animationEnabled={themeConfig.animations?.enabled || false}
                animationDuration={themeConfig.animations?.duration || '300ms'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Getting Started</h2>
            <Link href="/blog" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
              View all guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article.article_id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {about && about.content && (
          <div
            id="about"
              className="mt-20 p-8 rounded-xl  scroll-mt-20" style={{ backgroundColor: 'var(--color-bg-primary)', maxWidth: '56rem', margin: '5rem auto 0' }}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>{about.title}</h2>
          <div className="prose prose-lg max-w-none" style={{ color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: about.content }} />
        </div>
      )}
    </div>
  )
}
