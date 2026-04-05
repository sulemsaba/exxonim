# Legacy Admin Deprecation Note

`apps/admin` is the legacy Exxonim admin application.

It still exists because the migration to `apps/admin-next` is not fully complete, but it should no longer be treated as the primary admin surface.

## Rule

Use `apps/admin-next` for:

- new admin features
- new workflow work
- RBAC-aware UI work
- long-term product changes

Use `apps/admin` only for:

- short-lived migration support
- critical bug fixes
- urgent fixes that cannot wait for the cutover

## Why

Keeping two active admin applications creates:

- duplicated effort
- inconsistent behavior
- extra maintenance cost
- risk of feature drift

## Practical Guidance

- Do not build new product features here unless there is a strong migration reason.
- Prefer shared logic in `packages/admin-core`.
- Prefer the deploy target in `apps/admin-next`.
- Treat this app as transitional and plan for removal after stable cutover.
