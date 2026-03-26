import type { RefObject } from 'react';

import type { SystemOSPost } from '../../types';
import type { UpdateDraftField } from '../types/blogEditor.types';
import { BlogEditorCoverUpload } from './BlogEditorCoverUpload';

interface BlogEditorBasicsProps {
  draft: SystemOSPost;
  categoryOptions: string[];
  authorOptions: string[];
  fieldsDisabled: boolean;
  isActionPending: boolean;
  isCoverUploading: boolean;
  coverDragging: boolean;
  coverUploadError: string | null;
  coverFileName: string;
  coverFileRef: RefObject<HTMLInputElement | null>;
  updateDraft: UpdateDraftField;
  isFieldMissing: (fieldId: import('../types/blogEditor.types').RequiredFieldId) => boolean;
  setManualSlug: (value: boolean) => void;
  setCoverDragging: (value: boolean) => void;
  onTriggerCoverSelection: () => void;
  onLoadCoverFile: (file?: File | null) => Promise<void>;
  onClearCover: () => void;
}

export function BlogEditorBasics({
  draft,
  categoryOptions,
  authorOptions,
  fieldsDisabled,
  isActionPending,
  isCoverUploading,
  coverDragging,
  coverUploadError,
  coverFileName,
  coverFileRef,
  updateDraft,
  isFieldMissing,
  setManualSlug,
  setCoverDragging,
  onTriggerCoverSelection,
  onLoadCoverFile,
  onClearCover,
}: BlogEditorBasicsProps) {
  return (
    <>
      <section className="modal-section editor-section editor-section--basics">
        <div className="section-head">
          <div className="section-title">Post Basics</div>
          <div className="section-note">Complete title, intro, and first section to unlock a ready-to-publish draft.</div>
        </div>
        <div className="editor-basics-flow">
          <div className="editor-title-block">
            <label className={`label ${!fieldsDisabled && isFieldMissing('postTitle') ? 'label-missing' : ''}`} htmlFor="postTitle">
              Title <span className="required-tag">Required</span>
            </label>
            <input
              className={`field editor-title-input ${!fieldsDisabled && isFieldMissing('postTitle') ? 'field-missing' : ''}`}
              id="postTitle"
              placeholder="Working title"
              value={draft.title}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('title', event.target.value)}
            />
          </div>
          <div className="editor-excerpt-block">
            <label className={`label ${!fieldsDisabled && isFieldMissing('postExcerpt') ? 'label-missing' : ''}`} htmlFor="postExcerpt">
              Excerpt <span className="required-tag">Required</span>
            </label>
            <textarea
              className={`textarea editor-excerpt-input ${!fieldsDisabled && isFieldMissing('postExcerpt') ? 'field-missing' : ''}`}
              id="postExcerpt"
              style={{ minHeight: 116 }}
              placeholder="A short summary that explains why the article matters."
              value={draft.excerpt}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('excerpt', event.target.value)}
            />
          </div>
          <div className="form-grid editor-basics-grid">
            <div className="form-col-2">
            <label className={`label ${!fieldsDisabled && isFieldMissing('postSlug') ? 'label-missing' : ''}`} htmlFor="postSlug">
              Slug <span className="required-tag">Required</span>
            </label>
            <input
              className={`field ${!fieldsDisabled && isFieldMissing('postSlug') ? 'field-missing' : ''}`}
              id="postSlug"
              placeholder="post-slug"
              value={draft.slug}
              disabled={fieldsDisabled}
              onChange={(event) => {
                setManualSlug(true);
                updateDraft('slug', event.target.value);
              }}
            />
          </div>
          <div>
            <label className={`label ${!fieldsDisabled && isFieldMissing('postCategory') ? 'label-missing' : ''}`} htmlFor="postCategory">
              Category <span className="required-tag">Required</span>
            </label>
            <select
              className={`select ${!fieldsDisabled && isFieldMissing('postCategory') ? 'field-missing' : ''}`}
              id="postCategory"
              value={draft.category}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('category', event.target.value)}
            >
              <option value="">Select category</option>
              {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={`label ${!fieldsDisabled && isFieldMissing('postAuthor') ? 'label-missing' : ''}`} htmlFor="postAuthor">
              Author <span className="required-tag">Required</span>
            </label>
            <select
              className={`select ${!fieldsDisabled && isFieldMissing('postAuthor') ? 'field-missing' : ''}`}
              id="postAuthor"
              value={draft.author}
              disabled={fieldsDisabled}
              onChange={(event) => updateDraft('author', event.target.value)}
            >
              <option value="">Select author</option>
              {authorOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="postReadingTime">Reading time</label>
            <input className="field" id="postReadingTime" placeholder="5 min read" value={draft.readTime} disabled={fieldsDisabled} onChange={(event) => updateDraft('readTime', event.target.value)} />
          </div>
          </div>
        </div>
      </section>

      <BlogEditorCoverUpload
        cover={draft.cover}
        coverFileName={coverFileName}
        coverDragging={coverDragging}
        coverUploadError={coverUploadError}
        readOnly={fieldsDisabled}
        isActionPending={isActionPending}
        isCoverUploading={isCoverUploading}
        isMissing={isFieldMissing('postCover')}
        coverFileRef={coverFileRef}
        setCoverDragging={setCoverDragging}
        onCoverChange={(value) => {
          updateDraft('cover', value);
        }}
        onTriggerCoverSelection={onTriggerCoverSelection}
        onLoadCoverFile={onLoadCoverFile}
        onClearCover={onClearCover}
      />
    </>
  );
}
