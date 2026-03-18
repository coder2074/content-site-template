// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { fetchSiteContent, fetchThemeConfig, getSiteHeaderLogoUrl } from '@/lib/s3'
import Nav from '@/components/Nav'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  const themeConfig = await fetchThemeConfig()
  const logoUrl = themeConfig.logo?.url || getSiteHeaderLogoUrl(process.env.NEXT_PUBLIC_SITE_ID)

  return {
    title: {
      default: siteContent.branding.siteName,
      template: `%s | ${siteContent.branding.siteName}`,
    },
    description: siteContent.metaDescription,
    keywords: siteContent.seoKeywords?.join(', ') ?? '',
    robots: 'index, follow',
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
        <Nav
          siteName={siteContent.branding.siteName}
          navLinks={siteContent.navLinks || []}
          trustIndicators={siteContent.trustIndicators}
          logoUrl={logoUrl}
          logoWidth={logoConfig?.width}
          logoHeight={logoConfig?.height}
          showLogo={showLogo}
          gradientFrom={themeConfig.colors.primary}
          gradientTo={themeConfig.colors.secondary}
        />

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
