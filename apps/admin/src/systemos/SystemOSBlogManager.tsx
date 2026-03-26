import { useEffect, useMemo, useState } from 'react';

import type {
  SystemOSBlogManagerProps,
  SystemOSEditorPane,
  SystemOSPost,
  SystemOSPostStatus,
  SystemOSRevisionState,
  SystemOSViewMode,
} from './types';
import {
  applyStatusChange,
  createCounts,
  filterPosts,
  formatDate,
  nextScheduled,
  paginatePosts,
  relativeTime,
  statusClass,
  uniqueValues,
} from './utils';
import { BlogEditorBasics } from './blog-editor/components/BlogEditorBasics';
import { BlogEditorContent } from './blog-editor/components/BlogEditorContent';
import { BlogEditorHeader } from './blog-editor/components/BlogEditorHeader';
import { BlogEditorControlIcon } from './blog-editor/components/BlogEditorIcons';
import { BlogEditorPublishing } from './blog-editor/components/BlogEditorPublishing';
import { BlogEditorSeo } from './blog-editor/components/BlogEditorSeo';
import { buildDuplicateDraft, buildLocalRevision } from './blog-editor/helpers/blogEditorDraft';
import { buildRequiredFieldStatus, getFieldPane } from './blog-editor/helpers/blogEditorValidation';
import { useBlogEditorState } from './blog-editor/hooks/useBlogEditorState';

type BlogTab = 'all' | SystemOSPostStatus;
type BlogSort = 'newest' | 'oldest' | 'views' | 'az';

function renderPostActionIcon(name: 'preview' | 'edit' | 'duplicate' | 'trash') {
  if (name === 'edit') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 20 4.5-1 9.5-9.5-3.5-3.5L5 15.5 4 20Z" />
        <path d="m13.5 6 3.5 3.5" />
      </svg>
    );
  }

  if (name === 'duplicate') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
      </svg>
    );
  }

  if (name === 'trash') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 12h10l1-12" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function isLivePost(post: SystemOSPost) {
  return !post.revisionOf && (post.status === 'published' || post.status === 'scheduled');
}

function getOpenRevision(posts: SystemOSPost[], post: SystemOSPost) {
  if (post.openRevisionId) {
    const direct = posts.find((item) => item.id === post.openRevisionId);
    if (direct) return direct;
  }
  return posts.find((item) => item.revisionOf === post.id) ?? null;
}

function getOpenRevisionState(posts: SystemOSPost[], post: SystemOSPost): SystemOSRevisionState {
  return getOpenRevision(posts, post)?.revisionState ?? post.openRevisionState ?? '';
}

function hasOpenRevision(posts: SystemOSPost[], post: SystemOSPost) {
  return Boolean(getOpenRevision(posts, post));
}

function getRevisionStateLabel(state?: SystemOSRevisionState) {
  return state === 'ready_for_review' ? 'Ready for approval' : 'Working revision';
}

function getEditLabel(posts: SystemOSPost[], post: SystemOSPost) {
  if (post.revisionOf) return post.revisionState === 'ready_for_review' ? 'Review revision' : 'Resume revision';
  if (hasOpenRevision(posts, post)) return 'Resume revision';
  if (isLivePost(post)) return 'Edit with revision';
  return post.status === 'draft' ? 'Edit draft' : 'Edit post';
}

