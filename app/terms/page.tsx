import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Garage Woodshop',
  description: 'Terms of service for Garage Woodshop.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
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
              By accessing and using garagewoodshop.com, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Use of Content</h2>
            <p>
              All content on Garage Woodshop — including text, images, and guides — is for informational purposes only.
              You may read and share our content for personal, non-commercial use with attribution. You may not reproduce,
              republish, or redistribute our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Affiliate Disclaimer</h2>
            <p>
              Garage Woodshop participates in the Amazon Services LLC Associates Program and other affiliate programs.
              Product recommendations may include affiliate links. We earn a commission on qualifying purchases at no
              extra cost to you. Our editorial opinions are independent and not influenced by affiliate relationships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Accuracy of Information</h2>
            <p>
              We strive to provide accurate and up-to-date product information, pricing, and recommendations. However,
              product availability, prices, and specifications change frequently. Always verify current pricing and
              details on Amazon or the retailer's site before purchasing. We are not responsible for inaccuracies
              in third-party product listings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Safety Disclaimer</h2>
            <p>
              Woodworking involves tools and machinery that can be dangerous. Content on this site is for informational
              purposes only and is not a substitute for professional training. Always follow manufacturer safety
              guidelines, use appropriate protective equipment, and exercise caution when using power tools. Garage
              Woodshop is not liable for any injuries or damages arising from the use of tools or techniques
              described on this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Limitation of Liability</h2>
            <p>
              Garage Woodshop is provided "as is" without warranties of any kind. We are not liable for any direct,
              indirect, incidental, or consequential damages arising from your use of this site or any products
              purchased through affiliate links.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>External Links</h2>
            <p>
              This site contains links to third-party websites. We are not responsible for the content, accuracy,
              or practices of those sites. Links do not constitute endorsement beyond our affiliate relationship.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Changes will be posted on this page.
              Continued use of the site after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Contact</h2>
            <p>
              Questions about these terms? Please{' '}
              <Link href="/contact" style={{ color: 'var(--color-primary)' }} className="underline">contact us</Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
