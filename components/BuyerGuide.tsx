// ============================================================================
// FILE: components/BuyerGuide.tsx
// ============================================================================

export default function BuyerGuide({ sections }: { sections: Array<{ title: string; contentHtml: string }> }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Buyer's Guide</h2>
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.contentHtml }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}