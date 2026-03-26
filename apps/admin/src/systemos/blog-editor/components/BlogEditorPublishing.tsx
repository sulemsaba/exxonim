import type { SystemOSPost, SystemOSPostStatus } from '../../types';
import { toLocalInput } from '../helpers/blogEditorMappers';
import { BlogEditorControlIcon } from './BlogEditorIcons';
import type { CoverSummary, UpdateDraftField } from '../types/blogEditor.types';

interface BlogEditorPublishingProps {
  draft: SystemOSPost;
  coverMeta: CoverSummary;
  currentPreviewUrl: string;
  fieldsDisabled: boolean;
  readOnly: boolean;
  isPublishDateMissing: boolean;
  updateDraft: UpdateDraftField;
  onCopyCurrentUrl: () => void;
  onOpenCurrentPreview: () => void;
}

export function BlogEditorPublishing({
  draft,
  coverMeta,
  currentPreviewUrl,
  fieldsDisabled,
  readOnly,
  isPublishDateMissing,
  updateDraft,
  onCopyCurrentUrl,
  onOpenCurrentPreview,
}: BlogEditorPublishingProps) {
  return (
    <>
      <section className="modal-section editor-section editor-section--inspector editor-section--publishing">
        <div className="section-head">
          <div className="section-title">Publishing Summary</div>
          <div className="section-note">Keep the URL, cover, and release state visible before the final action.</div>
        </div>
        <div className="summary-grid publish-summary-grid">
          <article className="summary-card publish-summary-item">
            <div className="summary-label">Preview URL</div>
            <div className="summary-value">{currentPreviewUrl}</div>
            <div className="summary-note">Use this path as the public permalink once the article goes live.</div>
          </article>
          <article className="summary-card publish-summary-item">
            <div className="summary-label">Cover Image</div>
            <div className="summary-value">{coverMeta.state}</div>
            <div className="summary-note">{coverMeta.note}</div>
          </article>
        </div>
        <div className="summary-actions">
          <button className="btn small" type="button" onClick={onCopyCurrentUrl}>
            <BlogEditorControlIcon name="copy" />
            <span>Copy URL</span>
          </button>
          <button className="btn small" type="button" onClick={onOpenCurrentPreview}>
            <BlogEditorControlIcon name="preview" />
            <span>Open Preview</span>
          </button>
        </div>
      </section>

      <section className="modal-section editor-section editor-section--inspector editor-section--release">
        <div className="section-head">
          <div className="section-title">Release Control</div>
          <div className="section-note">Set publication state and timing without crowding the rest of the editor.</div>
        </div>
        <div className="form-grid">
          <div>
            <label className="label" htmlFor="postStatus">Status</label>
            <select className="select" id="postStatus" value={draft.status} disabled={fieldsDisabled} onChange={(event) => updateDraft('status', event.target.value as SystemOSPostStatus)}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="trash">Trash</option>
            </select>
          </div>
          <div>
            <label className={`label ${!readOnly && isPublishDateMissing ? 'label-missing' : ''}`} htmlFor="postPublishDate">
              Publish date <span className="required-tag">When Scheduled</span>
            </label>
            <input
              className={`field ${!readOnly && isPublishDateMissing ? 'field-missing' : ''}`}
              id="postPublishDate"
              type="datetime-local"
              value={toLocalInput(draft.status === 'scheduled' ? draft.scheduledFor : draft.publishedAt)}
              disabled={fieldsDisabled}
              onChange={(event) => {
                const value = event.target.value ? new Date(event.target.value).toISOString() : '';
                if (draft.status === 'scheduled') updateDraft('scheduledFor', value);
                else updateDraft('publishedAt', value);
              }}
            />
          </div>
          <div>
            <label className="label" htmlFor="postFeaturedSlot">Top blog placement</label>
            <select
              className="select"
              id="postFeaturedSlot"
              value={draft.featuredSlot || ''}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('featuredSlot', event.target.value)}
            >
              <option value="">Standard grid only</option>
              <option value="hero">Hero post</option>
              <option value="popular">Top rail 1</option>
              <option value="editors-pick">Top rail 2</option>
            </select>
            <div className="help">Choose where this article appears in the public top section.</div>
          </div>
          <div>
            <label className="label" htmlFor="postFeaturedHome">Homepage feature</label>
            <select
              className="select"
              id="postFeaturedHome"
              value={draft.featuredOnHome ? 'yes' : 'no'}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('featuredOnHome', event.target.value === 'yes')}
            >
              <option value="no">Do not feature on home</option>
              <option value="yes">Feature on home</option>
            </select>
            <div className="help">Keep this on only for posts that should appear in the homepage blog section.</div>
          </div>
        </div>
      </section>

      <section className="modal-section editor-section editor-section--inspector editor-section--notes">
        <div className="section-head">
          <div className="section-title">Internal Notes</div>
          <div className="section-note">Keep team-only context separate from the public article preview.</div>
        </div>
        <div className="form-grid">
          <div className="form-col-2">
            <label className="label" htmlFor="postNote">Internal note</label>
            <textarea className="textarea" id="postNote" style={{ minHeight: 110 }} placeholder="Optional editorial notes for the team." value={draft.note} disabled={fieldsDisabled} onChange={(event) => updateDraft('note', event.target.value)} />
          </div>
        </div>
      </section>
    </>
  );
}
