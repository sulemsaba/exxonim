import type { SystemOSPost } from '../../types';
import type { UpdateDraftField } from '../types/blogEditor.types';

interface BlogEditorSeoProps {
  draft: SystemOSPost;
  fieldsDisabled: boolean;
  updateDraft: UpdateDraftField;
}

export function BlogEditorSeo({ draft, fieldsDisabled, updateDraft }: BlogEditorSeoProps) {
  return (
    <section className="modal-section editor-section editor-section--inspector editor-section--seo">
      <div className="section-head">
        <div className="section-title">Search Metadata</div>
        <div className="section-note">Review search copy before saving so SEO stays clean and intentional.</div>
      </div>
      <div className="form-grid">
        <div className="form-col-2">
          <label className="label" htmlFor="postMetaTitle">Meta title</label>
          <input className="field" id="postMetaTitle" placeholder="SEO title" value={draft.metaTitle} disabled={fieldsDisabled} onChange={(event) => updateDraft('metaTitle', event.target.value)} />
        </div>
        <div className="form-col-2">
          <label className="label" htmlFor="postMetaDescription">Meta description</label>
          <textarea className="textarea" id="postMetaDescription" style={{ minHeight: 110 }} placeholder="Explain the page in one concise paragraph." value={draft.metaDescription} disabled={fieldsDisabled} onChange={(event) => updateDraft('metaDescription', event.target.value)} />
        </div>
      </div>
    </section>
  );
}
