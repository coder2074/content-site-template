'use client'

// components/ComparisonTable.tsx
import { Item, getPricing } from '@/lib/types'

export default function ComparisonTable({ offers }: { offers: Item[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Best For</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {offers.map((offer: Item) => {
            const pricing = getPricing(offer)
            const priceDisplay = pricing?.display || '-'

            return (
              <tr key={offer.rank} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">#{offer.rank}</span>
                    {offer.badge && (
                      <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-semibold">
                        {offer.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{offer.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{offer.tagline}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{priceDisplay}</td>
                <td className="px-6 py-4">
                  {offer.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{offer.rating.value}</span>
                      <span className="text-gray-500 text-sm">
                        {offer.rating.scale ? `/ ${offer.rating.scale}` :
                         offer.rating.count ? `(${offer.rating.count.toLocaleString()})` : ''}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {offer.cta.map((cta, index) => (
                      <a
                        key={index}
                        href={cta.url}
                        target="_blank"
                        rel="nofollow noopener"
                        className={`px-4 py-2 rounded transition text-sm font-semibold text-center ${
                          index === 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                        }`}
                      >
                        {cta.text}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
