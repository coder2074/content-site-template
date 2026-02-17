// ============================================================================
// FILE: components/FAQ.tsx
// ============================================================================
'use client'
import { FAQItem } from '@/lib/types'
import { useState } from 'react'

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left flex items-start justify-between gap-4 group"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {item.question}
              </h3>
              <span className="text-2xl text-gray-400 flex-shrink-0">
                {openIndex === idx ? '−' : '+'}
              </span>
            </button>
            {openIndex === idx && (
              <p className="mt-3 text-gray-700 leading-relaxed pl-0">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}