// components/PortfolioItemCardInfo.tsx
// Card info for portfolio_item articles: the status badge, price and link
// button shown on ArticleCard (home page featured section, listing pages,
// related articles). Reads card_info.portfolio_item, which the API writes on
// the article's site-config.json entry (PortfolioItemData.card_summary()).
// Renders nothing when the block is missing (e.g. articles saved before it
// existed) or empty.
import type { ArticleCardInfoProps } from '@/components/articleCardInfo'
import { PortfolioStatusBadge } from '@/components/PortfolioItemCard'

export default function PortfolioItemCardInfo({ article, labels, compact = false }: ArticleCardInfoProps) {
  const info = article.card_info?.portfolio_item
  if (!info) return null
  const { status, price, link, link_label } = info
  const hasLink = !!(link && link_label)
  if (!status && !price && !hasLink) return null

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? 'mt-2' : 'mb-4'}`}>
      {status && <PortfolioStatusBadge status={status} labels={labels} small />}
      {price && (
        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {price}
        </span>
      )}
      {hasLink && (
        // relative z-10 lifts the button above ArticleCard's stretched title
        // link, so it opens the item's link instead of the article.
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-block px-3 py-1 rounded-md text-xs font-semibold transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-button-background)', color: 'var(--color-button-text)' }}
        >
          {link_label} →
        </a>
      )}
    </div>
  )
}
