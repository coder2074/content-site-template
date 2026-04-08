// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { fetchSiteContent, fetchThemeConfig, getSiteHeaderLogoUrl } from '@/lib/s3'
import Nav from '@/components/Nav'
import AuthProvider from '@/components/AuthProvider'
import AccessControlGate from '@/components/AccessControlGate'
import { headers } from 'next/headers'

const isServerRendered = process.env.NEXT_PUBLIC_SERVER_RENDERED === 'true'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  const themeConfig = await fetchThemeConfig()
  const logoUrl = themeConfig.logo?.url || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)
  const faviconUrl = themeConfig.favicon?.url

  return {
    title: {
      default: siteContent.branding.siteName,
      template: `%s | ${siteContent.branding.siteName}`,
    },
    description: siteContent.metaDescription,
    keywords: siteContent.seoKeywords?.join(', ') ?? '',
    robots: 'index, follow',
    ...(faviconUrl && { icons: { icon: faviconUrl } }),
    openGraph: {
      siteName: siteContent.branding.siteName,
      type: 'website',
      ...(logoUrl && { images: [{ url: logoUrl }] }),
    },
  }
}

  const [siteContent, themeConfig] = await Promise.all([
    fetchSiteContent(),
    fetchThemeConfig(),
  ])

  // Get pathname for access control — only available in server-rendered mode
  let pathname = '/'
  if (isServerRendered) {
    const headersList = await headers()
    pathname = headersList.get('x-pathname') || '/'
  }

  const logoConfig = themeConfig.logo
  const logoUrl = logoConfig?.url || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)
  const showLogo = !!logoConfig?.url
  const logoType = logoConfig?.logo_type || 'icon'
  const showSiteName = logoConfig?.show_site_name !== false

  const colors = themeConfig.colors || {}

  const primary = colors.primary || '#3b82f6'
  const secondary = colors.secondary || '#8b5cf6'
  const accent = colors.accent || '#f59e0b'

  const navBackground = colors.navBackground || primary
  const navGradientTo = colors.navGradientTo || secondary
  const navText = colors.navText || '#ffffff'
  const buttonBackground = colors.buttonBackground || primary
  const buttonText = colors.buttonText || '#ffffff'
  const linkColor = colors.linkColor || accent
  const badgeColor = colors.badgeColor || accent
  const tagColor = colors.tagColor || accent
  const checkmarkColor = colors.checkmarkColor || accent
  const footerBorderTop = colors.footerBorderTop || primary

  const promiseTitle = siteContent.footer?.promise_title || 'Our Promise'
  const footerNote = siteContent.footer?.footer_note || null

  // Wrap children with AccessControlGate in server-rendered mode
  const protectedChildren = isServerRendered ? (
    <AccessControlGate pathname={pathname}>
      {children}
    </AccessControlGate>
  ) : children

  return (
    <AuthProvider>
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
                --color-primary: ${primary};
                --color-secondary: ${secondary};
                --color-accent: ${accent};
                --color-nav-background: ${navBackground};
                --color-nav-gradient-to: ${navGradientTo};
                --color-nav-text: ${navText};
                --color-button-background: ${buttonBackground};
                --color-button-text: ${buttonText};
                --color-link: ${linkColor};
                --color-badge: ${badgeColor};
                --color-tag: ${tagColor};
                --color-checkmark: ${checkmarkColor};
                --color-footer-border: ${footerBorderTop};
                --color-text-primary: ${colors.text?.primary || '#1f2937'};
                --color-text-secondary: ${colors.text?.secondary || '#6b7280'};
                --color-bg-primary: ${colors.background?.primary || '#ffffff'};
                --color-bg-secondary: ${colors.background?.secondary || '#f9fafb'};
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
          <Nav
            siteName={siteContent.branding.siteName}
            navLinks={siteContent.navLinks || []}
            trustIndicators={siteContent.trustIndicators}
            logoUrl={logoUrl}
            showLogo={showLogo}
            logoType={logoType}
            showSiteName={showSiteName}
            gradientFrom={navBackground}
            gradientTo={navGradientTo}
          />

          <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            {protectedChildren}
          </main>

          <footer
            className="text-white py-12 mt-8"
            style={{
              backgroundColor: themeConfig.components.footer?.backgroundColor || '#111827',
              borderTop: `4px solid var(--color-footer-border)`
            }}
          >
            <div className="mx-auto px-4" style={{ maxWidth: 'var(--layout-max-width)' }}>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">{siteContent.branding.siteName}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{siteContent.footer.aboutText}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{promiseTitle}</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    {siteContent.trustIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                          style={{ color: 'var(--color-checkmark)' }}>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                  {footerNote && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-xs leading-relaxed">{footerNote}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
                <p>{siteContent.footer.copyright}</p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </AuthProvider>
  )
}
