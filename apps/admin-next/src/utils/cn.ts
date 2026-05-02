/**
 * Utility to merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/twMerge for Tailwind usage.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
