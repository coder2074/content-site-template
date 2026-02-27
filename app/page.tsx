// ============================================================================
// FILE: app/page.tsx - FULLY DYNAMIC VERSION
// ============================================================================
import CategoryCard from '@/components/CategoryCard'
import { fetchSiteConfig, fetchSiteContent, fetchThemeConfig, getCategoryLogoUrl } from '@/lib/s3'
import { Category, ArticleMeta } from '@/lib/types'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'

export default async function HomePage() {
  const siteConfig = await fetchSiteConfig()
  const themeConfig = await fetchThemeConfig()
  const siteContent = await fetchSiteContent()
  
  const stats = siteConfig.stats || {
    totalItemsAnalyzed: 0,
    totalItemsFeatured: 0,
    totalPages: 0,
    totalCategories: 0
  }
  
  const selectivityRate = stats.totalItemsAnalyzed > 0
    ? ((stats.totalItemsFeatured / stats.totalItemsAnalyzed) * 100).toFixed(1)
    : 0
  
  const { components } = themeConfig
  const { hero: heroTheme, trustBadges, categoriesSection } = components
  const { hero: heroContent, trustIndicators, about } = siteContent
  
  const heroAlignmentClass = {
    centered: 'text-center',
    left: 'text-left',
    right: 'text-right'
  }[heroTheme.layout] || 'text-center'
  
  const heroContentMaxWidth = {
    centered: 'max-w-4xl mx-auto',
    left: 'max-w-4xl',
    right: 'max-w-4xl ml-auto'
  }[heroTheme.layout] || 'max-w-4xl mx-auto'

  const featuredArticles: ArticleMeta[] = (siteConfig.articles || [])
    .filter(a => a.featured && a.status === 'published')
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, 3)
  
  return (
    <div 
      className="mx-auto px-4 py-16"
      style={{ maxWidth: 'var(--layout-max-width)' }}
    >
      {/* Hero Section */}
      <div 
        className={`mb-16 ${heroContentMaxWidth}`}
        style={{
          background: heroTheme.backgroundStyle === 'gradient' 
            ? 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
            : heroTheme.backgroundStyle === 'solid'
            ? 'var(--color-bg-primary)'
            : 'transparent',
          padding: heroTheme.backgroundStyle !== 'none' ? '3rem' : '0',
          borderRadius: heroTheme.backgroundStyle !== 'none' ? '1rem' : '0'
        }}
      >
        <div className={heroAlignmentClass}>
          {heroTheme.badge.enabled && (
            <div 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{
                backgroundColor: `var(--color-${heroTheme.badge.style === 'blue' ? 'primary' : heroTheme.badge.style})`,
                color: 'white',
                opacity: 0.9
              }}
            >
              {heroContent.badge.text}
            </div>
          )}
          
          <h1 
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{ 
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-heading)'
            }}
            dangerouslySetInnerHTML={{ __html: heroContent.headline }}
          />
          
          <p 
            className="text-xl leading-relaxed mb-8"
            style={{ 
              color: 'var(--color-text-secondary)',
              maxWidth: heroTheme.layout === 'centered' ? '42rem' : 'none',
              margin: heroTheme.layout === 'centered' ? '0 auto' : '0'
            }}
          >
            {heroContent.subheadline}
          </p>
          <a
            href={heroContent.cta.url}
            className="inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white'
            }}
          >
            {heroContent.cta.text}
          </a>
        </div>
      </div>

      {/* Trust Badges Section */}
      {trustBadges.enabled && (
        <div 
          className="flex flex-wrap justify-center gap-8 mb-16 pb-12 border-b"
          style={{ 
            borderColor: 'var(--color-bg-secondary)',
            padding: trustBadges.style === 'elevated' ? '2rem' : '0',
            backgroundColor: trustBadges.style === 'elevated' ? 'var(--color-bg-primary)' : 'transparent',
            borderRadius: trustBadges.style === 'elevated' ? '1rem' : '0',
            boxShadow: trustBadges.style === 'elevated' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {trustBadges.mode === 'auto' && stats.totalItemsAnalyzed > 0 ? (
            <>
              <div className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                >
                  {stats.totalItemsAnalyzed.toLocaleString()}+
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Items Analyzed
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                >
                  {stats.totalItemsFeatured}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Expert Picks
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                >
                  Top {selectivityRate}%
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Selected
                </div>
              </div>
            </>
          ) : trustBadges.mode === 'custom' && trustBadges.customBadges ? (
            <>
              {trustBadges.customBadges.map((badge, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="text-3xl font-bold mb-1"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {badge.value}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {badge.label}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-2xl" style={{ color: 'var(--color-primary)' }}>✓</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {indicator}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      
      {/* Categories Section */}
      {categoriesSection.enabled && (
        <>
          <h2 
            className="text-3xl font-bold text-center mb-10"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {siteContent.categoriesSection.title}
          </h2>
          
          <div 
            className="mx-auto"
            style={{
              display: 'grid',
                gridTemplateColumns: categoriesSection.layout === 'grid' 
                  ? 'repeat(auto-fill, minmax(300px, 320px))'
                  : '1fr',
              gap: categoriesSection.gap,
              maxWidth: '1024px'
            }}
          >
            {siteConfig.categories.map((category: Category) => (
              <CategoryCard
                key={category.categoryId}
                category={category}
                logoUrl={getCategoryLogoUrl(category.categoryId)}
                layout={categoriesSection.layout}
                gap={categoriesSection.gap}
                animationEnabled={themeConfig.animations?.enabled || false}
                animationDuration={themeConfig.animations?.duration || '300ms'}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-3xl font-bold"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
            >
              Getting Started
            </h2>
            <Link
              href="/blog"
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View all guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
            <ArticleCard
              key={article.articleId}
              article={article}
            />            
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      {about && about.content && (
        <div 
          className="mt-20 p-8 rounded-xl"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            maxWidth: '56rem',
            margin: '5rem auto 0'
          }}
        >
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {about.title}
          </h2>
          <div 
            className="prose prose-lg max-w-none"
            style={{ color: 'var(--color-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: about.content }}
          />
        </div>
      )}
    </div>
  )
}