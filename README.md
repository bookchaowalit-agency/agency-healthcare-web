# Healthcare — สุขภาพและการแพทย์

A static showcase site for the Solo Empire **Healthcare** vertical: the positioning, the first offer
("Health and medtech readiness map (future)") and an honest readiness status, plus one pSEO service page. It is for positioning and message
testing only. There is no database, account, API, payment, lead form or customer data.

Live: https://solo-agency-healthcare.vercel.app (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## Pages

- `/`: the showcase (promise, buyer, offer, scope, readiness note). Visual world: Clinical readiness surface.
- `/services/`: a one-card service directory.
- `/services/health-medtech-readiness-map/`: the service page (workflow, deliverables, evidence boundary, readiness gate, JSON-LD).

Every build is `noindex, nofollow` with `robots.txt` = `Disallow: /` and an empty sitemap. Indexing opens only
when both `NEXT_PUBLIC_SITE_URL` (an http(s) URL) and `NEXT_PUBLIC_SITE_INDEXABLE=true` are set at build time.

## Run

```bash
npm ci
npm run dev        # http://localhost:3010
```

## Checks

```bash
npm test           # Vitest: indexing gate, URL parsing, robots/sitemap, pSEO data and route, JSON-LD escaping,
                   # page renders, social card, Sentry scrubbing
npm run lint
npm run typecheck
npm run check      # lint + typecheck + tests + static export to out/ (fetches Noto Thai from Google Fonts at build)
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (lint, typecheck, tests with a line-coverage gate,
then `npm run check` and a check that `out/robots.txt` is `Disallow: /`) and the shared security scan on every push and PR to `main`.

## Code map

- `lib/site.ts`: the vertical's copy and design tokens. `lib/pseo.ts`: the one service page's content.
- `lib/site-config.ts`: `resolveSiteConfig(env)` reads `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_INDEXABLE`
  (rejecting non-http(s) URLs and any query, fragment or credentials), decides indexing and builds canonical URLs.
  Page paths end in `/` because `next.config.ts` sets `trailingSlash: true`.
- `app/robots.ts`, `app/sitemap.ts`: closed by default, open only when indexing is approved.
- `lib/structured-data.ts`: Service + BreadcrumbList JSON-LD, `<` escaped.
- `components/pseo-page.tsx`: the service page and its header.
- `app/opengraph-image.tsx`: a 1200x630 social card PNG rendered at build time (ASCII text only: the built-in
  font has no Thai glyphs).
- `lib/sentry.ts` + `instrumentation-client.ts`: browser error reporting to Sentry, errors only, personal data
  stripped; off when `NEXT_PUBLIC_SENTRY_DSN` is unset. Static export, so there is no server runtime to instrument.

Copy comes from the agency brief/control plane. Earlier freelance or client work is not counted as an agency
customer or case study here (see `AGENTS.md`).
