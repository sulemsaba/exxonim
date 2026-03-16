# Exxonim Website

Static React/Vite marketing site for Exxonim. The build produces prerendered HTML for public routes, article detail pages, legacy blog aliases, a `404.html`, and search engine assets.

## Stack

- React 18
- TypeScript
- Vite
- Static prerender via `scripts/prerender.mjs`

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run typecheck
npm run build
```

`npm run build` does all of the following:

1. Compiles TypeScript.
2. Builds the client bundle.
3. Builds the SSR entry used for prerendering.
4. Generates static HTML into `dist/`.
5. Emits `404.html`, `sitemap.xml`, and `robots.txt`.

## Main Routes

- `/`
- `/about/`
- `/services/`
- `/track-consultation/`
- `/resources/`
- `/resources/:slug/`
- `/faq/`
- `/career/`
- `/contact/`
- `/support/`
- `/terms/`
- `/privacy/`
- `/404/`

Legacy article aliases are also emitted under `/blog/:slug/` and canonicalize to `/resources/:slug/`.

## Deployment Notes

- Deploy the generated `dist/` directory.
- Make sure the host serves `404.html` for unknown static paths where supported.
- Internal metadata and canonical tags assume the production origin is `https://exxonim.tz`.

## Content Notes

- Resource/article listing data lives in [src/content.ts](src/content.ts).
- Article body copy lives in [src/blogArticleContent.ts](src/blogArticleContent.ts).
- Route-aware SEO metadata lives in [src/seo.ts](src/seo.ts).
