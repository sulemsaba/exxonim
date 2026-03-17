export function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function parseJsonValue<T = unknown>(value: string): T {
  return JSON.parse(value) as T;
}

export function tryParseJsonValue<T = unknown>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}
