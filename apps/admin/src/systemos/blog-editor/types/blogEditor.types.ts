import type { RefObject } from 'react';

import type {
  SystemOSEditorPane,
  SystemOSPost,
  SystemOSPostStatus,
  SystemOSRevisionState,
  SystemOSBlogManagerProps,
} from '../../types';

export type RequiredFieldId =
  | 'postTitle'
  | 'postSlug'
  | 'postCategory'
  | 'postAuthor'
  | 'postCover'
  | 'postExcerpt'
  | 'postBody'
  | 'postPublishDate';

export type EditorSaveState = 'idle' | 'saving' | 'saved' | 'error';
export type EditorFullscreenMode = '' | 'body' | 'editor';

export interface RequiredFieldCheck {
  id: RequiredFieldId;
  label: string;
  done: boolean;
}

export interface RequiredFieldStatus {
  checks: RequiredFieldCheck[];
  complete: number;
  missing: RequiredFieldCheck[];
  total: number;
  percent: number;
}

export interface EditorRecoverySnapshot {
  post: SystemOSPost;
  savedAt: string;
}

export interface EditorContext {
  title: string;
  meta: string;
  secondaryLabel: string;
  primaryLabel: string;
  showReturn: boolean;
  readOnly: boolean;
}

export interface CoverSummary {
  state: string;
  note: string;
}

export interface OpenEditorOptions {
  preview?: boolean;
  pane?: SystemOSEditorPane;
  readOnlyPreview?: boolean;
}

export type UpdateDraftField = <K extends keyof SystemOSPost>(
  key: K,
  value: SystemOSPost[K],
) => void;

export interface UseBlogEditorStateParams {
  posts: SystemOSPost[];
  onPostsChange: (posts: SystemOSPost[]) => void;
  categories: string[];
  authors: string[];
  currentUserLabel: string;
  currentUserRole: string;
  onCloseEditor?: () => void;
  onUploadCover?: SystemOSBlogManagerProps['onUploadCover'];
  onSavePost?: SystemOSBlogManagerProps['onSavePost'];
  onSubmitRevision?: SystemOSBlogManagerProps['onSubmitRevision'];
  onApproveRevision?: SystemOSBlogManagerProps['onApproveRevision'];
  onReturnRevisionToDraft?: SystemOSBlogManagerProps['onReturnRevisionToDraft'];
}

export interface UseBlogEditorStateResult {
  editorOpen: boolean;
  previewOpen: boolean;
  previewOnly: boolean;
  activePane: SystemOSEditorPane;
  draft: SystemOSPost;
  currentPost: SystemOSPost | null;
  categoryOptions: string[];
  authorOptions: string[];
  editorContext: EditorContext;
  guidance: RequiredFieldStatus;
  currentPreviewUrl: string;
  coverMeta: CoverSummary;
  fieldsDisabled: boolean;
  primaryDisabled: boolean;
  secondaryDisabled: boolean;
  isActionPending: boolean;
  isCoverUploading: boolean;
  coverUploadError: string | null;
  coverFileName: string;
  coverDragging: boolean;
  saveState: EditorSaveState;
  lastSavedAt: string | null;
  fullscreenMode: EditorFullscreenMode;
  recoveryMessage: string | null;
  hasRecoverySnapshot: boolean;
  actionError: string | null;
  previewBodyHtml: string;
  previewParagraphs: string[][];
  saveIndicatorText: string;
  previewSheetRef: RefObject<HTMLElement | null>;
  coverFileRef: RefObject<HTMLInputElement | null>;
  openEditorWithPost: (post: SystemOSPost | null, options?: OpenEditorOptions) => void;
  closeEditor: () => void;
  setActivePane: (pane: SystemOSEditorPane) => void;
  togglePreview: () => void;
  toggleEditorFullscreen: () => void;
  toggleBodyFullscreen: () => void;
  updateDraft: UpdateDraftField;
  setManualSlug: (value: boolean) => void;
  setActionErrorMessage: (value: string | null) => void;
  setCoverDragging: (value: boolean) => void;
  isFieldMissing: (fieldId: RequiredFieldId) => boolean;
  openRequiredField: (fieldId: RequiredFieldId) => void;
  saveSecondaryAction: () => Promise<void>;
  savePrimaryAction: () => Promise<void>;
  returnRevisionToDraftAction: () => Promise<void>;
  restoreRecoverySnapshot: () => void;
  dismissRecoverySnapshot: () => void;
  triggerCoverSelection: () => void;
  clearCover: () => void;
  loadCoverFile: (file?: File | null) => Promise<void>;
  uploadBodyImage?: (file: File) => Promise<string>;
  copyCurrentUrl: () => void;
  openCurrentPreview: () => void;
}

export interface RevisionSupport {
  isRevisionPost: (post?: Pick<SystemOSPost, 'revisionOf'> | null) => boolean;
  canApproveRevision: boolean;
  currentUserLabel: string;
  currentUserRole: string;
}

export interface CollectedDraftDataOptions {
  saveAsDraft?: boolean;
  forceStatus?: SystemOSPostStatus;
}

export interface LocalRevisionDraft extends SystemOSPost {
  revisionOf: number;
  revisionState: SystemOSRevisionState;
}
