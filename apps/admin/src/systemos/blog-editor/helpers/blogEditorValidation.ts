import type { SystemOSEditorPane, SystemOSPost } from '../../types';
import type { RequiredFieldCheck, RequiredFieldId, RequiredFieldStatus } from '../types/blogEditor.types';

export const INVALID_SELECTION_VALUES = new Set([
  'unassigned',
  'unknown author',
  'select category',
  'select author',
]);

export function containsMeaningfulBody(value = '') {
  if (!value.trim()) return false;
  const withoutTags = value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return withoutTags.length >= 8;
}

function hasValidSelection(value = '') {
  return Boolean(value.trim()) && !INVALID_SELECTION_VALUES.has(value.trim().toLowerCase());
}

export function buildRequiredFieldStatus(post: SystemOSPost): RequiredFieldStatus {
  const checks: RequiredFieldCheck[] = [
    { id: 'postTitle', label: 'Title', done: post.title.trim().length >= 4 },
    { id: 'postSlug', label: 'Slug', done: post.slug.trim().length >= 4 },
    { id: 'postCategory', label: 'Category', done: hasValidSelection(post.category) },
    { id: 'postAuthor', label: 'Author', done: hasValidSelection(post.author) },
    { id: 'postCover', label: 'Cover image', done: Boolean(post.cover.trim()) },
    { id: 'postExcerpt', label: 'Excerpt', done: post.excerpt.trim().length >= 20 },
    { id: 'postBody', label: 'Body', done: containsMeaningfulBody(post.body) },
  ];

  if (post.status === 'scheduled') {
    checks.push({
      id: 'postPublishDate',
      label: 'Publish date',
      done: Boolean(post.scheduledFor || post.publishedAt),
    });
  }

  const complete = checks.filter((item) => item.done).length;
  const missing = checks.filter((item) => !item.done);

  return {
    checks,
    complete,
    missing,
    total: checks.length,
    percent: checks.length ? Math.round((complete / checks.length) * 100) : 0,
  };
}

export function getFieldPane(fieldId: RequiredFieldId): SystemOSEditorPane {
  const paneMap: Record<RequiredFieldId, SystemOSEditorPane> = {
    postTitle: 'basics',
    postSlug: 'basics',
    postCategory: 'basics',
    postAuthor: 'basics',
    postCover: 'basics',
    postExcerpt: 'basics',
    postBody: 'content',
    postPublishDate: 'publishing',
  };

  return paneMap[fieldId] ?? 'basics';
}
