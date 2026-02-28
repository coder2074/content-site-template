// components/items/shared/Highlights.tsx
interface HighlightsProps {
  highlights: string[]
  label?: string
}

export default function Highlights({ highlights, label = 'Key Highlights' }: HighlightsProps) {
  if (!highlights || highlights.length === 0) return null
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-lg">{label}</h4>
      <ul className="space-y-2">
        {highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-600 mt-1 shrink-0">•</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
