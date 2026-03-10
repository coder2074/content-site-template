'use client'

// components/pages/extensions/CommercePage.tsx
import { PageContent, PageMeta, Category, ArticleMeta } from '@/lib/types'
import BasePage from '../BasePage'
import ComparisonTable from '@/components/ComparisonTable'
import BuyerGuide from '@/components/BuyerGuide'

interface CommercePageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
  relatedArticles?: ArticleMeta[]
  relatedPages?: Array<{ page: PageMeta; category: Category }>
}

export default function CommercePage({ pageContent, pageMeta, category, categoryId, relatedArticles, relatedPages }: CommercePageProps) {
  const headerSlot = pageContent.comparison_table?.enabled ? (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Quick Comparison</h2>
      <ComparisonTable offers={pageContent.items} />
    </div>
  ) : null

  const footerSlot = (
    <>
      {pageContent.buyer_guide && pageContent.buyer_guide.length > 0 && (
        <div className="mb-12">
          <BuyerGuide sections={pageContent.buyer_guide} />
        </div>
      )}
      {pageContent.final_recommendation && (
        <div className="bg-blue-600 text-white rounded-xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Final Recommendation</h2>
          <p className="text-lg mb-6">{pageContent.final_recommendation.text}</p>
          {pageContent.final_recommendation.cta && (
            <a
              href={pageContent.final_recommendation.cta.url}
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              {pageContent.final_recommendation.cta.label}
            </a>
          )}
        </div>
      )}
    </>
  )

  return (
    <BasePage
      pageContent={pageContent}
      pageMeta={pageMeta}
      category={category}
      categoryId={categoryId}
      headerSlot={headerSlot}
      footerSlot={footerSlot}
      relatedArticles={relatedArticles}
      relatedPages={relatedPages}
    />
  )
}
