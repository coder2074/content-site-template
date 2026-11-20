// The blog listing's name ("Guides & Articles" unless the site sets
// blogSection.title in site-content.json). Used by /blog, the article page's
// breadcrumb and back button, and tag pages, so they all say the same thing.
import type { SiteContent } from './types'

export const DEFAULT_BLOG_TITLE = 'Guides & Articles'

/** The site's own blogSection.title, or undefined when it hasn't set one. */
export function customBlogTitle(siteContent: SiteContent): string | undefined {
  return siteContent.blogSection?.title?.trim() || undefined
}

/** The site's blogSection.title, falling back to "Guides & Articles". */
export function blogTitle(siteContent: SiteContent): string {
  return customBlogTitle(siteContent) ?? DEFAULT_BLOG_TITLE
}
