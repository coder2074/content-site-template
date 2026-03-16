// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { fetchSiteContent, fetchThemeConfig, getSiteHeaderLogoUrl } from '@/lib/s3'
import { LogoImage } from '@/components/LogoImage'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  const themeConfig = await fetchThemeConfig()
  const logoUrl = themeConfig.logo?.url || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)
  const faviconUrl = themeConfig.favicon?.url || '/favicon.ico'  // add this

  return {
    title: {
      default: siteContent.branding.siteName,
      template: `%s | ${siteContent.branding.siteName}`,
    },
    description: siteContent.metaDescription,
    keywords: siteContent.seoKeywords?.join(', ') ?? '',
    robots: 'index, follow',
    icons: {                          // add this
      icon: faviconUrl,
    },
    openGraph: {
      siteName: siteContent.branding.siteName,
      type: 'website',
      ...(logoUrl && { images: [{ url: logoUrl }] }),
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await fetchSiteContent()
  const themeConfig = await fetchThemeConfig()

  const logoUrl = themeConfig.logo?.url || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)
  const logoConfig = themeConfig.logo
  const showLogo = !!logoConfig?.url

  return (
    <html lang="en">
      <head>
        {siteContent.analytics?.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${siteContent.analytics.googleAnalyticsId}`} />
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteContent.analytics.googleAnalyticsId}');
            `
          }} />
        </>
        )}
        {siteContent.analytics?.googleSearchConsoleId && (
          <meta name="google-site-verification" content={siteContent.analytics.googleSearchConsoleId} />
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${themeConfig.colors.primary};
              --color-secondary: ${themeConfig.colors.secondary};
              --color-accent: ${themeConfig.colors.accent};
              --color-text-primary: ${themeConfig.colors.text?.primary || '#1f2937'};
              --color-text-secondary: ${themeConfig.colors.text?.secondary || '#6b7280'};
              --color-bg-primary: ${themeConfig.colors.background?.primary || '#ffffff'};
              --color-bg-secondary: ${themeConfig.colors.background?.secondary || '#f9fafb'};
              --font-family: ${themeConfig.typography.fontFamily}, system-ui, sans-serif;
              --font-heading: ${themeConfig.typography.headingFont}, system-ui, sans-serif;
              --font-body: ${themeConfig.typography.bodyFont}, system-ui, sans-serif;
              --layout-max-width: ${themeConfig.layout?.maxWidth || '1280px'};
              --layout-padding: ${themeConfig.layout?.containerPadding || '2rem'};
              --header-height: ${themeConfig.layout?.headerHeight || '80px'};
            }
            body { font-family: var(--font-body); color: var(--color-text-primary); }
            h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
          `
        }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${themeConfig.typography.fontFamily.replace(' ', '+')}:wght@400;500;600;700;800;900&display=swap`}
          rel="stylesheet"
        />
      </head>
      <body>
        <nav
          className="text-white shadow-lg sticky top-0 z-50"
          style={{
            background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
            height: 'var(--header-height)'
          }}
        >
          <div className="mx-auto px-4 h-full" style={{ maxWidth: 'var(--layout-max-width)' }}>
            <div className="flex items-center justify-between h-full">
              <Link href="/" className="flex items-center gap-3 group">
                {showLogo && logoConfig && (
                  <LogoImage
                    src={logoUrl}
                    alt={siteContent.branding.siteName}
                    width={logoConfig.width}
                    height={logoConfig.height}
                    className="object-contain"
                  />
                )}
                <div className="text-2xl md:text-3xl font-black tracking-tight group-hover:scale-105 transition">
                  {siteContent.branding.siteName}
                </div>
              </Link>
              {(siteContent.navLinks || []).map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="hidden md:block text-sm font-semibold hover:opacity-80 transition"
                  style={{ color: 'white' }}
                >
                  {link.text}
                </Link>
              ))}
              <div className="hidden md:flex items-center gap-6 text-sm">
                {siteContent.trustIndicators.slice(0, 2).map((indicator, index) => (
                  <span key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {indicator}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          {children}
        </main>

        <footer
          className="text-white py-12 mt-20"
          style={{
            backgroundColor: themeConfig.components.footer?.backgroundColor || '#111827',
            borderTop: `4px solid var(--color-primary)`
          }}
        >
          <div className="mx-auto px-4" style={{ maxWidth: 'var(--layout-max-width)' }}>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-3">{siteContent.branding.siteName}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{siteContent.footer.aboutText}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Our Promise</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  {siteContent.trustIndicators.map((indicator, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Links</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  {siteContent.footer.links.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="hover:text-white transition">{link.text}</a>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-xs leading-relaxed">
                    We may earn commissions from qualifying purchases at no extra cost to you.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
              <p>{siteContent.footer.copyright}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
