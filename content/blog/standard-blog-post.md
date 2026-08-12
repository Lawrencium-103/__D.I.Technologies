# Standard Blog Post (markdown template)

Use this template for every DIT technical blog post. It maps 1:1 to the block
types in `src/components/BlogContent.jsx`, so a draft written here converts
straight into an object in `src/data/blogPosts.js`.

## Frontmatter (required)

```yaml
---
title: ""
slug: ""            # kebab-case, unique, used in the URL
date: YYYY-MM-DD
author: Lawrence Oladeji
category: ""
readingTime: "X min"
template: standard   # standard | feature | field-note | deep-dive | briefing
cover: ""
coverAlt: ""
excerpt: ""
references:          # Harvard-formatted strings, mirrors blogPosts.js
  - "Author (Year) 'Title'. Publisher. Available at: URL (Accessed: Day Month Year)."
---
```

## Body conventions

- **TL;DR** (required): a blockquote that starts with `> TL;DR`, followed by 3 to 4 short points.
- **Lead** (required): the first paragraph after the frontmatter. One strong paragraph that states why the reader should care.
- **Headings**: use `##` only, sentence case. No em dashes anywhere in the body.
- **Paragraphs**: plain text. One idea per paragraph.
- **Images**: `![alt text](url)` on its own line. At least one image per post (the cover counts).
- **Topic-relevant images (required)**: every image in a post, cover included, must be
  AI- or infrastructure-themed AND directly related to the post's subject. For an
  infrastructure post that means server clusters, distributed nodes, networks, chips,
  GPUs, or data-flow / AI-generated art that matches the argument (for example, a
  split-across-nodes diagram for a distributed-inference post). A generic neural-net
  picture on a networking post fails this rule. No generic stock photos of people or
  offices, and never ship a picsum placeholder. The image must illustrate the topic,
  not just "AI" in general.
- **Quotes**: `> quote text` then the attribution on the next line as `> (Name)`. Do not use em dashes for attribution.
- **Lists**: `-` bullets.
- **Callouts**: `> [callout: Title] body text` on one line.
- **Source tiers**: tag claims inline as (P1), (P2) or (P3).
  - P1 = the license text, model card, weights or paper (primary).
  - P2 = an independent benchmark or our own run (states hardware, quantization, date, runner).
  - P3 = community posts and vendor write-ups. Leads only, never the load-bearing fact.
- **In-text links**: name the source and embed the link where it is first
  mentioned. Syntax is `[label](https://full-url)`. Example:
  `OpenAI staged the release [OpenAI, 2019](https://openai.com/index/better-language-models/)
  before open-sourcing the weights.` Only link real P1/P2 sources.
- **References**: add a `references` array (Harvard-formatted strings) to the
  markdown frontmatter AND to the post's entry in `src/data/blogPosts.js`.
  Every inline source must be listed, and every listed source must be cited
  inline. Format: `Author (Year) 'Title'. Publisher. Available at: URL
  (Accessed: Day Month Year).`

## Rules (from docs/blog-standard.md)
- IMAGES MUST BE TOPIC-RELEVANT. This is mandatory, not a preference. Every image
  (cover and in-body) must be AI- or infrastructure-themed AND directly related to what
  the post actually discusses. A generic neural-net picture on a distributed-inference
  or privacy post fails this rule. Never ship generic stock photography or a picsum
  placeholder in a published post.
- No banned hype words (game-changing, groundbreaking, revolutionary, cutting-edge,
  state-of-the-art, powerful, next-generation, unprecedented, disruptive,
  seamless, robust, unparalleled, best-in-class).
- No em dashes (—) in body text. Use a period, colon or parenthesis.
- Sentence-case headings. No decorative bold.
- 1,400 to 2,500 words where the topic needs it.
- Required: TL;DR, at least one image, author byline (name + photo), Listen button.
- Independence: no DIT or product tailoring. Global framing; examples may be
  global, African or Nigerian where they help.
- Every license or capability claim traces to P1. Every benchmark states the
  hardware, the quantization, the date and who ran it.
- End by asking permission or pointing to the next step. Do not close on a
  forced optimistic line.

## Minimal filled example

```markdown
---
title: "Example post title"
slug: "example-post"
date: 2026-06-15
author: Lawrence Oladeji
category: "Engineering"
readingTime: "9 min"
template: standard
cover: "https://picsum.photos/seed/dit-example/1600/900"
coverAlt: "Short description of the cover image"
excerpt: "One sentence on what the reader gets."
---

> TL;DR
> - First short point.
> - Second short point.

Lead paragraph that states the stakes in plain terms.

## A clear heading

Body paragraph. Tag claims by source tier where it matters (P3).

![alt](https://picsum.photos/seed/dit-example-body/1400/800)

> [callout: A sensible rule] Short, useful guidance.

- List item one.
- List item two.

> A quoted line that carries weight (Source Name).

## Where this leaves you

Closing paragraph that gives the reader a decision or a next step.
```
