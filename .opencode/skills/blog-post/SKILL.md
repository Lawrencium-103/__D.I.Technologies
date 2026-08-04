---
name: blog-post
description: Write a DIT technical blog post that follows the project's Blog Standard (docs/blog-standard.md) and the standard-blog-post.md template, then register it in src/data/blogPosts.js. Use when the user asks to write, draft, or publish a blog post, or invokes /blog-post.
---

# Blog Post (DIT standard)

Use this skill whenever the user wants a new blog post for the DIT site, or invokes it directly (for example `/blog-post`).

## Always do first
1. Read `docs/blog-standard.md` — the rules: no banned hype words, no em dashes (—) in body,
   sentence-case headings, source tiers (P1/P2/P3), independence / global framing, and the
   required TL;DR + at least one image + author byline + Listen button.
2. Read `content/blog/standard-blog-post.md` — the markdown template that maps 1:1 to the block
   types in `src/components/BlogContent.jsx`.

## Draft the post
- Choose a unique kebab-case `slug` (used in the URL).
- Write the post as markdown in `content/blog/YYYY-MM-DD-slug.md` following the template exactly:
  - Frontmatter: title, slug, date, author, category, readingTime, template, cover, coverAlt, excerpt.
  - `> TL;DR` block with 3-4 short points (required).
  - Lead paragraph that states why the reader should care (required).
  - `##` sentence-case headings only. No em dashes anywhere in the body.
  - At least one image (`![alt](url)`); the cover counts.
  - Quotes, `-` lists, callouts (`> [callout: Title] body`), and inline source tiers (P1)/(P2)/(P3).
  - 1,400-2,500 words when the topic needs depth.
  - Close by asking permission or pointing to a next step; no forced optimistic closer.
- Author byline is "Lawrence Oladeji" (photo already wired in BlogPost.jsx).
- Cover image: use a placeholder only if the user has not supplied one. Flag placeholder covers for
  a later swap to real AI-themed images (the owner's stated preference).

## Register it in the site
No manual registration needed. `scripts/build-posts.mjs` compiles every
`content/blog/*.md` (files with `slug` + `title` in frontmatter; `standard-blog-post.md` is
ignored) into `src/data/generatedPosts.js` automatically. `src/data/blogPosts.js` merges
generated posts with the legacy manual entries (manual wins on slug collision).

**Publishing flow for a new article:** write the markdown file in `content/blog/` → run
`npm run build` (or `npm run dev` via `predev`, which regenerates too). The build chain:
1. `build-posts.mjs` compiles the markdown into a post entry.
2. `generate-sitemap.mjs` adds the post to `sitemap.xml` (with `lastmod` from `date`).
3. `generate-llms.mjs` adds it to `llms.txt` for AI crawlers.

If a new post must be an entry in `src/data/blogPosts.js` manually (legacy posts only), keep the
block types supported by `BlogContent.jsx`: lead, heading, paragraph, image, quote (cite), list,
callout, tldr, framework.

## SEO (automatic, but keep fields honest)
- `sitemap.xml` is regenerated on every `npm run build` from `blogPosts` — a new entry appears in
  the sitemap with zero extra work, but only after a build + deploy.
- The post page auto-sets the browser title, meta description, canonical URL (`dintechnologies.com`),
  Open Graph tags and BlogPosting JSON-LD, all derived from the entry's `title`, `slug`, `excerpt`,
  `date`, `category` and `cover`.
- Keep `excerpt` under ~155 characters and make it a genuine summary of the post (it is the Google
  search snippet and the og:description).
- The `cover` URL is used as the post's og:image. Prefer a real image on `dintechnologies.com`;
  a placeholder (picsum) cover will display on social shares until swapped.
- Do not change `slug` after a post is live — it is the URL and the canonical link. Keep dates in
  `YYYY-MM-DD` so sitemap `lastmod` stays valid.

## Verify
Run `npm run build` and fix any errors before reporting done. The compiler logs
`[build-posts] N post(s) compiled`; if your new post is not in the count, check the frontmatter
(`slug`, `title`, `date` required; the file must end in `.md` inside `content/blog/`).

## Guardrails
- Do not tailor the body to DIT products; keep it reader-first and global (examples may be
  global, African, or Nigerian where they help).
- Every license or capability claim must trace to P1. Every benchmark must state the hardware,
  the quantization, the date, and who ran it.
- Do not introduce secrets or keys into the post or frontmatter.
