// components/PortfolioItemCard.tsx
// Shown on portfolio_item article pages, above the body: status, price, the
// link button and the details list. Every field is optional; with none set
// the card isn't rendered. PortfolioItemCardInfo (next to this file) is the
// short version shown on article cards; both use PortfolioStatusBadge.
import { ContentTypeLabels, PortfolioItemData, PortfolioItemStatus } from '@/lib/types'

// Generic labels, the same wording as the admin preview and the API's
// schema.org block. A site can override them in site-content.json
// (contentTypeLabels.portfolio_item.status).
export const PORTFOLIO_STATUS_LABELS: Record<PortfolioItemStatus, string> = {
  available: 'Available',
  in_progress: 'In progress',
  coming_soon: 'Coming soon',
  completed: 'Completed',
  sold: 'Sold',
}

// A small coloured dot inside a theme-coloured badge, so it reads on any theme.
const STATUS_DOT: Record<PortfolioItemStatus, string> = {
  available: '#16a34a',
  in_progress: '#d97706',
  coming_soon: '#7c3aed',
  completed: '#2563eb',
  sold: '#6b7280',
}

export function portfolioStatusLabel(status: PortfolioItemStatus, labels?: ContentTypeLabels): string {
  return labels?.portfolio_item?.status?.[status]?.trim() || PORTFOLIO_STATUS_LABELS[status]
}

export function PortfolioStatusBadge({ status, labels, small = false }: {
  status: PortfolioItemStatus
  labels?: ContentTypeLabels
  small?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold ${small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      // Detail block: sits on the secondary-coloured header, so primary background.
      // Cards: sit on the primary-coloured card, so secondary (like the tag pills).
      style={{
        backgroundColor: small ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
      }}>
      <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: STATUS_DOT[status] }} />
      {portfolioStatusLabel(status, labels)}
    </span>
  )
}

interface PortfolioItemCardProps {
  item: PortfolioItemData
  labels?: ContentTypeLabels
}

export default function PortfolioItemCard({ item, labels }: PortfolioItemCardProps) {
  const { status, link, link_label, price } = item
  const details = item.details ?? []
  const hasLink = !!(link && link_label)

  if (!status && !price && !hasLink && details.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden mb-10"
      style={{ border: '1px solid var(--color-bg-secondary)', backgroundColor: 'var(--color-bg-primary)' }}>

      {/* Status, price and link */}
      {(status || price || hasLink) && (
        <div className="flex flex-wrap items-center gap-4 px-6 py-5"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          {status && <PortfolioStatusBadge status={status} labels={labels} />}
          {price && (
            <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {price}
            </span>
          )}
          {hasLink && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:ml-auto inline-block px-6 py-2 rounded-lg font-semibold transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-button-background)', color: 'var(--color-button-text)' }}
            >
              {link_label} →
            </a>
          )}
        </div>
      )}

      {/* Details */}
      {details.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-6 gap-y-2 px-6 py-5">
          {details.map((detail, i) => (
            <div key={i} className="contents">
              <dt className="text-xs font-semibold uppercase tracking-wide sm:pt-0.5"
                style={{ color: 'var(--color-text-secondary)' }}>
                {detail.label}
              </dt>
              <dd className="mb-2 sm:mb-0" style={{ color: 'var(--color-text-primary)' }}>
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
