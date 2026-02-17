// ============================================================================
// FILE: app/[category]/[page]/page.tsx (COMPLETE - NO ERRORS)
// ============================================================================
import { fetchSiteConfig, fetchPageContent } from '@/lib/s3'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ComparisonTable from '@/components/ComparisonTable'
import OfferCard from '@/components/OfferCard'
import BuyerGuide from '@/components/BuyerGuide'
import FAQ from '@/components/FAQ'
import type { Metadata } from 'next'

interface AffiliatePageProps {
  params: Promise<{ category: string; page: string }>
}

export async function generateStaticParams() {
  const siteConfig = await fetchSiteConfig()
  const params = []
  
  for (const category of siteConfig.categories) {
    for (const page of category.pages) {
      params.push({
        category: category.categoryId,
        page: page.pageId,
      })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: AffiliatePageProps): Promise<Metadata> {
  try {
    const { category, page } = await params
    const content = await fetchPageContent(category, page)
    return {
      title: content.pageTitle,
      description: content.metaDescription || content.introduction,
      keywords: content.seoKeywords?.join(', '),
    }
  } catch {
    return {}
  }
}

export default async function AffiliatePage({ params }: AffiliatePageProps) {
  const { category: categoryId, page: pageId } = await params
  console.log("params:", { categoryId, pageId })

  const siteConfig = await fetchSiteConfig()
  console.log("siteConfig loaded")

  const category = siteConfig.categories.find(
    (c) => c.categoryId === categoryId
  )

  if (!category) {
    console.error("❌ Category not found:", categoryId)
    notFound()
  }

  console.log("✅ category found:", category.categoryId)

  const pageMeta = category.pages.find(
    (p) => p.pageId === pageId
  )

  if (!pageMeta) {
    console.error("❌ Page not found:", pageId)
    notFound()
  }

  console.log("✅ page found:", pageMeta.pageId)
  
  if (!category) notFound()
  
  let pageContent
  try {
    console.log("➡️ fetching page pageContent")
    pageContent = await fetchPageContent(categoryId, pageId)
    console.log("✅ pageContent fetched")
    console.log("Here is the pageContent:", pageContent)
  } catch (err) {
    console.error("❌ fetchPageContent failed:", err)
    notFound()
  }

  // ✅ Updated field names
  const stats = pageMeta ? {
    itemsFeatured: pageMeta.itemsFeatured || 0,      // ← Changed
    itemsAnalyzed: pageMeta.itemsAnalyzed || 0       // ← Changed
  } : null

  const selectivityRate = stats && stats.itemsAnalyzed > 0
    ? ((stats.itemsFeatured / stats.itemsAnalyzed) * 100).toFixed(1)
    : null

  const rejectionRate = selectivityRate
    ? (100 - parseFloat(selectivityRate)).toFixed(1)
    : null

  // ✅ Determine if this is commerce pageContent
  const isCommerce = ['physical_product', 'service_offer'].includes(pageContent.pageContentType)
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {' > '}
        <Link href={`/${categoryId}`} className="hover:text-blue-600">
          {category.categoryTitle}
        </Link>
        {' > '}
        <span className="text-gray-900">{pageContent.pageTitle}</span>
      </nav>

      {/* Page Header */}
      <h1 className="text-5xl font-bold mb-4">{pageContent.pageTitle}</h1>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        {/* Last updated - show if present */}
        {pageContent.lastUpdated && (
          <span>Last updated: {new Date(pageContent.lastUpdated).toLocaleDateString()}</span>
        )}
        
        {/* ✅ Research Badge - Only show if we have stats */}
        {stats && stats.itemsAnalyzed > 0 && (
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs">
            <strong className="text-blue-600">{stats.itemsAnalyzed} analyzed</strong>
            → {stats.itemsFeatured} picks
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {selectivityRate}%
            </span>
          </span>
        )}
      </div>

      {/* Disclosure - only for commerce */}
      {isCommerce && pageContent.disclosure && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
          <p className="text-sm text-gray-700">{pageContent.disclosure}</p>
        </div>
      )}

      {/* ✅ Conditional: Detailed Stats Section (only if stats exist) */}
      {stats && stats.itemsAnalyzed > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isCommerce ? 'Our Research Process' : 'Our Selection Process'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Items Analyzed */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.itemsAnalyzed}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isCommerce ? 'Products Analyzed' : 'Items Analyzed'}
              </div>
              <div className="text-xs text-gray-500">
                We researched every highly-rated option
              </div>
            </div>
            
            {/* Diversity Metric - NEW! */}
            {pageMeta.metadata?.diversityMetric && (
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pageMeta.metadata.diversityMetric.count}
                </div>
                <div className="text-sm text-gray-600 mb-2 capitalize">
                  {pageMeta.metadata.diversityMetric.label}
                </div>
                <div className="text-xs text-gray-500">
                  Comprehensive coverage
                </div>
              </div>
            )}
            
            {/* Rejection Rate */}
            {rejectionRate && (
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {rejectionRate}%
                </div>
                <div className="text-sm text-gray-600 mb-2">Filtered Out</div>
                <div className="text-xs text-gray-500">
                  Only the best made our list
                </div>
              </div>
            )}
            
            {/* Top Picks */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.itemsFeatured}
              </div>
              <div className="text-sm text-gray-600 mb-2">Top Picks</div>
              <div className="text-xs text-gray-500">
                Our expert recommendations
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intro Text */}
      <p className="text-xl text-gray-700 mb-12 leading-relaxed">
        {pageContent.introduction}
      </p>

      {/* Comparison Table */}
      {pageContent.comparisonTable?.enabled && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Quick Comparison</h2>
          <ComparisonTable offers={pageContent.items} />
        </div>
      )}

      {/* ✅ Main pageContent - Contextual heading */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          {isCommerce ? 'Detailed Reviews' : 'Complete List'}
        </h2>
        <div className="space-y-12">
          {pageContent.items.map((offer) => (
            <OfferCard key={offer.rank} offer={offer} pageContent={pageContent} />
          ))}
        </div>
      </div>

      {/* Buyer Guide */}
      {pageContent.buyerGuide && pageContent.buyerGuide.length > 0 && (
        <div className="mb-16">
          <BuyerGuide sections={pageContent.buyerGuide} />
        </div>
      )}

      {/* FAQ */}
      {pageContent.faq && pageContent.faq.length > 0 && (
        <div className="mb-16">
          <FAQ items={pageContent.faq} />
        </div>
      )}

      {/* Final Recommendation */}
      {pageContent.finalRecommendation && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Our Final Verdict</h2>
          <p className="text-lg mb-6">{pageContent.finalRecommendation.text}</p>
          {pageContent.finalRecommendation.cta && (
            <a
              href={pageContent.finalRecommendation.cta.url}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              {pageContent.finalRecommendation.cta.label}
            </a>
          )}
        </div>
      )}

      {/* Related pageContent */}
      {pageContent.relatedContent?.pages && pageContent.relatedContent.pages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageContent.relatedContent.pages.map((relatedPage) => (
              <Link
                key={relatedPage.url}
                href={relatedPage.url}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <h3 className="font-bold mb-2">{relatedPage.title}</h3>
                <p className="text-sm text-gray-600">{relatedPage.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}