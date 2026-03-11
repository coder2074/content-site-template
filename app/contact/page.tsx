import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Garage Woodshop',
  description: 'Get in touch with the Garage Woodshop team.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="mx-auto px-4 py-16" style={{ maxWidth: 'var(--layout-max-width)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          Contact Us
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Have a question, suggestion, or just want to talk woodworking? We'd love to hear from you.
        </p>

        <div className="space-y-6">

          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>General Inquiries</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Questions about our reviews, content, or site?
            </p>
            <a
              href="mailto:admin@garagewoodshop.com"
              className="inline-flex items-center gap-2 font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              <span>✉</span>
              hello@garagewoodshop.com
            </a>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Affiliate & Partnership Inquiries</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Interested in working with us or have a product you'd like us to review?
            </p>
            <a
              href="mailto:partnerships@garagewoodshop.com"
              className="inline-flex items-center gap-2 font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              <span>✉</span>
              partnerships@garagewoodshop.com
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
