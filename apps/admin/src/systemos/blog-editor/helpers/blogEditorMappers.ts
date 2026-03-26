import type { SystemOSPost } from '../../types';
import type { CoverSummary } from '../types/blogEditor.types';

export function hasHtmlMarkup(value = '') {
  return /<([a-z][^>\s/]*)[\s\S]*>/i.test(value);
}

export function sanitizeRichHtml(value = '') {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son[a-z]+="[^"]*"/gi, '')
    .replace(/\son[a-z]+='[^']*'/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function toLocalInput(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

export function capitalize(value = '') {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function getPreviewUrl(post?: Pick<SystemOSPost, 'slug' | 'title'> | null) {
  const slug = post?.slug?.trim() || 'untitled-post';
  return `/blog/${slug}`;
}

export function coverSummary(post: SystemOSPost, coverFileName: string): CoverSummary {
  if (!post.cover.trim()) {
    return {
      state: 'No image selected',
      note: 'Recommended 1600 x 900 px, max 4 MB, JPG, PNG, or WebP.',
    };
  }

  return {
    state: coverFileName ? `Uploaded: ${coverFileName}` : 'Loaded from URL',
    note: 'This image appears at the top of the public article preview.',
  };
}
