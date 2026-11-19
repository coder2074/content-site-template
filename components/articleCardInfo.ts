// components/articleCardInfo.ts
// Article type → card-info component. ArticleCard renders the entry for the
// article's type (if any) between the excerpt and the footer; it never checks
// types itself. Each card-info component lives next to its type's detail
// component and reads its own block from article.card_info.
import { ComponentType } from 'react'
import { ArticleContentType, ArticleMeta, ContentTypeLabels } from '@/lib/types'
import PortfolioItemCardInfo from '@/components/PortfolioItemCardInfo'

export interface ArticleCardInfoProps {
  article: ArticleMeta
  labels?: ContentTypeLabels
  compact?: boolean
}

export const ARTICLE_CARD_INFO: Partial<Record<ArticleContentType, ComponentType<ArticleCardInfoProps>>> = {
  portfolio_item: PortfolioItemCardInfo,
}
