'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'
import { useState } from 'react'

interface CategoryCardProps {
  category: Category
  logoUrl: string
  layout: 'grid' | 'list'
  gap: string
  animationEnabled: boolean
  animationDuration: string
}

export default function CategoryCard({ 
  category, 
  logoUrl,
  layout,
  gap,
  animationEnabled,
  animationDuration
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link
      href={`/${category.categoryId}`}
      className="group rounded-xl shadow-md border overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
          : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        transition: animationEnabled ? `all ${animationDuration}` : 'all 300ms',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full-width image at top */}
      <div className="aspect-video overflow-hidden">
        <Image
          src={logoUrl}
          alt={category.categoryTitle}
          width={600}
          height={338}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>

      {/* Text content below */}
      <div className="p-6 flex-1">
        <h3 
          className="text-2xl font-bold mb-2 transition"
          style={{ 
            color: isHovered ? 'var(--color-primary)' : 'var(--color-text-primary)',
            fontFamily: 'var(--font-heading)',
            transition: 'color 200ms'
          }}
        >
          {category.categoryTitle}
        </h3>
        <p 
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {category.pages.length} {category.pages.length === 1 ? 'page' : 'pages'} available
        </p>
      </div>
    </Link>
  )
}