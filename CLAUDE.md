# content-site-template

The Next.js site template for a multi-tenant AI site generator platform. Every customer site is a separate Vercel deploy of this same template, reading its own content from S3. Solo project; owner is the only developer.

**Full project context, decisions and history live in the `CLAUDE.md` of site-generator-api.** If that repo is attached to this session, read it first.

## How to work with me

- **You are running remotely (Claude Code on the web)** on a clone of this GitHub repo. You have no access to my PC, my `.env.local`, S3, or Vercel.
- **Test what you can in your sandbox:** linting, type checks, and `npm run build` (static mode). Don't try to reach real services (S3, Clerk, Vercel) or build workarounds for them; I do integration testing locally. When you hand me a change, say what you tested and what I should check in the browser.
- **Never commit secrets** (Clerk keys, AWS keys, `.env.local`). If you find any already in the code, flag them to me.
- **Explain the plan before changing anything.** For anything beyond a small fix, describe what you'll change and in which files, and wait for my OK.
- Put changes on a branch with clear commit messages; never push to `main`. Tell me what to run or check locally to verify.
- Prefer explicit, extensible design, but don't over-engineer. No backward-compatibility shims.
- When showing code in chat rather than editing, give complete files, not fragments.
- **Never run `npm audit fix --force`** (it can jump Next.js a major version). Don't upgrade Next.js or other major dependencies without asking.

## Recording decisions

Sessions don't remember each other. When we decide something or finish a feature, update this file in the same branch (and the API repo's `CLAUDE.md` too if it's attached and the decision is platform-wide).

## The platform

| Repo | Role |
|---|---|
| site-generator-api | FastAPI backend: generates content with AI, stores it in S3, publishes to Vercel |
| site-generator-admin | Next.js admin that drives the API |
| content-site-template (this one) | Renders each site from its S3 files |

GitHub: `coder2074/site-generator-api`, `coder2074/site-generator-admin`, `coder2074/content-site-template`.

Features usually span all three. When another repo is attached, plan across them; otherwise note what the other repos need under "Open items".

## Tech and local dev

- Next.js 16.1.1, Node 20, static export by default. Local dev runs in WSL Ubuntu on port 3001 (pinned).
- Live sites using this template: smarthomewarrior.com and garagewoodshop.com (static), ruvianorecipes.com (server-rendered, Clerk login, author alias "Nonna's Kitchen").

## Build mode: `NEXT_PUBLIC_SERVER_RENDERED`

- Not set or false: static site (`output: 'export'`), Clerk swapped for do-nothing stubs via Turbopack `resolveAlias`. The default for local dev.
- `true`: server-rendered with Clerk login; `proxy.ts` reads `access-control.json` from S3 to decide which pages need login.
- Deployed sites: the API sets this (plus Clerk keys) on Vercel at publish when access control is on, via `VercelService.build_env_vars()`.
- `next.config.mjs` must test `=== 'true'`.
- Locally only dev Clerk keys (`pk_test_` / `sk_test_`) work; live keys fail on localhost with "Failed to load Clerk JS".
- After changing `.env.local`: stop the server, `rm -rf .next`, `npm run dev`.

## Content model

