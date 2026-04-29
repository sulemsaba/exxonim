# Tailwind CSS Migration

## Status

Complete for the public app.

The public site now uses `apps/public/src/tailwind.css` as its single stylesheet entrypoint. The previous global stylesheet and service package stylesheet were folded into that Tailwind entrypoint, and React runtime `<style>` blocks were removed from public pages/components.

## What Changed

- Added Tailwind v4 through the Vite plugin in `apps/public/vite.config.ts`.
- Kept `apps/public/tailwind.config.ts` for theme tokens, colors, fonts, shadows, and animations.
- Kept `apps/public/postcss.config.js` focused on `autoprefixer`; Tailwind is handled by `@tailwindcss/vite`.
- Replaced the dual stylesheet imports in `apps/public/src/app/main.tsx` with only `../tailwind.css`.
- Deleted `apps/public/src/styles.css`.
- Deleted `apps/public/src/components/ServicePackagesSection.css`.
- Moved the remaining public page/component CSS into `apps/public/src/tailwind.css`.
- Replaced prop-generated CSS in loading/error/skeleton components with fixed classes and dynamic inline values only where needed.
- Cleared the shared React Query client after SSR renders so `npm run build --workspace @exxonim/public` can finish prerendering and exit cleanly.

## Verification

```bash
npm run typecheck --workspace @exxonim/public
npm run build:client --workspace @exxonim/public
npm run build --workspace @exxonim/public
```

All three commands pass after the migration.
