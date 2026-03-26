import { createEmptyPost } from '../../utils';
import type { SystemOSPost } from '../../types';
import type { EditorRecoverySnapshot, LocalRevisionDraft } from '../types/blogEditor.types';
import { containsMeaningfulBody, INVALID_SELECTION_VALUES } from './blogEditorValidation';

export const EDITOR_RECOVERY_PREFIX = 'systemos-blog-editor-recovery';

export function buildRecoveryKey(postId?: number | null) {
  return `${EDITOR_RECOVERY_PREFIX}-${postId ?? 'new'}`;
}

export function buildEditableFingerprint(post: SystemOSPost) {
  return JSON.stringify({
    title: post.title.trim(),
    slug: post.slug.trim(),
    category: post.category.trim(),
    author: post.author.trim(),
    featuredSlot: post.featuredSlot?.trim() || '',
    featuredOnHome: Boolean(post.featuredOnHome),
    status: post.status,
    scheduledFor: post.scheduledFor,
    publishedAt: post.publishedAt,
    readTime: post.readTime.trim(),
    excerpt: post.excerpt.trim(),
    cover: post.cover.trim(),
    body: post.body.trim(),
    note: post.note.trim(),
    metaTitle: post.metaTitle.trim(),
    metaDescription: post.metaDescription.trim(),
    revisionOf: post.revisionOf ?? null,
    revisionState: post.revisionState ?? '',
  });
}

export function buildEditorDraft(post?: SystemOSPost | null) {
  if (!post) return createEmptyPost();
  return {
    ...post,
    category: INVALID_SELECTION_VALUES.has(post.category.trim().toLowerCase()) ? '' : post.category,
    author: INVALID_SELECTION_VALUES.has(post.author.trim().toLowerCase()) ? '' : post.author,
  };
}

export function hasMeaningfulDraftContent(post: SystemOSPost) {
  return Boolean(
    post.title.trim() ||
      post.excerpt.trim() ||
      containsMeaningfulBody(post.body) ||
      post.cover.trim() ||
      post.metaTitle.trim() ||
      post.metaDescription.trim(),
  );
}

export function createUniqueSlug(baseSlug: string, posts: SystemOSPost[], currentId?: number | null) {
  const normalized = baseSlug
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-post';
  const taken = new Set(
    posts
      .filter((post) => post.id !== currentId)
      .map((post) => post.slug.trim())
      .filter(Boolean),
  );
  if (!taken.has(normalized)) return normalized;
  let suffix = 2;
  let candidate = `${normalized}-${suffix}`;
  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${normalized}-${suffix}`;
  }
  return candidate;
}

export function buildLocalRevision(post: SystemOSPost): LocalRevisionDraft {
  return {
    ...post,
    id: Date.now(),
    updated: new Date().toISOString(),
    revisionOf: post.id,
    revisionState: 'working',
    openRevisionId: null,
    openRevisionState: '',
  };
}

export function buildDuplicateDraft(source: SystemOSPost, posts: SystemOSPost[]): SystemOSPost {
  const duplicateTitle = `${source.title} (Copy)`;
  return {
    ...source,
    id: Date.now(),
    title: duplicateTitle,
    slug: createUniqueSlug(`${source.slug || source.title}-copy`, posts),
    status: 'draft',
    publishedAt: '',
    scheduledFor: '',
    revisionOf: null,
    revisionState: '',
    openRevisionId: null,
    openRevisionState: '',
    updated: new Date().toISOString(),
    views: 0,
  };
}

export function shouldRestoreRecoverySnapshot(
  recoverySnapshot: EditorRecoverySnapshot | null,
  nextDraft: SystemOSPost,
  post: SystemOSPost | null,
) {
  if (!recoverySnapshot) return false;

  return (
    buildEditableFingerprint(recoverySnapshot.post) !== buildEditableFingerprint(nextDraft) &&
    (post == null || new Date(recoverySnapshot.savedAt).getTime() > new Date(post.updated).getTime())
  );
}