- No "site type". The template reads four S3 files per site: `site-config.json` (categories, pages and the article list, `ArticleMeta[]`), `site-content.json` (text and labels), `theme-config.json` (design, plus structure and visibility of home page sections), `access-control.json` (login; server-rendered mode only).
- **Settings rule:** structure and visibility settings go in `theme-config.json`; text and labels go in `site-content.json`.
- **Article type rule:** every article type is a base article plus an optional structured block. Outside a type's own detail and card-info components, code never branches on `article_content_type`; it looks the type up in a map: `components/articleDetail.tsx` (detail block + position above/below the body, used by `app/blog/[slug]/page.tsx`) and `components/articleCardInfo.ts` (card info, used by `ArticleCard`).
- **Pages:** Category → Page with cards. Each card's content type picks its layout: `physical_product`, `service_offer`, `place`, `person`, `list_item`.
- **Articles:** each has an `article_content_type`: `how_to`, `beginner_guide`, `buyers_guide`, `diy_project`, `product_review`, `recipe`, `portfolio_item`.
- Structured article types carry their data in `content_type_data.<type>` (e.g. `content_type_data.recipe`, rendered by `RecipeCard` below the body; `content_type_data.portfolio_item`, rendered by `PortfolioItemCard` above the body) plus a `schema` JSON-LD block for Google. The body is in `body_markdown`.
- **Card info:** the API writes an optional `card_info.<type>` on each article's `site-config.json` entry (e.g. `card_info.portfolio_item`: status, link, link_label, price). `ArticleCard` renders the type's card-info component from `ARTICLE_CARD_INFO` (e.g. `PortfolioItemCardInfo`, next to `PortfolioItemCard`). Missing `card_info` = nothing shown.
- **One card:** `ArticleCard` is used everywhere: `grid` (home featured section, `/blog`, tag pages) and `compact` (related articles, via `RelatedContent`; a copy of the old row look). The title is a stretched link (`after:absolute after:inset-0`) so the whole card opens the article, and card-info links sit above it with `relative z-10` (a card can't be one big `<a>`).
- **Featured section:** `components.featuredArticles` in `theme-config.json`; `lib/featuredArticles.ts` resolves defaults (`DEFAULT_FEATURED_ARTICLES` = the original section: featured articles by `featured_order`, 3, 3 columns, 1.5rem gap), filters by type, picks `featured` or `newest`, and maps columns (1–4) to fixed Tailwind classes. Always 1 column on phones; a last row that isn't full stays left-aligned. Heading / "View all" text come from `site-content.json`.
- **Per-site labels:** `contentTypeLabels.<type>` in `site-content.json` (e.g. `portfolio_item.status.available = "Live"`), passed down as `contentTypeLabels` to `ArticleCard`, `RelatedContent` and the detail block; `portfolioStatusLabel()` falls back to `PORTFOLIO_STATUS_LABELS`.
- **Blog title:** `blogSection.title` in `site-content.json` names the article list everywhere: `/blog`, the article page's breadcrumb and "← All …" button, and tag pages (title, headline, button). One helper, `lib/blogSection.ts` (`blogTitle()`, fallback "Guides & Articles"; `customBlogTitle()` when a page keeps its own fallback, e.g. the tag headline "{tag} Guides").
- **Empty trust indicators:** new sites get `trustIndicators: []` (API defaults since Nov 20). Then the home trust badges row (unless the site has item stats), the footer's "Our Promise" column and the mobile menu's list are hidden. `components.trustBadges.enabled: false` hides the row regardless (admin: Theme Settings → Trust Badges).

## SEO conventions

- Canonical URLs are absolute, with trailing slashes (fixed across smarthomewarrior in Apr 2026; keep it that way in new pages).
- Keep the sitemap in sync with real pages.

## Current focus: company landing page (template side)

Building balancedsoftwaredevelopment.com on the platform as a reusable feature. Design decided Nov 18; see "Current focus" in the API repo's `CLAUDE.md` for the fields, build approach and phases. Template work:
- ~~**Phase 2:**~~ Done Nov 18: a detail-page component for the new **`portfolio_item`** article type, following `RecipeCard`: status badge (`available` / `in_progress` / `coming_soon` / `completed` / `sold`), a link button using `link_label`, the `details` label/value list, and `price`. All fields optional. AI hero image for now. Add `PortfolioItemData` to `lib/types.ts` and a check next to `isRecipe` in `app/blog/[slug]/page.tsx`.
- ~~**Phase 3:**~~ Done Nov 19: card info on `ArticleCard` from `card_info` in the `site-config.json` article list, one card everywhere, a configurable featured section (`components.featuredArticles`), per-site status labels. Decided: **no layout switch and no new page types**; a landing page is the normal home page with sections turned off and the featured section filtered to `portfolio_item`. Existing sites look exactly the same unless they change the new settings (checked pixel-for-pixel against `main` with ruvianorecipes' files). Later: an email signup form that posts to the API.
- **Phase 4:** uploaded photo as hero (all article types), then a gallery component (`gallery`: media references with caption and alt text).

## Manual tests to run

The full list (all phases, API + admin + template) is in the API repo's `CLAUDE.md`. `npm run build` in the sandbox compiles and type-checks but stops at "Collecting page data" without the S3 content URL; a session can do a full static build by serving fixture JSON files locally and setting `CONTENT_BASE_URL` to that server (done for phase 3). Run the real build locally. Template-specific checks:
- [ ] Phase 2: a `portfolio_item` article page shows `PortfolioItemCard` above the body: status badge (dot + label), price, the button with `link_label` opening `link` in a new tab, the details list (stacked on mobile, two columns from `sm`). An item with no fields shows no card. Check a light and a dark theme.
- [ ] Phase 2: JSON-LD on the page is `CreativeWork` with the trailing-slash `url`.
- [ ] Phase 2: a recipe page shows the category badge next to cuisine and difficulty.
- [ ] Phase 3: with no new settings, the home page, `/blog`, a tag page and an article page with related articles look as before; clicking anywhere on a card opens the article; hover still lifts the card.
- [ ] Phase 3: with `featuredArticles` set (e.g. newest, `portfolio_item`, 4 items, 2 columns, no "View all"), the home page shows those cards with status badge, price and a "Visit site →" button (new tab; the rest of the card opens the article); 1 column on a phone. `enabled: false` hides the section.
- [ ] Phase 3: `contentTypeLabels.portfolio_item.status.available = "Live"` shows "Live" on cards, related articles and the article page. Check a light and a dark theme (the small badge uses the secondary background).
- [ ] Phase 3: also build in server-rendered mode (`NEXT_PUBLIC_SERVER_RENDERED=true`, ruvianorecipes) and check the same pages.
- [ ] Pre-launch cleanup (Nov 20): with no `blogSection.title`, an article page and tag page look as before. With `blogSection.title = "Projects"`: breadcrumb "Home > Projects > …", "← All Projects" on article and tag pages, tag title "Software Projects". Turn `components.trustBadges.enabled` off: the row under the hero is gone. A new site (empty `trustIndicators`): no "Our Promise" footer column, no trust row, no empty box at the bottom of the mobile menu.

## Open items

- [ ] Add a `.nvmrc` containing `20`.
- [ ] Add a comment block to `.env.local.example` (or README) covering build mode, dev Clerk keys, and the restart steps above.
- [ ] Review `npm audit` critical items (report them; don't auto-fix).
- [x] Phase 2: `portfolio_item` detail component (`PortfolioItemCard`, Nov 18).
- [x] Recipe types: `category`, `difficulty: 'Easy' | 'Medium' | 'Hard'`; `RecipeCard` shows category (Nov 18).
- [x] Per-site status label overrides (`contentTypeLabels` in `site-content.json`) (Nov 19).
- [x] Pre-existing lint errors in `lib/types.ts` (`any`) and `RecipeCard.tsx` (unused `title`) (Nov 20).
- [ ] Remaining lint errors (pre-existing, 16): `react/no-unescaped-entities` in `app/privacy`, `app/terms`, `app/contact`, `app/[category]`, `BuyerGuide.tsx`; `no-explicit-any` in `LocationMap.tsx`, `lib/s3.ts`, `proxy.ts`; `react-hooks/set-state-in-effect` in `Nav.tsx` (closing the menu on route change).
- [x] Phase 3: card info, one `ArticleCard`, configurable featured section (Nov 19).
- [x] The article page's breadcrumb and back button (and tag pages) use `blogSection.title` (Nov 20).
- [ ] With no `blogSection.title`, the tag headline still says "{tag} Guides" and the related-pages heading "Related Guides" (kept so existing sites don't change).
- [ ] Phase 4: uploaded hero image, then gallery.

## History

- **Nov 18:** phase 2: `PortfolioItemCard` for `portfolio_item` (above the body), types in `lib/types.ts`, recipe `category` + difficulty type, category badge in `RecipeCard`.
- **Nov 19:** phase 3: `card_info` types and `PortfolioItemCardInfo`; type → component maps (`articleCardInfo.ts`, `articleDetail.tsx`; the article page no longer checks types); one `ArticleCard` with `grid` / `compact` variants and a stretched title link, used by `RelatedContent` too; `components.featuredArticles` + `lib/featuredArticles.ts`; `contentTypeLabels` passed through the pages (category pages via `BasePage` and its extensions). Fixed the docs: the article list is in `site-config.json`.
- **Nov 20:** pre-launch cleanup: `lib/blogSection.ts`; the article page's breadcrumb and back button and tag pages use `blogSection.title` ("Guides & Articles" fallback); empty `trustIndicators` hide the footer column, trust row and mobile-menu list; fixed the `any` in `lib/types.ts` and `RecipeCard`'s unused `title`. Checked with fixture builds: an existing-style site's static output is identical to `main` apart from build ids.
