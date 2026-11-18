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

- No "site type". The template reads three S3 files per site: `site-content.json`, `theme-config.json`, `access-control.json`.
- **Pages:** Category → Page with cards. Each card's content type picks its layout: `physical_product`, `service_offer`, `place`, `person`, `list_item`.
- **Articles:** each has an `article_content_type`: `how_to`, `beginner_guide`, `buyers_guide`, `diy_project`, `product_review`, `recipe`, `portfolio_item`.
- Structured article types carry their data in `content_type_data.<type>` (e.g. `content_type_data.recipe`, rendered by `RecipeCard` below the body; `content_type_data.portfolio_item`, rendered by `PortfolioItemCard` above the body) plus a `schema` JSON-LD block for Google. The body is in `body_markdown`.

## SEO conventions

- Canonical URLs are absolute, with trailing slashes (fixed across smarthomewarrior in Apr 2026; keep it that way in new pages).
- Keep the sitemap in sync with real pages.

## Current focus: company landing page (template side)

Building balancedsoftwaredevelopment.com on the platform as a reusable feature. Design decided Nov 18; see "Current focus" in the API repo's `CLAUDE.md` for the fields, build approach and phases. Template work:
- ~~**Phase 2:**~~ Done Nov 18: a detail-page component for the new **`portfolio_item`** article type, following `RecipeCard`: status badge (`available` / `in_progress` / `coming_soon` / `completed` / `sold`), a link button using `link_label`, the `details` label/value list, and `price`. All fields optional. AI hero image for now. Add `PortfolioItemData` to `lib/types.ts` and a check next to `isRecipe` in `app/blog/[slug]/page.tsx`.
- **Phase 3:** a **landing layout** chosen in `theme-config.json` (`content-site` vs `landing`): hero, a portfolio grid, About section, later an email signup form that posts to the API. The grid reads a short summary the API writes into the article list in `site-content.json` (`ArticleMeta`); don't load every article. Today `app/page.tsx` has one fixed layout and `theme-config.json` only toggles sections.
- **Phase 4:** uploaded photo as hero (all article types), then a gallery component (`gallery`: media references with caption and alt text).

## Manual tests to run

The full list (all phases, API + admin + template) is in the API repo's `CLAUDE.md`. `npm run build` in the sandbox compiles and type-checks but stops at "Collecting page data" because it needs the S3 content URL; run the full build locally. Template-specific checks:
- [ ] Phase 2: a `portfolio_item` article page shows `PortfolioItemCard` above the body: status badge (dot + label), price, the button with `link_label` opening `link` in a new tab, the details list (stacked on mobile, two columns from `sm`). An item with no fields shows no card. Check a light and a dark theme.
- [ ] Phase 2: JSON-LD on the page is `CreativeWork` with the trailing-slash `url`.
- [ ] Phase 2: a recipe page shows the category badge next to cuisine and difficulty.

## Open items

- [ ] Add a `.nvmrc` containing `20`.
- [ ] Add a comment block to `.env.local.example` (or README) covering build mode, dev Clerk keys, and the restart steps above.
- [ ] Review `npm audit` critical items (report them; don't auto-fix).
- [x] Phase 2: `portfolio_item` detail component (`PortfolioItemCard`, Nov 18).
- [x] Recipe types: `category`, `difficulty: 'Easy' | 'Medium' | 'Hard'`; `RecipeCard` shows category (Nov 18).
- [ ] **Before phase 3 ships the owner's landing page:** per-site status label overrides (e.g. show `available` as "Live" on a software site), probably via `theme-config.json`. Today `PORTFOLIO_STATUS_LABELS` in `PortfolioItemCard.tsx` is fixed. Not built yet.
- [ ] Pre-existing lint errors: `lib/types.ts` (`any` in a helper near the end) and an unused `title` prop in `RecipeCard.tsx`.
- [ ] Phase 3: landing layout + portfolio grid.
- [ ] Phase 4: uploaded hero image, then gallery.

## History

- **Nov 18:** phase 2: `PortfolioItemCard` for `portfolio_item` (above the body), types in `lib/types.ts`, recipe `category` + difficulty type, category badge in `RecipeCard`.