export function SystemOSBlogManager({
  posts,
  onPostsChange,
  categories: categoriesProp,
  authors: authorsProp,
  command,
  onCloseEditor,
  onRequestNew,
  onRequestEdit,
  currentUserLabel = 'Administrator',
  currentUserRole = 'admin',
  onUploadCover,
  onSavePost,
  onSubmitRevision,
  onApproveRevision,
  onReturnRevisionToDraft,
  workspaceNotice,
  onDismissWorkspaceNotice,
}: SystemOSBlogManagerProps) {
  const [tab, setTab] = useState<BlogTab>('all');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | SystemOSPostStatus>('all');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [sort, setSort] = useState<BlogSort>('newest');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<SystemOSViewMode>('table');
  const [isMobile, setIsMobile] = useState(false);

  const editor = useBlogEditorState({
    posts,
    onPostsChange,
    categories: categoriesProp?.length ? categoriesProp : uniqueValues(posts, 'category'),
    authors: authorsProp?.length ? authorsProp : uniqueValues(posts, 'author'),
    currentUserLabel,
    currentUserRole,
    onCloseEditor,
    onUploadCover,
    onSavePost,
    onSubmitRevision,
    onApproveRevision,
    onReturnRevisionToDraft,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const updateViewport = () => setIsMobile(window.innerWidth <= 760);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const displayPosts = useMemo(() => posts.filter((post) => !post.revisionOf), [posts]);
  const counts = useMemo(() => createCounts(posts), [posts]);
  const scheduledNext = useMemo(() => nextScheduled(displayPosts), [displayPosts]);
  const categories = useMemo(
    () => (categoriesProp?.length ? categoriesProp : uniqueValues(displayPosts, 'category')),
    [categoriesProp, displayPosts],
  );
  const authors = useMemo(
    () => (authorsProp?.length ? authorsProp : uniqueValues(displayPosts, 'author')),
    [authorsProp, displayPosts],
  );
  const filtered = useMemo(
    () =>
      filterPosts(posts, {
        tab,
        status,
        category,
        author,
        query,
        sort,
      }),
    [posts, tab, status, category, author, query, sort],
  );
  const pagination = useMemo(() => paginatePosts(filtered, page, 8), [filtered, page]);
  const rows = pagination.rows;
  const showTable = !isMobile && view === 'table';
  const showCards = isMobile || view === 'cards';
  const empty = filtered.length === 0;

  useEffect(() => {
    if (pagination.page !== page) {
      setPage(pagination.page);
    }
  }, [pagination.page, page]);

  function clearFilters() {
    setTab('all');
    setQuery('');
    setStatus('all');
    setCategory('all');
    setAuthor('all');
    setSort('newest');
    setPage(1);
  }

  function handleNewRequest() {
    if (onRequestNew) {
      onRequestNew();
      return;
    }
    editor.openEditorWithPost(null);
  }

  function handleEditRequest(post: SystemOSPost, pane: SystemOSEditorPane = 'basics') {
    if (onRequestEdit) {
      onRequestEdit(post.id);
      return;
    }

    if (isLivePost(post)) {
      const existingRevision = getOpenRevision(posts, post);
      if (existingRevision) {
        editor.openEditorWithPost(existingRevision, { pane });
        return;
      }

      const revision = buildLocalRevision(post);
      onPostsChange([
        revision,
        ...posts.map((item) =>
          item.id === post.id
            ? { ...item, openRevisionId: revision.id, openRevisionState: revision.revisionState ?? 'working' }
            : item,
        ),
      ]);
      editor.openEditorWithPost(revision, { pane });
      return;
    }

    editor.openEditorWithPost(post, { pane });
  }

  function openPostPreview(post: SystemOSPost) {
    editor.openEditorWithPost(post, { pane: 'content', preview: true, readOnlyPreview: true });
  }

  function duplicatePost(source: SystemOSPost) {
    const duplicate = buildDuplicateDraft(source, posts);
    onPostsChange([duplicate, ...posts]);
    editor.openEditorWithPost(duplicate);
  }

  function updateInlineTitle(post: SystemOSPost, title: string) {
    const nextTitle = title.trim();
    if (!nextTitle || nextTitle === post.title) return;
    onPostsChange(
      posts.map((item) =>
        item.id === post.id ? { ...item, title: nextTitle, updated: new Date().toISOString() } : item,
      ),
    );
  }

  function moveStatus(post: SystemOSPost, nextStatus: SystemOSPostStatus) {
    const candidate = applyStatusChange(post, nextStatus);
    if (nextStatus === 'published' || nextStatus === 'scheduled') {
      const readiness = buildRequiredFieldStatus(candidate);
      if (readiness.missing.length > 0) {
        const firstMissing = readiness.missing[0];
        editor.openEditorWithPost(candidate, { pane: getFieldPane(firstMissing.id) });
        editor.setActionErrorMessage(
          `This post is not ready for ${nextStatus}. Complete ${readiness.missing
            .map((item) => item.label.toLowerCase())
            .slice(0, 3)
            .join(', ')} first.`,
        );
        return;
      }
    }

    onPostsChange(posts.map((item) => (item.id === post.id ? candidate : item)));
  }

  useEffect(() => {
    if (!command) return;

    if (command.type === 'showTrending') {
      setTab('published');
      setSort('views');
      setPage(1);
      return;
    }

    if (command.type === 'new') {
      handleNewRequest();
      return;
    }

    if (typeof command.postId !== 'number') return;
    const target = posts.find((post) => post.id === command.postId) ?? null;
    if (!target) return;

    if (command.type === 'preview') {
      editor.openEditorWithPost(target, {
        pane: command.pane ?? 'content',
        preview: true,
        readOnlyPreview: true,
      });
      return;
    }

    if (command.type === 'edit') {
      if (onRequestEdit) {
        editor.openEditorWithPost(target, { pane: command.pane ?? 'basics' });
        return;
      }
      handleEditRequest(target, command.pane ?? 'basics');
    }
  }, [command?.id]);

  function renderRow(post: SystemOSPost) {
    const revisionState = getOpenRevisionState(posts, post);
    return (
      <tr key={post.id}>
        <td>
          <button className="title-btn" type="button" onClick={() => handleEditRequest(post)}>
            {post.title || 'Untitled draft'}
          </button>
          <div className="subtext">/{post.slug || 'untitled-post'}</div>
          <div className="row-excerpt">{post.excerpt || 'Add a short summary so the card is not empty.'}</div>
          <div className="meta-line">
            <span>{post.readTime || 'Not set'}</span>
            <span>&middot;</span>
            <span>{post.views.toLocaleString()} views</span>
          </div>
          {isLivePost(post) && revisionState ? (
            <div className={`revision-pill ${revisionState === 'ready_for_review' ? 'ready' : 'working'}`}>
              {getRevisionStateLabel(revisionState)}
            </div>
          ) : null}
          <div className="quick-edit">
            <input
              className="inline-input"
              defaultValue={post.title}
              aria-label="Edit title"
              onBlur={(event) => updateInlineTitle(post, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  (event.currentTarget as HTMLInputElement).blur();
                }
              }}
            />
            <select
              className="inline-select"
              aria-label="Change status"
              value={post.status}
              onChange={(event) => moveStatus(post, event.target.value as SystemOSPostStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="trash">Trash</option>
            </select>
          </div>
        </td>
        <td><span className="tag">{post.category || 'Uncategorized'}</span></td>
        <td>
          <div className="author">
            <span className="author-mark">
              {(post.author || 'AU')
                .split(' ')
                .map((item) => item[0] || '')
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div>
              <div>{post.author || 'Unassigned'}</div>
              <div className="subtext">{post.featuredSlot || 'Standard grid'}</div>
            </div>
          </div>
        </td>
        <td>
          <span className={`status ${statusClass(post.status)}`}>
            <span className="dot" />
            <span>{post.status}</span>
          </span>
        </td>
        <td>
          <div>{formatDate(post.updated)}</div>
          <div className="subtext">{relativeTime(post.updated)}</div>
        </td>
        <td className="post-actions-cell">
          <div className="post-action-bar">
            <button
              className="post-action-btn preview"
              type="button"
              title="Preview"
              aria-label="Preview"
              onClick={() => openPostPreview(post)}
            >
              {renderPostActionIcon('preview')}
            </button>
            <button
              className="post-action-btn edit"
              type="button"
              title={getEditLabel(posts, post)}
              aria-label={getEditLabel(posts, post)}
              onClick={() => handleEditRequest(post)}
            >
              {renderPostActionIcon('edit')}
            </button>
            <button
              className="post-action-btn duplicate"
              type="button"
              title="Duplicate"
              aria-label="Duplicate"
              onClick={() => duplicatePost(post)}
            >
              {renderPostActionIcon('duplicate')}
            </button>
            <button
              className="post-action-btn trash"
              type="button"
              title="Move to trash"
              aria-label="Move to trash"
              onClick={() => moveStatus(post, 'trash')}
            >
              {renderPostActionIcon('trash')}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  function renderCard(post: SystemOSPost) {
    const revisionState = getOpenRevisionState(posts, post);
    return (
      <article className="card post-card" key={post.id}>
        <div className="post-card-head">
          <div>
            <button className="title-btn" type="button" onClick={() => handleEditRequest(post)}>
              {post.title || 'Untitled draft'}
            </button>
            <div className="subtext">/{post.slug || 'untitled-post'}</div>
          </div>
          <span className={`status ${statusClass(post.status)}`}>
            <span className="dot" />
            <span>{post.status}</span>
          </span>
        </div>
        <div className="meta-line">
          <span>{post.category || 'Uncategorized'}</span>
          <span>&middot;</span>
          <span>{post.author || 'Unassigned'}</span>
          <span>&middot;</span>
          <span>{relativeTime(post.updated)}</span>
        </div>
        <div className="row-excerpt">{post.excerpt || 'Add a short summary so the card is not empty.'}</div>
        {isLivePost(post) && revisionState ? (
          <div className={`revision-pill ${revisionState === 'ready_for_review' ? 'ready' : 'working'}`}>
            {getRevisionStateLabel(revisionState)}
          </div>
        ) : null}
        <div className="post-card-actions">
          <button className="post-action-btn preview" type="button" aria-label="Preview" title="Preview" onClick={() => openPostPreview(post)}>
            {renderPostActionIcon('preview')}
          </button>
          <button className="post-action-btn edit" type="button" aria-label={getEditLabel(posts, post)} title={getEditLabel(posts, post)} onClick={() => handleEditRequest(post)}>
            {renderPostActionIcon('edit')}
          </button>
          <button className="post-action-btn duplicate" type="button" aria-label="Duplicate" title="Duplicate" onClick={() => duplicatePost(post)}>
            {renderPostActionIcon('duplicate')}
          </button>
          <button className="post-action-btn trash" type="button" aria-label="Move to trash" title="Move to trash" onClick={() => moveStatus(post, 'trash')}>
            {renderPostActionIcon('trash')}
          </button>
        </div>
      </article>
    );
  }

  return (
    <section id="postsScreen" className="blog-workspace-shell">
      {workspaceNotice ? (
        <div className={`workspace-banner workspace-banner--${workspaceNotice.tone}`}>
          <div>
            <strong>{workspaceNotice.tone === 'error' ? 'Workspace issue' : 'Workspace update'}</strong>
            <p>{workspaceNotice.message}</p>
          </div>
          {onDismissWorkspaceNotice ? (
            <button className="icon-btn" type="button" aria-label="Dismiss notice" onClick={onDismissWorkspaceNotice}>
              <BlogEditorControlIcon name="close" />
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="stats">
        <article className="card stat">
          <div className="stat-top">
            <div className="stat-label">All Posts</div>
            <div className="stat-icon"><BlogEditorControlIcon name="preview" /></div>
          </div>
          <div className="stat-value">{counts.all}</div>
          <div className="stat-note">Visible posts across draft, scheduled, published, and trash states.</div>
        </article>
        <article className="card stat">
          <div className="stat-top">
            <div className="stat-label">Drafts</div>
            <div className="stat-icon"><BlogEditorControlIcon name="save" /></div>
          </div>
          <div className="stat-value">{counts.draft}</div>
          <div className="stat-note">Open work that still needs editorial completion.</div>
        </article>
        <article className="card stat">
          <div className="stat-top">
            <div className="stat-label">Scheduled</div>
            <div className="stat-icon"><BlogEditorControlIcon name="publish" /></div>
          </div>
          <div className="stat-value">{counts.scheduled}</div>
          <div className="stat-note">{scheduledNext ? `Next release ${formatDate(scheduledNext.scheduledFor)}` : 'No scheduled releases yet.'}</div>
        </article>
        <article className="card stat">
          <div className="stat-top">
            <div className="stat-label">Published</div>
            <div className="stat-icon"><BlogEditorControlIcon name="approve" /></div>
          </div>
          <div className="stat-value">{counts.published}</div>
          <div className="stat-note">Live content currently visible on the public resources experience.</div>
        </article>
      </div>

      <div className="stack">
        <div className="card tabs-wrap">
          <div className="tabs">
            {([
              ['all', 'All'],
              ['draft', 'Draft'],
              ['published', 'Published'],
              ['scheduled', 'Scheduled'],
              ['trash', 'Trash'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`tab ${tab === value ? 'active' : ''}`}
                type="button"
                onClick={() => {
                  setTab(value);
                  setPage(1);
                }}
              >
                <span>{label}</span>
                <span className="tab-count">{value === 'all' ? counts.all : counts[value]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card toolbar">
          <div className="toolbar-row">
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="field"
                placeholder="Search titles, slugs, excerpts, categories, or authors"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select className="select" value={status} onChange={(event) => { setStatus(event.target.value as 'all' | SystemOSPostStatus); setPage(1); }}>
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="trash">Trash</option>
            </select>
            <select className="select" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="select" value={author} onChange={(event) => { setAuthor(event.target.value); setPage(1); }}>
              <option value="all">All authors</option>
              {authors.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="select" value={sort} onChange={(event) => setSort(event.target.value as BlogSort)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="views">Most viewed</option>
              <option value="az">A-Z</option>
            </select>
            <button className="btn primary" type="button" onClick={handleNewRequest}>
              <BlogEditorControlIcon name="publish" />
              <span>New Post</span>
            </button>
          </div>
          <div className="toolbar-foot">
            <div className="chip-row">
              <button className="filter-chip" type="button" onClick={() => setView('table')}>Table</button>
              <button className="filter-chip" type="button" onClick={() => setView('cards')}>Cards</button>
              <button className="filter-chip" type="button" onClick={clearFilters}>Clear filters</button>
            </div>
            <div className="kbd-row">
              <span>{filtered.length} results</span>
              <span>•</span>
              <span>{counts.draft} drafts</span>
              <span>•</span>
              <span>{counts.published} live</span>
            </div>
          </div>
        </div>

        {empty ? (
          <div className="card empty">
            <div className="empty-ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h9l3 3v13H6z" />
                <path d="M15 4v3h3" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            </div>
            <div className="empty-title">No posts in view</div>
            <div className="empty-note">Adjust the filters or create a new post to populate this workspace.</div>
            <div className="empty-actions">
              <button className="btn primary" type="button" onClick={handleNewRequest}>New Post</button>
              <button className="btn" type="button" onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>
        ) : null}

        {!empty && showTable ? (
          <div className="card table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th className="post-actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>{rows.map((post) => renderRow(post))}</tbody>
              </table>
            </div>
            <div className="pager">
              <div>
                Showing {pagination.total === 0 ? 0 : pagination.start + 1}-{pagination.end} of {pagination.total}
              </div>
              <div className="pager-controls">
                <button className="page-btn" type="button" disabled={pagination.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>&lsaquo;</button>
                <span>Page {pagination.page} of {pagination.pages}</span>
                <button className="page-btn" type="button" disabled={pagination.page >= pagination.pages} onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}>&rsaquo;</button>
              </div>
            </div>
          </div>
        ) : null}

        {!empty && showCards ? <div className="card-list">{rows.map((post) => renderCard(post))}</div> : null}
      </div>

      <div
        className={`modal blog-editor-modal ${editor.editorOpen ? 'open' : ''} ${editor.fullscreenMode ? 'is-fullscreen' : ''}`}
        aria-hidden={!editor.editorOpen}
      >
        <div
          className={`modal-box blog-editor-modal-box ${editor.fullscreenMode === 'editor' ? 'is-editor-fullscreen' : ''} ${editor.fullscreenMode === 'body' ? 'is-body-fullscreen' : ''}`}
        >
          <BlogEditorHeader
            editorContext={editor.editorContext}
            previewOnly={editor.previewOnly}
            previewOpen={editor.previewOpen}
            fullscreenMode={editor.fullscreenMode}
            guidance={editor.guidance}
            recoveryMessage={editor.recoveryMessage}
            hasRecoverySnapshot={editor.hasRecoverySnapshot}
            actionError={editor.actionError}
            activePane={editor.activePane}
            saveIndicatorText={editor.saveIndicatorText}
            primaryDisabled={editor.primaryDisabled}
            secondaryDisabled={editor.secondaryDisabled}
            onClose={editor.closeEditor}
            onTogglePreview={editor.togglePreview}
            onToggleEditorFullscreen={editor.toggleEditorFullscreen}
            onSetPane={editor.setActivePane}
            onOpenRequiredField={editor.openRequiredField}
            onSaveSecondary={() => void editor.saveSecondaryAction()}
            onSavePrimary={() => void editor.savePrimaryAction()}
            onReturnToDraft={() => void editor.returnRevisionToDraftAction()}
            onRestoreRecovery={editor.restoreRecoverySnapshot}
            onDismissRecovery={editor.dismissRecoverySnapshot}
          />

          <div className={`modal-body ${editor.fullscreenMode === 'body' ? 'is-body-focus' : ''}`}>
            <div className="editor-layout">
              <div className="editor-main-column">
                <div className={`pane pane--main ${editor.activePane === 'basics' ? 'active' : ''}`}>
              <BlogEditorBasics
                draft={editor.draft}
                categoryOptions={editor.categoryOptions}
                authorOptions={editor.authorOptions}
                fieldsDisabled={editor.fieldsDisabled}
                isActionPending={editor.isActionPending}
                isCoverUploading={editor.isCoverUploading}
                coverDragging={editor.coverDragging}
                coverUploadError={editor.coverUploadError}
                coverFileName={editor.coverFileName}
                coverFileRef={editor.coverFileRef}
                updateDraft={editor.updateDraft}
                isFieldMissing={editor.isFieldMissing}
                setManualSlug={editor.setManualSlug}
                setCoverDragging={editor.setCoverDragging}
                onTriggerCoverSelection={editor.triggerCoverSelection}
                onLoadCoverFile={editor.loadCoverFile}
                onClearCover={editor.clearCover}
              />
                </div>

                <div className={`pane pane--main ${editor.activePane === 'content' ? 'active' : ''}`}>
              <BlogEditorContent
                body={editor.draft.body}
                fieldsDisabled={editor.fieldsDisabled}
                invalid={editor.isFieldMissing('postBody')}
                isActionPending={editor.isActionPending}
                isCoverUploading={editor.isCoverUploading}
                fullscreenMode={editor.fullscreenMode}
                onBodyChange={(value) => editor.updateDraft('body', value)}
                onToggleBodyFullscreen={editor.toggleBodyFullscreen}
                onUploadImage={editor.uploadBodyImage}
              />
                </div>
              </div>

              <aside className="editor-side-column">
                <div className={`pane pane--side ${editor.activePane === 'publishing' ? 'active' : ''}`}>
              <BlogEditorPublishing
                draft={editor.draft}
                coverMeta={editor.coverMeta}
                currentPreviewUrl={editor.currentPreviewUrl}
                fieldsDisabled={editor.fieldsDisabled}
                readOnly={editor.editorContext.readOnly}
                isPublishDateMissing={editor.isFieldMissing('postPublishDate')}
                updateDraft={editor.updateDraft}
                onCopyCurrentUrl={editor.copyCurrentUrl}
                onOpenCurrentPreview={editor.openCurrentPreview}
              />
                </div>

                <div className={`pane pane--side ${editor.activePane === 'seo' ? 'active' : ''}`}>
              <BlogEditorSeo
                draft={editor.draft}
                fieldsDisabled={editor.fieldsDisabled}
                updateDraft={editor.updateDraft}
              />
                </div>
              </aside>
            </div>

            {editor.previewOpen ? (
              <section
                className="preview-sheet"
                ref={(node) => {
                  (editor.previewSheetRef as { current: HTMLElement | null }).current = node;
                }}
              >
                <div className="preview-page-head">
                  <span>Public article preview</span>
                  <strong>{editor.currentPreviewUrl}</strong>
                </div>
                <article className="preview-article">
                  <figure className={`preview-cover ${editor.draft.cover ? 'show' : ''}`}>
                    {editor.draft.cover ? <img src={editor.draft.cover} alt={editor.draft.title || 'Cover'} /> : null}
                  </figure>
                  <div className="preview-meta">
                    <span>{editor.draft.category || 'General'}</span>
                    <span>&middot;</span>
                    <span>{editor.draft.readTime || '5 min read'}</span>
                    <span>&middot;</span>
                    <span>{editor.draft.author || currentUserLabel}</span>
                  </div>
                  <h1 className="preview-title">{editor.draft.title || 'Untitled draft'}</h1>
                  <div className="preview-excerpt">
                    {editor.draft.excerpt || 'Add an excerpt so the public preview feels complete.'}
                  </div>
                  <div className="preview-body">
                    {editor.previewBodyHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: editor.previewBodyHtml }} />
                    ) : (
                      editor.previewParagraphs.map((paragraph, index) => (
                        <p key={`${index}-${paragraph.join('-')}`}>{paragraph.join(' ')}</p>
                      ))
                    )}
                  </div>
                </article>
              </section>
            ) : null}
          </div>

        </div>
      </div>
    </section>
  );
}
