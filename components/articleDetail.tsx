// components/articleDetail.tsx
// Article type → detail block on the article page (app/blog/[slug]/page.tsx).
// Each entry says where its block goes relative to the body and renders it
// from its own content_type_data block. The page renders whatever entry the
// article's type has; it never checks types itself.
import { ComponentType } from 'react'
import { ArticleContent, ArticleContentType, ArticleMeta, ContentTypeLabels } from '@/lib/types'
import RecipeCard from '@/components/RecipeCard'
import PortfolioItemCard from '@/components/PortfolioItemCard'

export interface ArticleDetailProps {
  content: ArticleContent
  article: ArticleMeta
  labels?: ContentTypeLabels
}

export interface ArticleDetailEntry {
  position: 'above-body' | 'below-body'
  Component: ComponentType<ArticleDetailProps>
}

export const ARTICLE_DETAIL: Partial<Record<ArticleContentType, ArticleDetailEntry>> = {
  recipe: {
    position: 'below-body',
    Component: function RecipeDetail({ content, article }) {
      const recipe = content.content_type_data?.recipe
      return recipe ? <RecipeCard recipe={recipe} title={article.article_title} /> : null
    },
  },
  portfolio_item: {
    position: 'above-body',
    Component: function PortfolioItemDetail({ content, labels }) {
      const item = content.content_type_data?.portfolio_item
      return item ? <PortfolioItemCard item={item} labels={labels} /> : null
    },
  },
}
