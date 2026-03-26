import { useEffect, useRef, useState } from 'react';

import type { EditorFullscreenMode } from '../types/blogEditor.types';
import { hasHtmlMarkup, sanitizeRichHtml } from '../helpers/blogEditorMappers';

interface RichTextBodyEditorProps {
  id: string;
  value: string;
  disabled: boolean;
  invalid: boolean;
  uploadDisabled: boolean;
  fullscreenMode: EditorFullscreenMode;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onToggleBodyFullscreen: () => void;
}

function RichTextBodyEditor({
  id,
  value,
  disabled,
  invalid,
  uploadDisabled,
  fullscreenMode,
  onChange,
  onUploadImage,
  onToggleBodyFullscreen,
}: RichTextBodyEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRangeRef = useRef<Range | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const [linkDraft, setLinkDraft] = useState('');
  const [linkMode, setLinkMode] = useState(false);

  function updateActiveFormats() {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      unordered: document.queryCommandState('insertUnorderedList'),
      ordered: document.queryCommandState('insertOrderedList'),
    });
  }

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextValue = hasHtmlMarkup(value) ? sanitizeRichHtml(value) : value;
    const currentValue = editor.innerHTML;
    const normalizedCurrent = currentValue.replace(/<br>$/i, '').trim();
    const normalizedNext = nextValue.trim();
    if (normalizedCurrent !== normalizedNext) {
      editor.innerHTML = normalizedNext;
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection?.anchorNode) return;
      if (editorRef.current.contains(selection.anchorNode)) {
        updateActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function captureSelectionRange() {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      selectionRangeRef.current = null;
      return;
    }
    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRangeRef.current = null;
      return;
    }
    selectionRangeRef.current = range.cloneRange();
  }

  function restoreSelectionRange() {
    if (!selectionRangeRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(selectionRangeRef.current);
  }

  function runCommand(command: string, commandValue?: string) {
    focusEditor();
    document.execCommand(command, false, commandValue);
    onChange(sanitizeRichHtml(editorRef.current?.innerHTML || ''));
  }

  function openLinkComposer() {
    if (disabled) return;
    captureSelectionRange();
    setLinkDraft('');
    setLinkMode(true);
    window.setTimeout(() => linkInputRef.current?.focus(), 30);
  }

  function closeLinkComposer() {
    setLinkMode(false);
    setLinkDraft('');
    focusEditor();
  }

  function applyLink() {
    const href = linkDraft.trim();
    if (!href) {
      closeLinkComposer();
      return;
    }
    restoreSelectionRange();
    runCommand('createLink', href);
    closeLinkComposer();
  }

  async function handleImageSelection(file?: File | null) {
    if (!file || !onUploadImage) return;
    setIsUploading(true);
    try {
      const uploadedUrl = await onUploadImage(file);
      runCommand('insertImage', uploadedUrl);
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className={`rich-editor ${invalid ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''} ${fullscreenMode === 'body' ? 'is-body-fullscreen' : ''}`}>
      <div className="rich-toolbar">
        <div className="rich-toolbar-group">
          <button type="button" className="rich-btn" onClick={() => runCommand('formatBlock', '<p>')} disabled={disabled}>Paragraph</button>
          <button type="button" className="rich-btn" onClick={() => runCommand('formatBlock', '<h2>')} disabled={disabled}>Heading</button>
        </div>
        <div className="rich-toolbar-group">
          <button type="button" className={`rich-btn ${activeFormats.bold ? 'is-active' : ''}`} onClick={() => runCommand('bold')} disabled={disabled}><strong>B</strong></button>
          <button type="button" className={`rich-btn ${activeFormats.italic ? 'is-active' : ''}`} onClick={() => runCommand('italic')} disabled={disabled}><em>I</em></button>
          <button type="button" className={`rich-btn ${activeFormats.unordered ? 'is-active' : ''}`} onClick={() => runCommand('insertUnorderedList')} disabled={disabled}>Bullet List</button>
          <button type="button" className={`rich-btn ${activeFormats.ordered ? 'is-active' : ''}`} onClick={() => runCommand('insertOrderedList')} disabled={disabled}>Numbered List</button>
          <button type="button" className="rich-btn" onClick={() => runCommand('formatBlock', '<blockquote>')} disabled={disabled}>Quote</button>
        </div>
        <div className="rich-toolbar-group rich-toolbar-group--end">
          <button type="button" className="rich-btn" onClick={openLinkComposer} disabled={disabled}>
            Link
          </button>
          <button type="button" className="rich-btn" onClick={() => fileRef.current?.click()} disabled={disabled || uploadDisabled || isUploading || !onUploadImage}>
            {isUploading ? 'Uploading...' : 'Image'}
          </button>
          <button type="button" className="rich-btn" onClick={onToggleBodyFullscreen} disabled={disabled}>
            {fullscreenMode === 'body' ? 'Exit focus' : 'Focus mode'}
          </button>
        </div>
      </div>
      {linkMode ? (
        <div className="rich-link-row">
          <input
            ref={linkInputRef}
            className="field rich-link-input"
            type="url"
            placeholder="Paste a URL"
            value={linkDraft}
            onChange={(event) => setLinkDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyLink();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                closeLinkComposer();
              }
            }}
            disabled={disabled}
          />
          <button type="button" className="btn secondary small" onClick={applyLink} disabled={disabled || !linkDraft.trim()}>
            Apply link
          </button>
          <button type="button" className="btn subtle small" onClick={closeLinkComposer}>
            Cancel
          </button>
        </div>
      ) : null}
      <div
        id={id}
        ref={editorRef}
        className="rich-surface"
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={() => onChange(sanitizeRichHtml(editorRef.current?.innerHTML || ''))}
        data-placeholder="Start writing the article body here..."
      />
      <input ref={fileRef} className="hidden-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void handleImageSelection(event.target.files?.[0])} />
    </div>
  );
}

interface BlogEditorContentProps {
  body: string;
  fieldsDisabled: boolean;
  invalid: boolean;
  isActionPending: boolean;
  isCoverUploading: boolean;
  fullscreenMode: EditorFullscreenMode;
  onBodyChange: (value: string) => void;
  onToggleBodyFullscreen: () => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function BlogEditorContent({
  body,
  fieldsDisabled,
  invalid,
  isActionPending,
  isCoverUploading,
  fullscreenMode,
  onBodyChange,
  onToggleBodyFullscreen,
  onUploadImage,
}: BlogEditorContentProps) {
  return (
    <section className="modal-section editor-section editor-section--content">
      <div className="section-head">
        <div className="section-title">Article Body</div>
        <div className="section-note">Draft the main story here. Paragraph spacing in preview mode mirrors the reading layout.</div>
      </div>
      <div className="form-grid">
        <div className="form-col-2">
          <label className={`label ${!fieldsDisabled && invalid ? 'label-missing' : ''}`} htmlFor="postBody">
            Body content <span className="required-tag">Required</span>
          </label>
          <RichTextBodyEditor
            id="postBody"
            value={body}
            disabled={fieldsDisabled}
            invalid={invalid}
            uploadDisabled={isActionPending || isCoverUploading}
            fullscreenMode={fullscreenMode}
            onChange={onBodyChange}
            onToggleBodyFullscreen={onToggleBodyFullscreen}
            onUploadImage={onUploadImage}
          />
          <div className="help">Use headings, lists, links, and inline images. Uploaded images are inserted at the cursor position.</div>
        </div>
      </div>
    </section>
  );
}
