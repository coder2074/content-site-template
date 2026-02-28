// components/items/extensions/CommerceItemCard.tsx
import { Item, getCommerce, getPricing } from '@/lib/types'
import BaseItemCard from '../BaseItemCard'

interface CommerceItemCardProps {
  item: Item
}

export default function CommerceItemCard({ item }: CommerceItemCardProps) {
  const commerce = getCommerce(item)
  const pricing = getPricing(item)

  return (
    <BaseItemCard
      item={item}
      accentColor="from-blue-600 to-blue-700"
      attributesLabel="Key Features"
    >
      {/* Pricing — in header area via override pattern */}
      {pricing && (
        <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div>
            <span className="text-2xl font-bold text-blue-700">{pricing.display}</span>
            {pricing.notes && (
              <span className="text-sm text-gray-500 ml-2">{pricing.notes}</span>
            )}
          </div>
          {pricing.type && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {pricing.type.replace('_', ' ')}
            </span>
          )}
        </div>
      )}

      {/* Pros & Cons */}
      {(commerce?.pros?.length || commerce?.cons?.length) && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {commerce?.pros && commerce.pros.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span>✓</span> Pros
              </h4>
              <ul className="space-y-2">
                {commerce.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1 shrink-0">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {commerce?.cons && commerce.cons.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <span>✗</span> Cons
              </h4>
              <ul className="space-y-2">
                {commerce.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 mt-1 shrink-0">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Editorial Review */}
      {commerce?.review && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Our Take</h4>
          <p className="text-gray-700 leading-relaxed">{commerce.review.editorial}</p>
          {commerce.review.verdict && (
            <p className="text-blue-700 font-semibold mt-2">
              Verdict: {commerce.review.verdict}
            </p>
          )}
        </div>
      )}
    </BaseItemCard>
  )
}
