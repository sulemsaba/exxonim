const PUBLIC_CONTENT_CACHE_PREFIX = "exxonim-public-content";

export type PublicContentSource = "live" | "cache" | "fallback";

type CachedPublicContentEnvelope<T> = {
  version: 1;
  cachedAt: string;
  expiresAt: string | null;
  value: T;
};

export interface PublicContentState<T> {
  data: T | undefined;
  source: PublicContentSource;
  isDegraded: boolean;
  isStale: boolean;
  cachedAt?: string;
  expiresAt?: string | null;
  error?: unknown;
}

interface PublicContentCacheOptions<T> {
  fallbackValue?: T;
  ttlMs?: number;
}

interface PublicContentFetchOptions<T> extends PublicContentCacheOptions<T> {
  cacheKey: string;
  fetcher: () => Promise<T>;
  validate?: (value: T) => boolean;
  warningLabel?: string;
}

function hasLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toStorageKey(cacheKey: string) {
  return `${PUBLIC_CONTENT_CACHE_PREFIX}:${cacheKey}`;
}

function resolveExpiry(ttlMs?: number) {
  if (!ttlMs || ttlMs <= 0) {
    return null;
  }

  return new Date(Date.now() + ttlMs).toISOString();
}

function readCachedEnvelope<T>(cacheKey: string): CachedPublicContentEnvelope<T> | null {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(toStorageKey(cacheKey));
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as
      | CachedPublicContentEnvelope<T>
      | {
          cachedAt?: string;
          expiresAt?: string | null;
          value?: T;
        };

    if (!parsed || typeof parsed !== "object" || !("value" in parsed)) {
      return null;
    }

    return {
      version: 1,
      cachedAt:
        typeof parsed.cachedAt === "string"
          ? parsed.cachedAt
          : new Date().toISOString(),
      expiresAt:
        typeof parsed.expiresAt === "string" || parsed.expiresAt === null
          ? parsed.expiresAt
          : null,
      value: parsed.value as T,
    };
  } catch {
    return null;
  }
}

export function getCachedPublicContentState<T>(
  cacheKey: string,
  options: PublicContentCacheOptions<T> = {}
): PublicContentState<T> {
  const { fallbackValue } = options;
  const cached = readCachedEnvelope<T>(cacheKey);

  if (cached) {
    const isStale = Boolean(
      cached.expiresAt && new Date(cached.expiresAt).getTime() <= Date.now()
    );

    return {
      data: cached.value,
      source: "cache",
      isDegraded: true,
      isStale,
      cachedAt: cached.cachedAt,
      expiresAt: cached.expiresAt,
    };
  }

  return {
    data: fallbackValue,
    source: "fallback",
    isDegraded: typeof fallbackValue !== "undefined",
    isStale: true,
  };
}

export function getCachedPublicContent<T>(
  cacheKey: string,
  fallbackValue?: T
): T | undefined {
  return getCachedPublicContentState<T>(cacheKey, { fallbackValue }).data;
}

export function cachePublicContent<T>(
  cacheKey: string,
  value: T,
  options: Pick<PublicContentCacheOptions<T>, "ttlMs"> = {}
) {
  if (!hasLocalStorage()) {
    return value;
  }

  try {
    const payload: CachedPublicContentEnvelope<T> = {
      version: 1,
      cachedAt: new Date().toISOString(),
      expiresAt: resolveExpiry(options.ttlMs),
      value,
    };

    window.localStorage.setItem(toStorageKey(cacheKey), JSON.stringify(payload));
  } catch {
    // Ignore cache write failures so public rendering never hard-fails on storage.
  }

  return value;
}

function warnWithFallback(label: string, error: unknown) {
  if (
    typeof window !== "undefined" &&
    typeof console !== "undefined" &&
    typeof console.warn === "function"
  ) {
    console.warn(label, error);
  }
}

export async function fetchWithFallbackResource<T>(
  options: PublicContentFetchOptions<T>
): Promise<PublicContentState<T>> {
  const { cacheKey, fallbackValue, fetcher, ttlMs, validate, warningLabel } = options;

  try {
    const value = await fetcher();
    if (validate && !validate(value)) {
      throw new Error(`Live public content for "${cacheKey}" failed validation.`);
    }

    const cachedValue = cachePublicContent(cacheKey, value, { ttlMs });
    const cachedAt = new Date().toISOString();
    const expiresAt = resolveExpiry(ttlMs);

    return {
      data: cachedValue,
      source: "live",
      isDegraded: false,
      isStale: false,
      cachedAt,
      expiresAt,
    };
  } catch (error) {
    const fallback = getCachedPublicContentState<T>(cacheKey, {
      fallbackValue,
      ttlMs,
    });

    if (typeof fallback.data !== "undefined") {
      warnWithFallback(
        warningLabel ?? `Using cached or default public content for ${cacheKey}.`,
        error
      );

      return {
        ...fallback,
        error,
      };
    }

    throw error;
  }
}

export async function fetchWithFallback<T>(
  options: PublicContentFetchOptions<T>
): Promise<T> {
  const resource = await fetchWithFallbackResource<T>(options);
  return resource.data as T;
}
