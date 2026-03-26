import type { RefObject } from 'react';

import { BlogEditorControlIcon } from './BlogEditorIcons';

interface BlogEditorCoverUploadProps {
  cover: string;
  coverFileName: string;
  coverDragging: boolean;
  coverUploadError: string | null;
  readOnly: boolean;
  isActionPending: boolean;
  isCoverUploading: boolean;
  isMissing: boolean;
  coverFileRef: RefObject<HTMLInputElement | null>;
  setCoverDragging: (value: boolean) => void;
  onCoverChange: (value: string) => void;
  onTriggerCoverSelection: () => void;
  onLoadCoverFile: (file?: File | null) => Promise<void>;
  onClearCover: () => void;
}

export function BlogEditorCoverUpload({
  cover,
  coverFileName,
  coverDragging,
  coverUploadError,
  readOnly,
  isActionPending,
  isCoverUploading,
  isMissing,
  coverFileRef,
  setCoverDragging,
  onCoverChange,
  onTriggerCoverSelection,
  onLoadCoverFile,
  onClearCover,
}: BlogEditorCoverUploadProps) {
  return (
    <section className="modal-section editor-section editor-section--cover">
      <div className="section-head">
        <div className="section-title">Cover</div>
        <div className="section-note">Use a strong image so preview mode feels like the real public article.</div>
      </div>
      <div className="form-grid">
        <div className="form-col-2">
          <label className={`label ${!readOnly && isMissing ? 'label-missing' : ''}`} htmlFor="postCover">
            Cover image <span className="required-tag">Required</span>
          </label>
          <input
            className={`field ${!readOnly && isMissing ? 'field-missing' : ''}`}
            id="postCover"
            placeholder="Paste a hosted image URL"
            value={cover}
            disabled={readOnly}
            onChange={(event) => onCoverChange(event.target.value)}
          />
          <div className="help">Paste a hosted URL, upload from device, or drag and drop directly into the preview panel.</div>
        </div>
        <div className="form-col-2">
          <div
            className={`cover-box cover-drop ${coverDragging ? 'dragging' : ''} ${readOnly ? 'is-disabled' : ''}`}
            role="button"
            tabIndex={0}
            aria-label="Upload cover image"
            aria-disabled={readOnly || isActionPending || isCoverUploading}
            onClick={onTriggerCoverSelection}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && !readOnly) {
                event.preventDefault();
                onTriggerCoverSelection();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!readOnly && !isActionPending && !isCoverUploading) setCoverDragging(true);
            }}
            onDragLeave={() => setCoverDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setCoverDragging(false);
              if (!readOnly && !isActionPending && !isCoverUploading) void onLoadCoverFile(event.dataTransfer.files?.[0]);
            }}
          >
            {cover ? (
              <div className="cover-preview">
                <img src={cover} alt="Cover preview" />
                <div className="cover-preview-meta">
                  <span>{coverFileName || 'Remote image URL'}</span>
                  <span>16:9 recommended</span>
                </div>
              </div>
            ) : (
              <div className="cover-placeholder">
                <BlogEditorControlIcon name="upload" />
                <strong>Drop a cover image here</strong>
                <span>Choose from device or paste an image URL below. Recommended 1600 x 900 px, max 4 MB.</span>
              </div>
            )}
          </div>
          <input
            ref={(node) => {
              (coverFileRef as { current: HTMLInputElement | null }).current = node;
            }}
            className="hidden-file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => void onLoadCoverFile(event.target.files?.[0])}
          />
          <div className="cover-actions">
            <button className="btn small" type="button" onClick={onTriggerCoverSelection} disabled={readOnly || isActionPending || isCoverUploading}>
              <BlogEditorControlIcon name="upload" />
              <span>{isCoverUploading ? 'Uploading...' : 'Select from device'}</span>
            </button>
            <button className="btn small" type="button" onClick={onClearCover} disabled={readOnly || isActionPending || isCoverUploading || !cover}>
              Clear image
            </button>
          </div>
          <div className="help">Recommended 1600 x 900 px. JPG, PNG, or WebP. Maximum 4 MB.</div>
          {coverUploadError ? <div className="editor-inline-error">{coverUploadError}</div> : null}
        </div>
      </div>
    </section>
  );
}
