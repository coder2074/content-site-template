// components/items/shared/CTAButtons.tsx
import { Item } from '@/lib/types'

interface CTAButtonsProps {
  cta: Item['cta']
}

export default function CTAButtons({ cta }: CTAButtonsProps) {
  if (!cta || cta.length === 0) return null

  const primary = cta[0]
  const secondary = cta.slice(1)

  return (
    <div className="space-y-4">
      {primary && (
        <a
          href={primary.url}
          target="_blank"
          rel="nofollow noopener"
          className="block w-full px-6 py-3 rounded-lg font-semibold transition text-center bg-blue-600 text-white hover:bg-blue-700"
        >
          {primary.text} →
        </a>
      )}
      {secondary.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 text-center">Also available at:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {secondary.map((c, idx) => (
              <a
                key={idx}
                href={c.url}
                target="_blank"
                rel="nofollow noopener"
                className="px-4 py-2 rounded-lg font-semibold transition text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
              >
                {c.merchant ? `View on ${c.merchant}` : c.text}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
