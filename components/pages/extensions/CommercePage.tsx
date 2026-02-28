// components/pages/extensions/CommercePage.tsx
import { PageContent, PageMeta, Category } from '@/lib/types'
import BasePage from '../BasePage'
import ComparisonTable from '@/components/ComparisonTable'
import BuyerGuide from '@/components/BuyerGuide'

interface CommercePageProps {
  pageContent: PageContent
  pageMeta: PageMeta
  category: Category
  categoryId: string
}

export default function CommercePage({
  pageContent,
  pageMeta,
  category,
  categoryId,
}: CommercePageProps) {
  const headerSlot = pageContent.comparisonTable?.enabled ? (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Quick Comparison</h2>
      <ComparisonTable offers={pageContent.items} />
    </div>
  ) : null

  const footerSlot = (
    <>
      {pageContent.buyerGuide && pageContent.buyerGuide.length > 0 && (
        <div className="mb-16">
          <BuyerGuide sections={pageContent.buyerGuide} />
        </div>
      )}

      {pageContent.finalRecommendation && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center mb-16">
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
    />
  )
}
