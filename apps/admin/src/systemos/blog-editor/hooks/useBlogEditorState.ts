import { useEffect, useMemo, useRef, useState } from 'react';

import type { SystemOSPost, SystemOSPostStatus, SystemOSRevisionState } from '../../types';
import {
  createEmptyPost,
  estimateSeo,
  formatPreviewParagraphs,
  getStorageValue,
  isRevisionPost,
  relativeTime,
  setStorageValue,
} from '../../utils';
import {
  buildEditableFingerprint,
  buildEditorDraft,
  buildRecoveryKey,
  createUniqueSlug,
  hasMeaningfulDraftContent,
  shouldRestoreRecoverySnapshot,
} from '../helpers/blogEditorDraft';
import { capitalize, coverSummary, getPreviewUrl, hasHtmlMarkup, sanitizeRichHtml } from '../helpers/blogEditorMappers';
import { buildRequiredFieldStatus, getFieldPane } from '../helpers/blogEditorValidation';
import type {
  CollectedDraftDataOptions,
  EditorContext,
  EditorRecoverySnapshot,
  OpenEditorOptions,
  UseBlogEditorStateParams,
  UseBlogEditorStateResult,
} from '../types/blogEditor.types';

const MAX_COVER_SIZE = 4 * 1024 * 1024;
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AUTOSAVE_DELAY_MS = 1800;

