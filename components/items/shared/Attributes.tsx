// components/items/shared/Attributes.tsx
interface AttributesProps {
  attributes: Record<string, string>
  label?: string
}

export default function Attributes({ attributes, label = 'Details' }: AttributesProps) {
  if (!attributes || Object.keys(attributes).length === 0) return null
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-lg">{label}</h4>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key} className="text-sm bg-gray-50 rounded p-2">
            <span className="text-gray-500 block text-xs mb-0.5">{key}</span>
            <span className="text-gray-900 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
