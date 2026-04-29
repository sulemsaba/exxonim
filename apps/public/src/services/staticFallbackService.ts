/**
 * Client-side loader for pre-built static fallback JSON files.
 *
 * At build time, `scripts/fetchFallbackAssets.mjs` fetches the latest API
 * content and writes it to `public/fallback/<key>.json`. This service loads
 * those files when the live API is unavailable.
 *
 * No cache, no service worker, no prior visit required — the file is served
 * as a static asset from the same origin.
 */

/* ── Module-level cache ──────────────────────────────── */
// Once a static fallback file has been fetched successfully, its parsed value
// is held here so subsequent reads are synchronous.
const loaded: Map<string, unknown> = new Map();

/* ── Eager preload map ────────────────────────────────── */
// Services register their key + a promise here at module-init time. The
// fetch starts immediately (while the app hydrates) so the value is ready
// by the time a fallback is actually needed.
const preloads: Map<string, Promise<unknown>> = new Map();

/**
 * Register an eager preload for a static fallback file.
 * Call this at module top-level (not inside a component or effect).
 */
export function preloadStaticFallback<T>(key: string): Promise<T | undefined> {
  const existing = preloads.get(key);
  if (existing) return existing as Promise<T | undefined>;

  const promise = doLoadStaticFallback<T>(key).then((val) => {
    if (typeof val !== "undefined") {
      loaded.set(key, val);
    }
    return val;
  });

  preloads.set(key, promise);
  return promise;
}

/**
 * Get a previously loaded static fallback value synchronously.
 * Returns undefined if the file hasn't finished loading or doesn't exist.
 */
export function getStaticFallback<T>(key: string): T | undefined {
  return loaded.get(key) as T | undefined;
}

/**
 * Load a static fallback file, with an optional timeout.
 * This is the core fetch — it's called by `preloadStaticFallback` and can
 * also be called directly if eager preload isn't used.
 */
async function doLoadStaticFallback<T>(
  key: string,
  timeoutMs = 4_000
): Promise<T | undefined> {
  // Already in module cache
  if (loaded.has(key)) {
    return loaded.get(key) as T;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(`/fallback/${key}.json`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    if (!response.ok) {
      // 404 means the build script didn't generate this file — not an error
      if (response.status === 404) return undefined;
      return undefined;
    }

    const data = (await response.json()) as T;
    loaded.set(key, data);
    return data;
  } catch {
    // Network error, timeout, or invalid JSON — return undefined so the
    // caller falls back to the hardcoded TypeScript default.
    return undefined;
  }
}
