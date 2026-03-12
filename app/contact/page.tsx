import { fetchSiteContent } from '@/lib/s3'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await fetchSiteContent()
  return {
    title: `Contact | ${siteContent.branding.siteName}`,
    description: `Get in touch with ${siteContent.branding.siteName}.`,
    alternates: { canonical: '/contact' },
  }
}

export default async function ContactPage() {
  const siteContent = await fetchSiteContent()

  return (
    <div className="mx-auto px-4 py-16" style={{ maxWidth: 'var(--layout-max-width)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          Contact Us
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Have a question or suggestion? We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>General Inquiries</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Questions about our content or site?
            </p>
            <a
              href={`mailto:${siteContent.contactEmail}`}
              className="inline-flex items-center gap-2 font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              <span>✉</span>
              {siteContent.contactEmail}
            </a>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Response Time</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              We typically respond within 2–3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}