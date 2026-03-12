import { Metadata } from 'next'
import Link from 'next/link'
import { fetchSiteContent } from '@/lib/s3'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  return {
    title: `Privacy Policy | ${siteContent.branding.siteName}`,
    description: `Privacy policy for ${siteContent.branding.siteName}.`,
    alternates: { canonical: '/privacy' },
  }
}

export default async function PrivacyPage() {
  const siteContent = await fetchSiteContent()
  const { siteName } = siteContent.branding

  return (
    <div className="mx-auto px-4 py-16" style={{ maxWidth: 'var(--layout-max-width)' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-secondary)' }}>Last updated: March 2026</p>

        <div className="prose prose-lg max-w-none space-y-8" style={{ color: 'var(--color-text-secondary)' }}>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Overview</h2>
            <p>
              {siteName} ("we", "us", or "our") operates this website. This page explains what information we collect, how we use it, and your rights regarding that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Information We Collect</h2>
            <p>
              We do not collect personal information directly. Third-party services we use (such as analytics tools) may collect anonymized data including pages visited, time on site, and general location. No personally identifiable information is collected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Cookies</h2>
            <p>
              This site and third-party services may use cookies to improve your experience. You can disable cookies in your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Third-Party Links</h2>
            <p>
              This site may contain links to external websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Children's Privacy</h2>
            <p>
              This site is not directed at children under 13. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page. Continued use of the site constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Contact</h2>
            <p>
              If you have questions about this privacy policy, please{' '}
              <Link href="/contact" style={{ color: 'var(--color-primary)' }} className="underline">contact us</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}