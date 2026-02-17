// ============================================================================
// FILE: components/OfferCard.tsx - UPDATED WITH CTA ARRAY
// ============================================================================
import { Offer, PageContent } from '@/lib/types'
import Image from 'next/image'

export default function OfferCard({ offer, pageContent }: { offer: Offer, pageContent: PageContent }) {
  // Determine if this is a commerce item
  const isCommerce = ['physical_product', 'service_offer'].includes(pageContent.pageContentType)
  
  // Get primary and secondary CTAs
  const primaryCTA = offer.cta?.[0]
  const secondaryCTAs = offer.cta?.slice(1) || []
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-bold">#{offer.rank}</span>
              {offer.badge && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {offer.badge}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">{offer.name}</h3>
            <p className="text-blue-100">{offer.bestFor}</p>
          </div>
          
          {/* Conditional: Pricing (commerce only) */}
          {offer.pricing && (
            <div className="text-right ml-4">
              <div className="text-3xl font-bold">{offer.pricing.display}</div>
              {offer.pricing.notes && (
                <div className="text-sm text-blue-100 mt-1">{offer.pricing.notes}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Images */}
        {offer.media?.images && offer.media.images.length > 0 && (
          <div className="mb-6">
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={offer.media.images[0].url}
                alt={offer.media.images[0].alt}
                fill
                className="object-contain"
              />
            </div>
            {offer.media.images[0].caption && (
              <p className="text-sm text-gray-600 text-center mt-2">
                {offer.media.images[0].caption}
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{offer.summary}</p>

        {/* Conditional: Rating (products/services/places) */}
        {offer.rating && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">★</span>
              <span className="text-3xl font-bold text-gray-900">{offer.rating.value}</span>
              <span className="text-gray-500">/ {offer.rating.scale}</span>
            </div>
            {offer.rating.count && (
              <span className="text-gray-600">({offer.rating.count.toLocaleString()} reviews)</span>
            )}
            <span className="text-gray-500 text-sm ml-auto">{offer.rating.source}</span>
          </div>
        )}

        {/* Conditional: Location (places only) */}
        {offer.location && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-xl">📍</span> Location
            </h4>
            <div className="text-gray-700">
              {offer.location.address && <div>{offer.location.address}</div>}
              {(offer.location.city || offer.location.state) && (
                <div>
                  {offer.location.city}{offer.location.city && offer.location.state && ', '}{offer.location.state}
                </div>
              )}
              {offer.location.country && <div>{offer.location.country}</div>}
            </div>
          </div>
        )}

        {/* Conditional: Stats (people only) */}
        {offer.stats && Object.keys(offer.stats).length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(offer.stats).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">{key}</div>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditional: Achievements (people only) */}
        {offer.achievements && offer.achievements.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🏆</span> Achievements
            </h4>
            <ul className="space-y-2">
              {offer.achievements.map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-500 mt-1">★</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conditional: Highlights (list items only) */}
        {offer.highlights && offer.highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Key Highlights</h4>
            <ul className="space-y-2">
              {offer.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Features/Attributes (all types) */}
        {offer.attributes && Object.keys(offer.attributes).length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">
              {isCommerce ? 'Key Features' : 'Details'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(offer.attributes).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="ml-2 text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditional: Pros & Cons (commerce only) */}
        {(offer.pros || offer.cons) && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {offer.pros && offer.pros.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">✓</span> Pros
                </h4>
                <ul className="space-y-2">
                  {offer.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {offer.cons && offer.cons.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">✗</span> Cons
                </h4>
                <ul className="space-y-2">
                  {offer.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Conditional: Editorial Review (commerce only) */}
        {offer.review && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Our Take</h4>
            <p className="text-gray-700 leading-relaxed">{offer.review.editorial}</p>
            {offer.review.verdict && (
              <p className="text-blue-700 font-semibold mt-2">Verdict: {offer.review.verdict}</p>
            )}
          </div>
        )}

        {/* Description HTML (all types) */}
        {offer.descriptionHtml && (
          <div 
            className="prose prose-sm max-w-none mb-6 text-gray-700"
            dangerouslySetInnerHTML={{ __html: offer.descriptionHtml }}
          />
        )}

        {/* CTAs - UPDATED TO USE ARRAY */}
        <div className="space-y-4">
          {/* Primary CTA */}
          {primaryCTA && (
            <a
              href={primaryCTA.url}
              target="_blank"
              rel="nofollow noopener"
              className="block w-full px-6 py-3 rounded-lg font-semibold transition text-center bg-blue-600 text-white hover:bg-blue-700"
            >
              {primaryCTA.text} →
            </a>
          )}

          {/* Secondary CTAs (if multiple retailers/options available) */}
          {secondaryCTAs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">Also available at:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {secondaryCTAs.map((cta, idx) => (
                  <a
                    key={idx}
                    href={cta.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="px-4 py-2 rounded-lg font-semibold transition text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                  >
                    {cta.merchant ? `View on ${cta.merchant}` : cta.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}