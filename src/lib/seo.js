import { useEffect } from 'react'

export const SITE_URL = 'https://dintechnologies.com'
export const SITE_NAME = 'DIT Dara Initiative Tech'
export const SITE_DEFAULT_TITLE = 'Open models, offline AI & EdTech for Africa — DIT'
export const SITE_DEFAULT_DESCRIPTION =
  'Dara Initiative Tech (DIT) builds open models, offline-first AI and EdTech for communities where connectivity and power are uncertain. OMSF framework, S-SME toolkit, AI training and more.'
export const SITE_DEFAULT_IMAGE = `${SITE_URL}/Lawrence.png`
export const SITE_LOCALE = 'en_US'

// Keep <title> under ~60 chars so search engines render the full headline
// instead of truncating it. Append the brand suffix only when it fits, fall
// back to a compact "DIT" suffix, then to the bare title, and only truncate
// the headline itself as a last resort.
const TITLE_BRAND = 'DIT Dara Initiative Tech'
const TITLE_BRAND_SHORT = 'DIT'
const TITLE_MAX = 60

export function buildFullTitle(title) {
  if (!title) return SITE_DEFAULT_TITLE
  const full = `${title} — ${TITLE_BRAND}`
  if (full.length <= TITLE_MAX) return full
  const short = `${title} — ${TITLE_BRAND_SHORT}`
  if (short.length <= TITLE_MAX) return short
  if (title.length <= TITLE_MAX) return title
  const trimmed = title.slice(0, TITLE_MAX - 1).replace(/\s+\S*$/, '')
  return `${trimmed || title.slice(0, TITLE_MAX - 1)}…`
}

const SEO_ATTR = 'data-seo'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(SEO_ATTR, '1')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(SEO_ATTR, '1')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data) {
  let script = document.head.querySelector(`script[type="application/ld+json"][${SEO_ATTR}]`)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(SEO_ATTR, '1')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

function clearSeoTags() {
  document.head.querySelectorAll(`[${SEO_ATTR}]`).forEach((el) => el.remove())
}

/**
 * Per-route SEO: title, description, canonical, robots, Open Graph,
 * Twitter card and JSON-LD structured data. Call once per page component.
 */
export function useSEO({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  image = SITE_DEFAULT_IMAGE,
  imageAlt = '',
  jsonLd = null,
  noindex = false,
} = {}) {
  useEffect(() => {
    const prevTitle = document.title
    const url = `${SITE_URL}${path}`
    const fullTitle = buildFullTitle(title)

    clearSeoTags()

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

    upsertLink('canonical', url)

    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:locale', SITE_LOCALE)
    upsertMeta('property', 'og:image', image)
    if (imageAlt) upsertMeta('property', 'og:image:alt', imageAlt)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    if (jsonLd) {
      setJsonLd(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    }

    return () => {
      clearSeoTags()
      document.title = prevTitle
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, title])
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DEFAULT_DESCRIPTION,
    sameAs: [],
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
