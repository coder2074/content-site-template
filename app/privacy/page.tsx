import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Garage Woodshop',
  description: 'Privacy policy for Garage Woodshop.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
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
              Garage Woodshop ("we", "us", or "our") operates garagewoodshop.com. This page explains what information
              we collect, how we use it, and your rights regarding that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Amazon Associates Disclosure</h2>
            <p>
              Garage Woodshop is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
              program designed to provide a means for sites to earn advertising fees by advertising and linking to
              Amazon.com. When you click an Amazon link on our site and make a purchase, we may earn a small commission
              at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Information We Collect</h2>
            <p>We do not collect personal information directly. However, third-party services we use may collect data:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><strong>Analytics:</strong> We use analytics tools to understand how visitors use our site. This may include pages visited, time on site, and general location (country/region). No personally identifiable information is collected.</li>
              <li><strong>Cookies:</strong> Our site and third-party services (including Amazon) may use cookies to track referrals and improve your experience. You can disable cookies in your browser settings.</li>
              <li><strong>Amazon:</strong> When you click an affiliate link, Amazon may set cookies on your browser to track purchases. Amazon's privacy policy governs their data collection.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>How We Use Information</h2>
            <p>Any data collected through analytics is used solely to:</p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Understand which content is most useful to our readers</li>
              <li>Improve site performance and user experience</li>
              <li>Track affiliate referrals for commission purposes</li>
            </ul>
            <p className="mt-3">We do not sell, trade, or share your data with third parties beyond what is necessary to operate this site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Third-Party Links</h2>
            <p>
              Our site contains links to external websites including Amazon. We are not responsible for the privacy
              practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
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
              We may update this policy from time to time. Changes will be posted on this page with an updated date.
              Continued use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Contact</h2>
            <p>
              If you have questions about this privacy policy, please{' '}
              <Link href="/contact" style={{ color: 'var(--color-primary)' }} className="underline">contact us</Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
