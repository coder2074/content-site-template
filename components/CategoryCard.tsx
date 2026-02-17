'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'
import { useState } from 'react'

interface CategoryCardProps {
  category: Category
  logoUrl: string  // ✅ Changed from function to string
  layout: 'grid' | 'list'
  gap: string
  animationEnabled: boolean
  animationDuration: string
}

export default function CategoryCard({ 
  category, 
  logoUrl,  // ✅ Just the URL string
  layout,
  gap,
  animationEnabled,
  animationDuration
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link
      href={`/${category.categoryId}`}
      className="group rounded-xl shadow-md p-6 border flex items-center justify-between"
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
      <div className="flex-1">
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
      
      <div 
        className="relative flex-shrink-0 ml-6"
        style={{ 
          width: '80px', 
          height: '80px',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 300ms'
        }}
      >
        <Image
          src={logoUrl}  // ✅ Use the URL directly
          alt={category.categoryTitle}
          fill
          className="object-contain"
        />
      </div>
    </Link>
  )
}