import type { SystemOSEditorPane } from '../../types';
import type { EditorContext, EditorFullscreenMode, RequiredFieldStatus } from '../types/blogEditor.types';
import { BlogEditorControlIcon } from './BlogEditorIcons';

interface BlogEditorHeaderProps {
  editorContext: EditorContext;
  previewOnly: boolean;
  previewOpen: boolean;
  fullscreenMode: EditorFullscreenMode;
  guidance: RequiredFieldStatus;
  recoveryMessage: string | null;
  hasRecoverySnapshot: boolean;
  actionError: string | null;
  activePane: SystemOSEditorPane;
  saveIndicatorText: string;
  primaryDisabled: boolean;
  secondaryDisabled: boolean;
  onClose: () => void;
  onTogglePreview: () => void;
  onToggleEditorFullscreen: () => void;
  onSetPane: (pane: SystemOSEditorPane) => void;
  onOpenRequiredField: (fieldId: import('../types/blogEditor.types').RequiredFieldId) => void;
  onSaveSecondary: () => void;
  onSavePrimary: () => void;
  onReturnToDraft: () => void;
  onRestoreRecovery: () => void;
  onDismissRecovery: () => void;
}

export function BlogEditorHeader({
  editorContext,
  previewOnly,
  previewOpen,
  fullscreenMode,
  guidance,
  recoveryMessage,
  hasRecoverySnapshot,
  actionError,
  activePane,
  saveIndicatorText,
  primaryDisabled,
  secondaryDisabled,
  onClose,
  onTogglePreview,
  onToggleEditorFullscreen,
  onSetPane,
  onOpenRequiredField,
  onSaveSecondary,
  onSavePrimary,
  onReturnToDraft,
  onRestoreRecovery,
  onDismissRecovery,
}: BlogEditorHeaderProps) {
  const readinessItems = guidance.missing.length
    ? guidance.missing.slice(0, 4)
    : guidance.checks.filter((item) => item.done).slice(0, 2);
  const readinessSummary = guidance.missing.length
    ? `Next: ${guidance.missing.slice(0, 2).map((item) => item.label).join(', ')}.`
    : 'All key fields are ready for the primary publish action.';

  return (
    <div className="modal-head">
      <div className="modal-top">
        <div className="editor-head-copy">
          <button className="btn small editor-back" type="button" onClick={onClose}>
            <BlogEditorControlIcon name="back" />
            <span>Back to posts</span>
          </button>
          <div>
            <div className="modal-title" id="systemos-modal-title">{editorContext.title}</div>
            <div className="editor-head-meta">
              <div className="modal-sub">{editorContext.meta}</div>
              {!previewOnly ? <div className="editor-save-chip">{saveIndicatorText}</div> : null}
            </div>
          </div>
        </div>
        <div className="editor-head-actions">
          {!previewOnly ? (
            <div className="editor-action-cluster">
              <button className="btn subtle" type="button" onClick={onTogglePreview}>
                <BlogEditorControlIcon name="preview" />
                <span>{previewOpen ? 'Hide Preview' : 'Preview'}</span>
              </button>
              {editorContext.showReturn ? (
                <button className="btn subtle" type="button" onClick={onReturnToDraft}>
                  <BlogEditorControlIcon name="return" />
                  <span>Return to Draft</span>
                </button>
              ) : null}
              {editorContext.secondaryLabel ? (
                <button className="btn secondary" type="button" disabled={secondaryDisabled} onClick={onSaveSecondary}>
                  <BlogEditorControlIcon name="save" />
                  <span>{editorContext.secondaryLabel}</span>
                </button>
              ) : null}
              {editorContext.primaryLabel ? (
                <button className="btn primary" type="button" disabled={primaryDisabled} onClick={onSavePrimary}>
                  <BlogEditorControlIcon name={editorContext.primaryLabel.includes('Approve') ? 'approve' : 'publish'} />
                  <span>{editorContext.primaryLabel}</span>
                </button>
              ) : null}
              <button className="btn subtle" type="button" onClick={onToggleEditorFullscreen}>
                <span>{fullscreenMode === 'editor' ? 'Standard layout' : 'Expand'}</span>
              </button>
            </div>
          ) : null}
          <button className="btn icon" type="button" aria-label="Close" onClick={onClose}>
            <BlogEditorControlIcon name="close" />
          </button>
        </div>
      </div>

      <div className="editor-progress">
        <div className="editor-progress-top">
          <div className="editor-progress-copy-block">
            <div className="editor-progress-title">Publishing Readiness</div>
            <div className="editor-progress-copy">
              {guidance.complete} of {guidance.total} required fields complete.
            </div>
          </div>
          <div className="editor-progress-status">
            <div className="editor-progress-next">{readinessSummary}</div>
            <div className="editor-progress-score">{guidance.percent}%</div>
          </div>
        </div>
        <div className="editor-progress-bar">
          <span className="editor-progress-fill" style={{ width: `${guidance.percent}%` }} />
        </div>
        <div className="editor-checks">
          {readinessItems.map((item) => (
            <button
              key={item.id}
              className={`check-pill ${item.done ? 'done' : 'todo'}`}
              type="button"
              onClick={() => onOpenRequiredField(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
          {guidance.missing.length > readinessItems.length ? (
            <span className="editor-checks-note">+{guidance.missing.length - readinessItems.length} more</span>
          ) : null}
        </div>
      </div>

      {recoveryMessage ? (
        <div className="editor-note">
          <div>{recoveryMessage}</div>
          {hasRecoverySnapshot ? (
            <div className="editor-note-actions">
              <button className="btn subtle small" type="button" onClick={onDismissRecovery}>
                Dismiss
              </button>
              <button className="btn secondary small" type="button" onClick={onRestoreRecovery}>
                Restore draft
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {actionError ? <div className="editor-alert">{actionError}</div> : null}

      <div className="modal-tabs">
        {(['basics', 'content', 'publishing', 'seo'] as const).map((pane) => (
          <button
            key={pane}
            className={`modal-tab ${activePane === pane ? 'active' : ''}`}
            type="button"
            onClick={() => onSetPane(pane)}
          >
            {pane[0].toUpperCase() + pane.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
