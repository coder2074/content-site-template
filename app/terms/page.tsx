import { Metadata } from 'next'
import Link from 'next/link'
import { fetchSiteContent } from '@/lib/s3'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  return {
    title: `Terms of Service | ${siteContent.branding.siteName}`,
    description: `Terms of service for ${siteContent.branding.siteName}.`,
    alternates: { canonical: '/terms' },
  }
}

export default async function TermsPage() {
  const siteContent = await fetchSiteContent()
  const { siteName } = siteContent.branding

  return (
    <div className="mx-auto px-4 py-16" style={{ maxWidth: 'var(--layout-max-width)' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-secondary)' }}>Last updated: March 2026</p>

        <div className="prose prose-lg max-w-none space-y-8" style={{ color: 'var(--color-text-secondary)' }}>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Acceptance of Terms</h2>
            <p>
              By accessing and using this site, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Use of Content</h2>
            <p>
              All content on {siteName} is for informational purposes only. You may read and share our content for personal, non-commercial use with attribution. You may not reproduce, republish, or redistribute our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Limitation of Liability</h2>
            <p>
              {siteName} is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>External Links</h2>
            <p>
              This site may contain links to third-party websites. We are not responsible for the content or practices of those sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Changes will be posted on this page. Continued use of the site after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Contact</h2>
            <p>
              Questions about these terms? Please{' '}
              <Link href="/contact" style={{ color: 'var(--color-primary)' }} className="underline">contact us</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}