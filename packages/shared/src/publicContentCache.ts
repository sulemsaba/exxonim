const PUBLIC_CONTENT_CACHE_PREFIX = "exxonim-public-content";

type CachedPublicContentEnvelope<T> = {
  cachedAt: string;
  value: T;
};

function hasLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toStorageKey(cacheKey: string) {
  return `${PUBLIC_CONTENT_CACHE_PREFIX}:${cacheKey}`;
}

export function getCachedPublicContent<T>(
  cacheKey: string,
  fallbackValue?: T
): T | undefined {
  if (!hasLocalStorage()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(toStorageKey(cacheKey));
    if (!rawValue) {
      return fallbackValue;
    }

    const parsed = JSON.parse(rawValue) as CachedPublicContentEnvelope<T>;
    return parsed.value;
  } catch {
    return fallbackValue;
  }
}

export function cachePublicContent<T>(cacheKey: string, value: T) {
  if (!hasLocalStorage()) {
    return value;
  }

  try {
    const payload: CachedPublicContentEnvelope<T> = {
      cachedAt: new Date().toISOString(),
      value,
    };

    window.localStorage.setItem(toStorageKey(cacheKey), JSON.stringify(payload));
  } catch {
    // Ignore cache write failures so public rendering never hard-fails on storage.
  }

  return value;
}

export async function fetchWithFallback<T>(options: {
  cacheKey: string;
  fetcher: () => Promise<T>;
  fallbackValue?: T;
  warningLabel?: string;
}): Promise<T> {
  const { cacheKey, fetcher, fallbackValue, warningLabel } = options;

  try {
    const value = await fetcher();
    return cachePublicContent(cacheKey, value);
  } catch (error) {
    const fallback = getCachedPublicContent<T>(cacheKey, fallbackValue);

    if (typeof fallback !== "undefined") {
      if (
        typeof window !== "undefined" &&
        typeof console !== "undefined" &&
        typeof console.warn === "function"
      ) {
        console.warn(
          warningLabel ?? `Using cached or default public content for ${cacheKey}.`,
          error
        );
      }

      return fallback;
    }

    throw error;
  }
}
