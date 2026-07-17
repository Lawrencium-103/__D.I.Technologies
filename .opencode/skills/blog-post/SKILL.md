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
The live site renders posts from `src/data/blogPosts.js` (JS objects), not raw markdown. Translate
the markdown draft into a `blogPosts` entry whose blocks match what `BlogContent.jsx` supports:
lead, heading, paragraph, image, quote (cite), list, callout, tldr. Keep all frontmatter fields.
Add the entry to the array (newest first, or per the content calendar).

## Verify
Run `npm run build` and fix any errors before reporting done.

## Guardrails
- Do not tailor the body to DIT products; keep it reader-first and global (examples may be
  global, African, or Nigerian where they help).
- Every license or capability claim must trace to P1. Every benchmark must state the hardware,
  the quantization, the date, and who ran it.
- Do not introduce secrets or keys into the post or frontmatter.
