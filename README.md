# Content Site Template

A Next.js template for rendering pre-generated content into a production-ready website.  
Designed to be deployed once and left running as the final publishing layer for content created elsewhere.

This template is intentionally generic and can be used for a wide range of content-driven sites, including product comparisons, news collections, recipe sites, finance pages, and more.

---

## What This Template Is

- A **rendering layer**, not a content generator
- A **public-facing website runtime**
- A **deploy-once template** for hosting already-generated content
- Domain-ready and Vercel-friendly

All content is assumed to be generated and structured ahead of time by an external system or workflow.

---

## What This Template Is Not

- ❌ A CMS
- ❌ An admin panel
- ❌ An AI or content generation tool
- ❌ Opinionated about monetization or niche

Those concerns intentionally live outside this repository.

---

## Features

- Next.js (App Router)
- SEO-friendly page structure
- Category and page-based routing
- Static and/or dynamic rendering support
- Easily customizable layout and styling
- Vercel one-click deployment
- Framework-agnostic content source (JSON, API, filesystem, etc.)

---

## One-Click Deploy

Deploy this template directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](
https://vercel.com/new/clone?repository-url=https://github.com/coder2074/content-site-template
)

> After deployment, connect your domain and configure your content source as needed.

---

## Content Model

This template expects content to already exist in a structured format, such as:

- Categories
- Pages within categories
- Optional ranking or ordering
- Optional metadata (SEO, images, summaries)

The exact source of this content is intentionally flexible and left to the implementer.

---

## Getting Started (Local Development)

```bash
npm install
npm run dev
