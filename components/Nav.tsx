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
  logoType?: 'icon' | 'wordmark'
  showSiteName?: boolean
  showLogo?: boolean
  gradientFrom: string
  gradientTo: string
}

export default function Nav({
  siteName,
  navLinks,
  trustIndicators,
  logoUrl,
  logoType = 'icon',
  showSiteName = true,
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

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className="text-white shadow-lg sticky top-0 z-50 w-full"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          height: 'var(--header-height)',
        }}
      >
        <div className="flex items-center h-full w-full px-4 gap-4">

          {/* Logo + site name — hard left */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            {showLogo && logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={siteName}
                className="object-contain flex-shrink-0"
                style={
                  logoType === 'wordmark'
                    ? { height: '40px', width: 'auto' }
                    : { height: '40px', width: '40px', objectFit: 'contain' }
                }
              />
            )}
            {showSiteName && (
              <span className={`${mobileTextClass} md:text-2xl font-black tracking-tight group-hover:opacity-80 transition`}>
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop nav links — center */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
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

          {/* Right side — trust indicators + hamburger */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-6 text-sm">
              {trustIndicators.slice(0, 2).map((indicator, index) => (
                <span key={index} className="flex items-center gap-1.5 whitespace-nowrap">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {indicator}
                </span>
              ))}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/10 transition flex-shrink-0"
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
          <div className="absolute inset-0 bg-black/50" />

          <div
            className="absolute top-0 right-0 h-full w-72 text-white shadow-xl flex flex-col"
            style={{
              background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
              marginTop: 'var(--header-height)',
            }}
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
