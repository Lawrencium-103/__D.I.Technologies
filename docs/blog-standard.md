# DIT Blog Standard

This is the editorial guide and pre-publish checklist for every DIT blog post.
Lawrence Oladeji is the author and editor. Every post is checked against this
document before it is published.

## Voice

- Written for a global technical reader: engineers, IT buyers, school leaders,
  non-profits and public servants. Examples may be global, African or Nigerian
  where they help.
  Clear, practical, calm. No hype.
- Plain, specific prose. Short sentences. One idea per paragraph.
- Numbers over adjectives. Say what it costs, what it runs on, and who it helps.

## Independence (no DIT or product tailoring)

The blog is for the reader: engineers, IT buyers, school leaders, non-profits and public
servants. It is not a channel for DIT or its products.

- Do not name DIT products, frameworks, tools or pilots in the body. Write about
  the reader's problem and the general approach, not what "we" built.
- No "our product", "our framework", "our pilot" or "read our framework page"
  calls to action. Internal product plugs do not ship.
- The author byline (name, role, photo) is allowed and was requested. The role
  line may name the organisation as affiliation, but the body stays reader-first.
- When describing a deployment, method or result, keep it general and
  attributable to a named source (P1/P2), never to "what we do at DIT".
- If a post reads like a case study about DIT, rewrite it as guidance for the
  reader before it publishes.

## Banned

Do not use these. If a source uses one, quote it and then check it.

- Hype words: game-changing, groundbreaking, revolutionary, cutting-edge,
  state-of-the-art, powerful, next-generation, unprecedented, disruptive,
  seamless, robust, unparalleled, best-in-class.
- "The AI landscape" and "the future of X" as openers or conclusions.
- Em dashes (—) in body text. Use a period, colon, or parenthesis.
- Decorative bold. Bold only for terms the reader must remember.
- Rhetorical-question hooks ("Ever wondered why...?").
- Press-release paraphrase and partner-boast phrasing.
- Rule-of-three lists used for rhythm instead of meaning.
- "Not just X, it's Y" constructions.
- Symmetric paragraph lengths written to look balanced.
- "Here's what we'll cover" previews.
- Forced optimistic closes ("The future is bright."). End on the decision or
  the next step.

## Structure (required)

Every post must contain:

1. A TL;DR block (one to four short points, skimmable).
2. At least one image (cover counts; add in-body images where they help).
3. A clear body using the block types in `src/components/BlogContent.jsx`:
   lead, heading, paragraph, image, quote, list, callout, tldr.
4. An author byline (name + photo) rendered above the content.
5. A length of 1,400 to 2,500 words where the topic needs it. Short field
   notes may run shorter; say so in the template blurb.
6. In-text links: every named source is linked where it is first mentioned
   in the body (see below).
7. A References section in Harvard format (see below).

## In-text links

Name the source in the prose and embed the link there. Do not dump URLs at
the end only; the reader should be able to click through from the sentence
that makes the claim.

- Syntax inside any text block (lead, paragraph, list item, callout, quote,
  tldr): `[label](https://full-url)`.
- Link the first mention of each source. Later mentions can be plain text.
- Only link real, load-bearing sources (P1/P2). Do not link P3 leads unless
  the post explicitly says it is a lead.
- External links open in a new tab automatically.

Example: `OpenAI staged the GPT-2 release in 2019 [OpenAI, 2019](https://openai.com/index/better-language-models/)
before later open-sourcing the weights.`

## References (Harvard format, required)

Every post ends with a `References` section rendered from the `references`
array on its entry in `src/data/blogPosts.js` (mirror the same array in the
post's markdown frontmatter). The section lists, in Harvard format, every
source a claim rests on.

Harvard style used on this site:

- Book / report / web source: `Author or Organisation (Year) 'Title'. Publisher
  or Website. Available at: URL (Accessed: Day Month Year).`
- Journal article / preprint: `Author(s) (Year) 'Title'. Journal or arXiv.
  Available at: URL (Accessed: Day Month Year).`
- For an organisation as author, use the organisation name (no "Anon").
- List entries alphabetically by author (or by organisation when there is no
  named author).
- State the access date. Use the publish date for the year, not the access
  date.
- Every P1/P2 source cited inline must appear here. Every entry here must be
  cited inline. No orphan references.

Example entries:

```text
Liesenfeld, A. and Dingemanse, M. (2024) 'English arxiv:2402.01761'? No:
'Opening up ChatGPT: Tracking openness, transparency, and reproducibility
in instruction-tuned language models'. arXiv. Available at:
https://arxiv.org/abs/2402.01761 (Accessed: 19 July 2026).

OpenAI (2019) 'Better language models and their implications'. OpenAI.
Available at: https://openai.com/index/better-language-models/
(Accessed: 19 July 2026).
```

## Source tiers

Tag every claim by source.

- P1 (primary): the actual license text, model card, weights, paper, or
  official documentation. Quote it.
- P2 (secondary): independent benchmarks, our own runs, vendor docs.
- P3 (tertiary): community posts and news. Use only to find leads, never as
  the load-bearing fact.

A license or capability claim with no P1/P2 source does not ship.

## Benchmarks

Every benchmark must state: the hardware it ran on, the quantization, the
date, and who ran it (us or a named third party). A number without these is
not a benchmark, it is a slogan.

## Templates

Each post uses one named template in `src/data/blogPosts.js` (`template` field).
The five templates render differently in `src/pages/BlogPost.jsx`:

- `standard` — Explainer. Calm walkthrough for a non-technical reader.
- `feature` — Field Report. Two-column with a sticky meta sidebar; numbers
  and people from the ground.
- `field-note` — Field Note. Short first-person observation, accent rule on
  the body.
- `deep-dive` — Technical Deep Dive. Wide, paper-card body; commands,
  versions, gotchas.
- `briefing` — Briefing. Summary box up top; situation, decision, meaning.

## Pre-publish checklist

- [ ] No banned words or em dashes in body.
- [ ] Every license/capability claim traces to P1/P2.
- [ ] Every benchmark has hardware, quantization, date, runner.
- [ ] TL;DR present and skimmable.
- [ ] At least one image.
- [ ] Author name + photo render above content.
- [ ] Listen (audio) button present.
- [ ] Length 1,400 to 2,500 words where needed.
- [ ] One of the five templates assigned.
- [ ] No DIT or product mentions in the body (independence rule).
- [ ] No "our product" / "our framework" / "our pilot" calls to action.
- [ ] Every named source linked inline at first mention (`[label](url)`).
- [ ] `References` array present in `blogPosts.js`, Harvard format, matches
  inline citations (no orphans either direction).
