# Admin Migration: Tailwind Over MUI

## Completed (4/10 phases)

| Phase | Files | Tests |
|-------|-------|-------|
| 0 — Test infra | `vitest.config.ts`, `setup.ts`, `test-utils.tsx` | 3 ✓ |
| 1 — Design tokens | `app/tailwind.css`, `cn.ts` | 15 ✓ |
| 2 — Layout shell | `layouts-tailwind/dashboard/layout.tsx`, `layouts-tailwind/auth/layout.tsx` | 12 ✓ |
| 3 — Sidebar nav | `layouts-tailwind/dashboard/nav.tsx` — groups, icons, active states, children, collapse | 10 ✓ |

## Remaining (6 phases)

| # | What |
|---|------|
| 4 | **Header** — search, notifications, theme toggle, user menu |
| 5 | **Content areas** — cards, tables, forms |
| 6 | **Typography & spacing** — prose styles, tailwind.css additions |
| 7 | **Auth pages** — sign-in, 404, password reset |
| 8 | **Switch imports** — routes point to Tailwind layouts, drop MUI |
| 9 | **Build + typecheck** — `npm run build`, `npm run typecheck`, cleanup |

## Commands

```bash
cd apps/admin-next
npm run test        # 40 tests, all pass
npm run test:watch  # watch mode
```