export function useBlogEditorState({
  posts,
  onPostsChange,
  categories,
  authors,
  currentUserLabel,
  currentUserRole,
  onCloseEditor,
  onUploadCover,
  onSavePost,
  onSubmitRevision,
  onApproveRevision,
  onReturnRevisionToDraft,
}: UseBlogEditorStateParams): UseBlogEditorStateResult {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sourcePost, setSourcePost] = useState<SystemOSPost | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [activePane, setActivePane] = useState<'basics' | 'content' | 'publishing' | 'seo'>('basics');
  const [draft, setDraft] = useState<SystemOSPost>(createEmptyPost());
  const [manualSlug, setManualSlug] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState('');
  const [coverDragging, setCoverDragging] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [fullscreenMode, setFullscreenMode] = useState<'' | 'body' | 'editor'>('');
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [pendingRecoverySnapshot, setPendingRecoverySnapshot] = useState<EditorRecoverySnapshot | null>(null);
  const [isAutosavePending, setIsAutosavePending] = useState(false);

  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const previewSheetRef = useRef<HTMLElement | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveFingerprintRef = useRef('');

  const currentPost = sourcePost ?? (editingId ? posts.find((item) => item.id === editingId) ?? null : null);
  const canApproveRevision = ['admin', 'editor'].includes(currentUserRole.toLowerCase());
  const guidance = useMemo(() => buildRequiredFieldStatus(draft), [draft]);
  const currentPreviewUrl = useMemo(
    () =>
      getPreviewUrl({
        slug: draft.slug.trim() || createUniqueSlug(draft.title.trim() || 'Untitled post', posts, currentPost?.id ?? draft.id),
        title: draft.title.trim() || 'Untitled post',
      }),
    [draft.slug, draft.title, posts, currentPost?.id, draft.id],
  );
  const coverMeta = useMemo(() => coverSummary(draft, coverFileName), [draft, coverFileName]);
  const canAutosaveToBackend = Boolean(!previewOnly && (currentPost == null || currentPost.status === 'draft' || isRevisionPost(currentPost)));
  const editorFingerprint = buildEditableFingerprint(draft);
  const categoryOptions = useMemo(
    () => Array.from(new Set([draft.category.trim(), ...categories.map((item) => item.trim())])).filter(Boolean),
    [draft.category, categories],
  );
  const authorOptions = useMemo(
    () => Array.from(new Set([draft.author.trim(), ...authors.map((item) => item.trim())])).filter(Boolean),
    [draft.author, authors],
  );

  function clearAutosaveTimer() {
    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
  }

  function clearRecoverySnapshot(postId?: number | null) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(buildRecoveryKey(postId ?? null));
    } catch {
      // Ignore storage failures.
    }
  }

  function storeRecoverySnapshot(post: SystemOSPost) {
    setStorageValue(buildRecoveryKey(currentPost?.id ?? null), {
      post,
      savedAt: new Date().toISOString(),
    });
  }

  function restoreRecoverySnapshot() {
    if (!pendingRecoverySnapshot) return;
    const restoredDraft = buildEditorDraft(pendingRecoverySnapshot.post);
    setDraft(restoredDraft);
    setCoverFileName(restoredDraft.cover.startsWith('data:') ? 'Recovered uploaded image' : '');
    setManualSlug(Boolean(restoredDraft.slug));
    setPendingRecoverySnapshot(null);
    setRecoveryMessage(`Recovered unsaved changes from ${relativeTime(pendingRecoverySnapshot.savedAt)}.`);
  }

  function dismissRecoverySnapshot() {
    setPendingRecoverySnapshot(null);
    setRecoveryMessage(null);
  }

  function buildAutosaveCandidate() {
    return collectDraftData({ saveAsDraft: !isRevisionPost(currentPost) });
  }

  function integrateSavedPost(savedPost: SystemOSPost, previousPost: SystemOSPost | null) {
    if (previousPost) {
      onPostsChange(posts.map((post) => (post.id === previousPost.id ? savedPost : post)));
    } else {
      onPostsChange([savedPost, ...posts.filter((post) => post.id !== draft.id)]);
    }

    if (!previousPost) {
      clearRecoverySnapshot(null);
    }

    setEditingId(savedPost.id);
    setSourcePost(savedPost);
    setLastSavedAt(savedPost.updated);
    setSaveState('saved');
  }

  function openEditorWithPost(post: SystemOSPost | null, options: OpenEditorOptions = {}) {
    const { preview = false, pane = 'basics', readOnlyPreview = false } = options;
    const nextDraft = buildEditorDraft(post);
    const recoverySnapshot = getStorageValue<EditorRecoverySnapshot | null>(buildRecoveryKey(post?.id ?? null), null);
    const shouldRestoreRecovery =
      !preview &&
      !readOnlyPreview &&
      shouldRestoreRecoverySnapshot(recoverySnapshot, nextDraft, post);
    const restoredDraft = nextDraft;

    setEditingId(post?.id ?? null);
    setSourcePost(post ? { ...post } : null);
    setDraft(restoredDraft);
    setPreviewOpen(preview);
    setPreviewOnly(readOnlyPreview);
    setActivePane(pane);
    setManualSlug(Boolean(post?.slug));
    setCoverFileName(restoredDraft.cover.startsWith('data:') ? 'Saved uploaded image' : '');
    setActionError(null);
    setCoverUploadError(null);
    setCoverDragging(false);
    setSaveState('idle');
    setLastSavedAt(post?.updated ?? null);
    setFullscreenMode('');
    setPendingRecoverySnapshot(shouldRestoreRecovery ? recoverySnapshot : null);
    setRecoveryMessage(
      shouldRestoreRecovery
        ? `Unsaved recovery from ${relativeTime(recoverySnapshot?.savedAt ?? new Date().toISOString())} is available.`
        : null,
    );
    autosaveFingerprintRef.current = buildEditableFingerprint(post ? buildEditorDraft(post) : createEmptyPost());
    setEditorOpen(true);
  }

  function closeEditor() {
    clearAutosaveTimer();
    setEditorOpen(false);
    setEditingId(null);
    setSourcePost(null);
    setPreviewOpen(false);
    setPreviewOnly(false);
    setActivePane('basics');
    setDraft(createEmptyPost());
    setManualSlug(false);
    setActionError(null);
    setCoverUploadError(null);
    setCoverFileName('');
    setCoverDragging(false);
    setSaveState('idle');
    setLastSavedAt(null);
    setFullscreenMode('');
    setPendingRecoverySnapshot(null);
    setRecoveryMessage(null);
    setIsAutosavePending(false);
    onCloseEditor?.();
  }

  function updateDraft<K extends keyof SystemOSPost>(key: K, value: SystemOSPost[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === 'title' && !manualSlug) {
        next.slug = createUniqueSlug(String(value), posts, currentPost?.id ?? current.id);
      }
      return next;
    });
  }

  function openRequiredField(fieldId: import('../types/blogEditor.types').RequiredFieldId) {
    setActivePane(getFieldPane(fieldId));
    window.setTimeout(() => {
      const field = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      field?.focus();
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 40);
  }

  function collectDraftData(options: CollectedDraftDataOptions = {}) {
    const title = draft.title.trim() || 'Untitled post';
    let statusValue = options.saveAsDraft ? 'draft' : options.forceStatus ?? draft.status;

    if (currentPost && isRevisionPost(currentPost)) {
      if (statusValue !== 'published' && statusValue !== 'scheduled') {
        const livePost = posts.find((post) => post.id === currentPost.revisionOf);
        statusValue = livePost?.status ?? 'published';
      }
    }

    const publishDate = draft.status === 'scheduled' ? draft.scheduledFor : draft.publishedAt;

    return {
      ...draft,
      id: currentPost?.id ?? draft.id,
      title,
      slug: createUniqueSlug(draft.slug.trim() || title, posts, currentPost?.id ?? draft.id),
      readTime: draft.readTime.trim() || '5 min read',
      category: draft.category.trim(),
      author: draft.author.trim(),
      featuredSlot: draft.featuredSlot?.trim() || '',
      featuredOnHome: Boolean(draft.featuredOnHome),
      status: statusValue,
      excerpt: draft.excerpt.trim(),
      cover: draft.cover.trim(),
      body: draft.body.trim(),
      note: draft.note.trim(),
      metaTitle: draft.metaTitle.trim(),
      metaDescription: draft.metaDescription.trim(),
      scheduledFor: statusValue === 'scheduled' ? publishDate || draft.scheduledFor : '',
      publishedAt: statusValue === 'published' ? publishDate || currentPost?.publishedAt || new Date().toISOString() : '',
      seo: estimateSeo(draft),
      views: currentPost?.views || 0,
      revisionOf: currentPost?.revisionOf ?? draft.revisionOf ?? null,
      revisionState: currentPost?.revisionState ?? draft.revisionState ?? '',
      openRevisionId: null,
      openRevisionState: '',
      updated: new Date().toISOString(),
    } satisfies SystemOSPost;
  }

  function applyLocalSave(nextPost: SystemOSPost) {
    if (currentPost) {
      onPostsChange(posts.map((post) => (post.id === currentPost.id ? nextPost : post)));
      return;
    }

    onPostsChange([{ ...nextPost, id: Date.now() }, ...posts]);
  }

  async function runEditorAction(task: () => Promise<void> | void) {
    setActionError(null);
    setIsActionPending(true);
    clearAutosaveTimer();
    try {
      await task();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to complete this action.');
      return;
    } finally {
      setIsActionPending(false);
    }
  }

  async function persistAutosave() {
    if (!editorOpen || previewOnly || isActionPending || isCoverUploading || isAutosavePending) return;
    const nextPost = buildAutosaveCandidate();
    const fingerprint = buildEditableFingerprint(nextPost);
    if (fingerprint === autosaveFingerprintRef.current) return;

    storeRecoverySnapshot(nextPost);

    if (!canAutosaveToBackend) {
      setSaveState('idle');
      return;
    }

    if (!currentPost && !hasMeaningfulDraftContent(nextPost)) {
      return;
    }

    setSaveState('saving');
    setIsAutosavePending(true);
    setActionError(null);

    try {
      if (onSavePost) {
        const saved = await onSavePost(nextPost, { previousPost: currentPost, action: 'autosave' });
        if (saved) {
          integrateSavedPost(saved, currentPost);
          autosaveFingerprintRef.current = buildEditableFingerprint(saved);
          clearRecoverySnapshot(saved.id);
        } else {
          autosaveFingerprintRef.current = fingerprint;
          setLastSavedAt(new Date().toISOString());
          setSaveState('saved');
        }
      } else {
        applyLocalSave(nextPost);
        autosaveFingerprintRef.current = fingerprint;
        setLastSavedAt(new Date().toISOString());
        setSaveState('saved');
      }
    } catch (error) {
      setSaveState('error');
      setActionError(error instanceof Error ? error.message : 'Autosave failed.');
      storeRecoverySnapshot(nextPost);
    } finally {
      setIsAutosavePending(false);
    }
  }

  async function saveSecondaryAction() {
    if (previewOnly) return;
    const nextPost = collectDraftData({ saveAsDraft: !isRevisionPost(currentPost) });

    await runEditorAction(async () => {
      if (currentPost && isRevisionPost(currentPost)) {
        if (onSavePost) {
          const saved = await onSavePost(nextPost, { previousPost: currentPost, action: 'secondary' });
          if (saved) {
            integrateSavedPost(saved, currentPost);
            clearRecoverySnapshot(saved.id);
          }
        } else {
          applyLocalSave({ ...nextPost, revisionState: currentPost.revisionState || 'working' });
        }
      } else if (onSavePost) {
        const saved = await onSavePost(nextPost, { previousPost: currentPost, action: 'secondary' });
        if (saved) {
          integrateSavedPost(saved, currentPost);
          clearRecoverySnapshot(saved.id);
        }
      } else {
        applyLocalSave(nextPost);
      }

      closeEditor();
    });
  }

  async function submitRevisionForApproval() {
    if (previewOnly) return;
    const nextPost = { ...collectDraftData(), revisionState: 'ready_for_review' as SystemOSRevisionState };

    await runEditorAction(async () => {
      if (onSubmitRevision) {
        const saved = await onSubmitRevision(nextPost);
        if (saved) {
          integrateSavedPost(saved, currentPost);
          clearRecoverySnapshot(saved.id);
        }
      } else {
        applyLocalSave(nextPost);
      }

      closeEditor();
    });
  }

  async function returnRevisionToDraftAction() {
    if (previewOnly) return;
    const nextPost = { ...collectDraftData(), revisionState: 'working' as SystemOSRevisionState };

    await runEditorAction(async () => {
      if (onReturnRevisionToDraft) {
        const saved = await onReturnRevisionToDraft(nextPost);
        if (saved) {
          integrateSavedPost(saved, currentPost);
          clearRecoverySnapshot(saved.id);
        }
      } else {
        applyLocalSave(nextPost);
      }

      closeEditor();
    });
  }

  async function approveRevisionAction() {
    if (previewOnly) return;
    const revision = currentPost;
    if (!revision || !isRevisionPost(revision)) return;

    const approvedData = collectDraftData();
    await runEditorAction(async () => {
      if (onApproveRevision) {
        await onApproveRevision(approvedData);
      } else {
        const livePost = posts.find((post) => post.id === revision.revisionOf);
        if (!livePost) {
          throw new Error('The live post for this revision could not be found.');
        }

        const nextStatus: SystemOSPostStatus = approvedData.status === 'scheduled' ? 'scheduled' : 'published';
        const nextPosts: SystemOSPost[] = posts
          .filter((post) => post.id !== revision.id)
          .map((post) =>
            post.id === livePost.id
              ? {
                  ...post,
                  ...approvedData,
                  id: livePost.id,
                  status: nextStatus,
                  revisionOf: null,
                  revisionState: '',
                  openRevisionId: null,
                  openRevisionState: '',
                  updated: new Date().toISOString(),
                }
              : post,
          );
        onPostsChange(nextPosts);
      }

      closeEditor();
    });
  }

  async function savePrimaryAction() {
    if (previewOnly) return;
    if (guidance.missing.length > 0) {
      openRequiredField(guidance.missing[0].id);
      return;
    }

    if (currentPost && isRevisionPost(currentPost)) {
      if (currentPost.revisionState === 'ready_for_review' && canApproveRevision) {
        await approveRevisionAction();
      } else {
        await submitRevisionForApproval();
      }
      return;
    }

    const nextPost = collectDraftData({
      forceStatus: draft.status === 'scheduled' ? 'scheduled' : 'published',
    });

    await runEditorAction(async () => {
      if (onSavePost) {
        const saved = await onSavePost(nextPost, { previousPost: currentPost, action: 'primary' });
        if (saved) {
          integrateSavedPost(saved, currentPost);
          clearRecoverySnapshot(saved.id);
        }
      } else {
        applyLocalSave(nextPost);
      }

      closeEditor();
    });
  }

  function getMetaLine(post: SystemOSPost | null) {
    const saveDetail =
      saveState === 'saving' || isAutosavePending
        ? 'Saving...'
        : saveState === 'error'
          ? 'Autosave failed'
          : lastSavedAt
            ? `Saved ${relativeTime(lastSavedAt)}`
            : 'Not saved yet';
    if (!post) return `Draft / ${saveDetail} / ${currentUserLabel}`;
    if (isRevisionPost(post)) {
      const revisionLabel = post.revisionState === 'ready_for_review' ? 'Ready for approval' : 'Working revision';
      return `${revisionLabel} / ${saveDetail} / ${currentUserLabel}`;
    }
    if (post.status === 'scheduled' && post.scheduledFor) return `Scheduled / ${saveDetail} / ${currentUserLabel}`;
    if (post.status === 'published') return `Published / ${saveDetail} / ${currentUserLabel}`;
    return `${capitalize(post.status || 'draft')} / ${saveDetail} / ${currentUserLabel}`;
  }

  const editorContext: EditorContext = useMemo(() => {
    if (previewOnly) {
      return {
        title: currentPost?.title.trim() || 'Preview',
        meta: `${capitalize(currentPost?.status || 'draft')} / Live preview / ${currentPreviewUrl}`,
        secondaryLabel: '',
        primaryLabel: '',
        showReturn: false,
        readOnly: true,
      };
    }

    if (!currentPost) {
      return {
        title: draft.title.trim() || 'Untitled draft',
        meta: `Draft / Not saved yet / ${currentUserLabel}`,
        secondaryLabel: 'Create Draft',
        primaryLabel: draft.status === 'scheduled' ? 'Schedule' : 'Publish',
        showReturn: false,
        readOnly: false,
      };
    }

    if (isRevisionPost(currentPost)) {
      const isReady = currentPost.revisionState === 'ready_for_review';
      return {
        title: draft.title.trim() || currentPost.title || 'Untitled revision',
        meta: getMetaLine(currentPost),
        secondaryLabel: 'Save Revision',
        primaryLabel: isReady && canApproveRevision ? 'Approve & Publish' : 'Submit for Approval',
        showReturn: isReady && canApproveRevision,
        readOnly: false,
      };
    }

    return {
      title: draft.title.trim() || currentPost.title || 'Untitled draft',
      meta: getMetaLine(currentPost),
      secondaryLabel: currentPost.status === 'draft' ? 'Save Draft' : 'Save Post',
      primaryLabel: draft.status === 'scheduled' ? 'Schedule' : 'Publish',
      showReturn: false,
      readOnly: false,
    };
  }, [previewOnly, currentPost, draft.title, draft.status, currentUserLabel, currentPreviewUrl, canApproveRevision, saveState, isAutosavePending, lastSavedAt]);

  const fieldsDisabled = editorContext.readOnly || isActionPending || isCoverUploading;
  const requiresReadiness = ['Publish', 'Schedule', 'Submit for Approval', 'Approve & Publish'].includes(editorContext.primaryLabel);
  const primaryDisabled =
    editorContext.readOnly ||
    isActionPending ||
    isAutosavePending ||
    isCoverUploading ||
    (requiresReadiness && guidance.missing.length > 0);
  const secondaryDisabled = editorContext.readOnly || isActionPending || isAutosavePending || isCoverUploading;
  const previewBodyHtml = hasHtmlMarkup(draft.body) ? sanitizeRichHtml(draft.body) : '';
  const previewParagraphs = formatPreviewParagraphs(draft.body);
  const fieldStatus = useMemo(() => new Map(guidance.checks.map((item) => [item.id, item.done])), [guidance.checks]);
  const hasUnsavedChanges = editorOpen && editorFingerprint !== autosaveFingerprintRef.current;
  const saveIndicatorText =
    saveState === 'saving' || isAutosavePending
      ? 'Saving...'
      : saveState === 'error'
        ? 'Autosave failed'
        : lastSavedAt
          ? `Saved ${relativeTime(lastSavedAt)}`
          : 'Draft not saved yet';

  useEffect(() => {
    if (editorOpen && editorFingerprint !== autosaveFingerprintRef.current && saveState === 'saved') {
      setSaveState('idle');
    }
  }, [editorOpen, editorFingerprint, saveState]);

  useEffect(() => {
    if (!editorOpen || typeof document === 'undefined') return undefined;

    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousHtmlOverflow = htmlStyle.overflow;
    const previousOverscroll = bodyStyle.overscrollBehavior;

    bodyStyle.overflow = 'hidden';
    htmlStyle.overflow = 'hidden';
    bodyStyle.overscrollBehavior = 'none';

    return () => {
      bodyStyle.overflow = previousBodyOverflow;
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.overscrollBehavior = previousOverscroll;
    };
  }, [editorOpen]);

  useEffect(() => {
    if (!editorOpen || previewOnly || !hasUnsavedChanges) {
      clearAutosaveTimer();
      return;
    }

    const nextPost = buildAutosaveCandidate();
    storeRecoverySnapshot(nextPost);

    if (!canAutosaveToBackend) {
      return;
    }

    if (!currentPost && !hasMeaningfulDraftContent(nextPost)) {
      return;
    }

    clearAutosaveTimer();
    autosaveTimerRef.current = window.setTimeout(() => {
      void persistAutosave();
    }, AUTOSAVE_DELAY_MS);

    return () => clearAutosaveTimer();
  }, [
    editorOpen,
    previewOnly,
    hasUnsavedChanges,
    editorFingerprint,
    canAutosaveToBackend,
    currentPost?.id,
    currentPost?.status,
    isActionPending,
    isCoverUploading,
    isAutosavePending,
  ]);

  useEffect(() => {
    if (!editorOpen || typeof window === 'undefined') return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      storeRecoverySnapshot(buildAutosaveCandidate());
      event.preventDefault();
      event.returnValue = '';
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden' || !hasUnsavedChanges) return;
      storeRecoverySnapshot(buildAutosaveCandidate());
      if (canAutosaveToBackend) {
        void persistAutosave();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenMode) {
        setFullscreenMode('');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [editorOpen, hasUnsavedChanges, fullscreenMode, canAutosaveToBackend, editorFingerprint]);

  function isFieldMissing(fieldId: import('../types/blogEditor.types').RequiredFieldId) {
    return !fieldStatus.get(fieldId);
  }

  function togglePreview() {
    setPreviewOpen((current) => !current);
  }

  function toggleEditorFullscreen() {
    setFullscreenMode((current) => (current === 'editor' ? '' : 'editor'));
  }

  function toggleBodyFullscreen() {
    setActivePane('content');
    setFullscreenMode((current) => (current === 'body' ? '' : 'body'));
  }

  function copyCurrentUrl() {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setActionError('Copy is unavailable here. Use the preview URL shown in Publishing Summary.');
      return;
    }

    navigator.clipboard.writeText(currentPreviewUrl).catch(() => {
      setActionError('Copy is unavailable here. Use the preview URL shown in Publishing Summary.');
    });
  }

  function openCurrentPreview() {
    if (!previewOpen) {
      setPreviewOpen(true);
      window.setTimeout(() => previewSheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
      return;
    }

    previewSheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function triggerCoverSelection() {
    if (previewOnly || isCoverUploading || isActionPending) return;
    coverFileRef.current?.click();
  }

  function clearCover() {
    if (previewOnly) return;
    setCoverFileName('');
    setCoverUploadError(null);
    updateDraft('cover', '');
    if (coverFileRef.current) coverFileRef.current.value = '';
  }

  async function loadCoverFile(file?: File | null) {
    if (!file || previewOnly) return;
    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      setCoverUploadError('Use a JPG, PNG, or WebP image for the cover.');
      return;
    }
    if (file.size > MAX_COVER_SIZE) {
      setCoverUploadError('Cover image must be 4 MB or smaller.');
      return;
    }

    setCoverUploadError(null);
    setIsCoverUploading(true);

    try {
      if (onUploadCover) {
        const uploaded = await onUploadCover(file);
        setCoverFileName(uploaded.fileName || file.name);
        updateDraft('cover', uploaded.url);
      } else {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Unable to read the selected image.'));
          reader.readAsDataURL(file);
        });
        setCoverFileName(file.name);
        updateDraft('cover', dataUrl);
      }
    } catch (error) {
      setCoverUploadError(error instanceof Error ? error.message : 'Unable to upload the selected image.');
    } finally {
      setIsCoverUploading(false);
      setCoverDragging(false);
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  }

  async function uploadBodyImage(file: File) {
    if (!onUploadCover) {
      throw new Error('Image upload is unavailable.');
    }
    const uploaded = await onUploadCover(file);
    return uploaded.url;
  }

  return {
    editorOpen,
    previewOpen,
    previewOnly,
    activePane,
    draft,
    currentPost,
    categoryOptions,
    authorOptions,
    editorContext,
    guidance,
    currentPreviewUrl,
    coverMeta,
    fieldsDisabled,
    primaryDisabled,
    secondaryDisabled,
    isActionPending,
    isCoverUploading,
    coverUploadError,
    coverFileName,
    coverDragging,
    saveState,
    lastSavedAt,
    fullscreenMode,
    recoveryMessage,
    hasRecoverySnapshot: Boolean(pendingRecoverySnapshot),
    actionError,
    previewBodyHtml,
    previewParagraphs,
    saveIndicatorText,
    previewSheetRef,
    coverFileRef,
    openEditorWithPost,
    closeEditor,
    setActivePane,
    togglePreview,
    toggleEditorFullscreen,
    toggleBodyFullscreen,
    updateDraft,
    setManualSlug,
    setActionErrorMessage: setActionError,
    setCoverDragging,
    isFieldMissing,
    openRequiredField,
    saveSecondaryAction,
    savePrimaryAction,
    returnRevisionToDraftAction,
    restoreRecoverySnapshot,
    dismissRecoverySnapshot,
    triggerCoverSelection,
    clearCover,
    loadCoverFile,
    uploadBodyImage: onUploadCover ? uploadBodyImage : undefined,
    copyCurrentUrl,
    openCurrentPreview,
  };
}
