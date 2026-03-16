'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  text: string
  url: string
}

interface NavProps {
  siteName: string
  navLinks: NavLink[]
  trustIndicators: string[]
  logoUrl?: string
  logoWidth?: number
  logoHeight?: number
  showLogo?: boolean
  gradientFrom: string
  gradientTo: string
}

export default function Nav({
  siteName,
  navLinks,
  trustIndicators,
  logoUrl,
  logoWidth,
  logoHeight,
  showLogo,
  gradientFrom,
  gradientTo,
}: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const nameLength = siteName.length
  const mobileTextClass =
    nameLength <= 10 ? 'text-xl' :
    nameLength <= 14 ? 'text-lg' :
    nameLength <= 22 ? 'text-base' :
    'hidden sm:block'

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className="text-white shadow-lg sticky top-0 z-50"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          height: 'var(--header-height)',
        }}
      >
        <div className="mx-auto px-4 h-full" style={{ maxWidth: 'var(--layout-max-width)' }}>
          <div className="flex items-center justify-between h-full">

            {/* Logo + site name */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              {showLogo && logoUrl && (
                <img
                  src={logoUrl}
                  alt={siteName}
                  width={logoWidth}
                  height={logoHeight}
                  className="object-contain"
                  style={{ maxHeight: '48px' }}
                />
              )}
              <div className={`${mobileTextClass} sm:text-xl md:text-2xl font-black tracking-tight group-hover:scale-105 transition`}>
                {siteName}
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-sm font-semibold hover:opacity-80 transition"
                >
                  {link.text}
                </Link>
              ))}
            </div>

            {/* Desktop trust indicators */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {trustIndicators.slice(0, 2).map((indicator, index) => (
                <span key={index} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {indicator}
                </span>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Drawer */}
          <div
            className="absolute top-0 right-0 h-full w-72 text-white shadow-xl flex flex-col"
            style={{ background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`, marginTop: 'var(--header-height)' }}
            onClick={e => e.stopPropagation()}
          >
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-lg font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.text}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-6 border-t border-white/20">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white/80 py-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {indicator}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
