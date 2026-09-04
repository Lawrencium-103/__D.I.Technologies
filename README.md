# DIT Dara Initiative Tech — Website

Source code for the official website of **DIT Dara Initiative Tech (D.I. Technologies)** — an AI, data, and open-technology initiative building offline-first, locally deployable AI, public research, and practical training for organisations across Nigeria and the Global South.

The site covers the **Open Model Scoring Framework (OMSF)**, open-weight model research, and applied AI training. It is built as a prerendered React + Vite single-page app with generated sitemaps and structured data (JSON-LD) for search visibility.

## Official Links

These are the canonical properties for the project:

- 🌐 **Website:** [DIT Dara Initiative Tech — dintechnologies.com](https://dintechnologies.com)
- 🔬 **Research:** [OMSF Research, Methodology & Citations — dintechnologies.com/research](https://dintechnologies.com/research)

## Tech Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev) (SPA with prerendered static output)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Framer Motion](https://www.framer.com/motion/) for animation
- [React Router](https://reactrouter.com) for routing
- Build scripts that generate blog posts, sitemaps, `llms.txt`, and OpenGraph covers

## Project Structure

```
src/
  pages/        # Route pages (Home, About, Research, Blog, Contact, Training)
  components/   # Reusable UI components
  data/         # Blog + model datasets
  lib/          # SEO helpers (JSON-LD, meta, sitemap)
content/blog/   # Markdown source for blog posts
scripts/        # Build-time generators (posts, sitemap, covers, prerender)
```

## Getting Started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (includes sitemap + prerender)
npm run preview    # preview the built site
```

## License

Source code in this repository is provided for reference. Content, brand, and assets belong to DIT Dara Initiative Tech. See [dintechnologies.com](https://dintechnologies.com) for the live site.
