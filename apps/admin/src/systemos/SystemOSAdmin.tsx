import { useEffect, useState } from 'react';

import './SystemOSWorkspace.css';

import { SystemOSAnalyticsDashboard } from './SystemOSAnalyticsDashboard';
import { SystemOSBlogManager } from './SystemOSBlogManager';
import { systemOSSamplePosts } from './sampleData';
import type { SystemOSAdminProps, SystemOSBlogCommand, SystemOSPost, SystemOSScreen, SystemOSTheme } from './types';
import { clonePostForDraft, createBlogCommand, createCounts, createPageMeta, getStorageValue, setStorageValue } from './utils';

function getStoredTheme(key: string, fallback: SystemOSTheme) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === 'dark' || raw === 'light') return raw;
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === 'dark' || parsed === 'light' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function SystemOSAdmin({
  initialPosts = systemOSSamplePosts,
  storageKey = 'systemos_posts_v3',
  themeStorageKey = 'systemos_theme_v3',
  defaultTheme = 'dark',
  defaultScreen = 'posts',
  persistToLocalStorage = true,
  onPostsChange,
}: SystemOSAdminProps) {
  const [posts, setPosts] = useState<SystemOSPost[]>(() =>
    persistToLocalStorage ? getStorageValue<SystemOSPost[]>(storageKey, initialPosts) : initialPosts,
  );
  const [theme, setTheme] = useState<SystemOSTheme>(() =>
    persistToLocalStorage ? getStoredTheme(themeStorageKey, defaultTheme) : defaultTheme,
  );
  const [screen, setScreen] = useState<SystemOSScreen>(defaultScreen);
  const [blogCommand, setBlogCommand] = useState<SystemOSBlogCommand | null>(null);

  useEffect(() => {
    if (!persistToLocalStorage) return;
    setStorageValue(storageKey, posts);
  }, [persistToLocalStorage, posts, storageKey]);

  useEffect(() => {
    if (!persistToLocalStorage) return;
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, [persistToLocalStorage, theme, themeStorageKey]);

  useEffect(() => {
    onPostsChange?.(posts);
  }, [onPostsChange, posts]);

  const counts = createCounts(posts);
  const meta = createPageMeta(screen);

  function issueBlogCommand(next: SystemOSBlogCommand) {
    setBlogCommand(next);
  }

  function handleCreateSimilar(sourcePostId: number) {
    const source = posts.find((post) => post.id === sourcePostId);
    if (!source) {
      setScreen('posts');
      issueBlogCommand(createBlogCommand('new'));
      return;
    }
    const clone = clonePostForDraft(source);
    setPosts((current) => [clone, ...current]);
    setScreen('posts');
    issueBlogCommand(createBlogCommand('edit', clone.id, 'content'));
  }

  return (
    <div className="systemos-admin" data-theme={theme}>
      <div className="app">
        <aside className="sidebar">
          <div className="brandbar">
            <div className="mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M16.5 6h-6a2.5 2.5 0 1 0 0 5h3a2.5 2.5 0 1 1 0 5H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">SystemOS</div>
              <div className="brand-sub">Content Admin</div>
            </div>
          </div>

          <div className="sidebar-body">
            <div>
              <div className="nav-section">
                <div className="nav-label">Workspace</div>

                <button className="nav-item" type="button">
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M4 5h7v6H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 13h7v6H4z" /></svg>
                  </span>
                  <span className="nav-copy">Dashboard</span>
                  <span className="nav-count">Overview</span>
                </button>

                <button className={`nav-item ${screen === 'posts' ? 'active' : ''}`} type="button" onClick={() => setScreen('posts')}>
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M6 4h9l3 3v13H6z" /><path d="M15 4v3h3" /><path d="M9 12h6M9 16h4" /></svg>
                  </span>
                  <span className="nav-copy">Blog Posts</span>
                  <span className="nav-count">{counts.all}</span>
                </button>

                <button className={`nav-item ${screen === 'analytics' ? 'active' : ''}`} type="button" onClick={() => setScreen('analytics')}>
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 18V9" /><path d="M12 18V5" /><path d="M19 18v-7" /><path d="M4 19h16" /></svg>
                  </span>
                  <span className="nav-copy">Analytics</span>
                  <span className="nav-count">Live</span>
                </button>

                <button className="nav-item" type="button">
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3v18" /><path d="M3 12h18" /></svg>
                  </span>
                  <span className="nav-copy">Settings</span>
                  <span className="nav-count">Admin</span>
                </button>
              </div>
            </div>

            <div className="profile">
              <div className="avatar">SM</div>
              <div className="profile-details">
                <div style={{ fontSize: 14, fontWeight: 600 }}>Suleiman Msaba</div>
                <div className="brand-sub">Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div>
              <div className="crumbs">{meta.crumbs}</div>
              <div className="top-title">{meta.title}</div>
              <div className="top-sub">{meta.sub}</div>
            </div>

            <div className="top-actions">
              <button className="btn icon" type="button" aria-label="Toggle theme" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.41 1.41m9.9 9.9 1.41 1.41m0-12.72-1.41 1.41m-9.9 9.9-1.41 1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </button>

              {screen === 'posts' ? (
                <button className="btn primary" type="button" onClick={() => issueBlogCommand(createBlogCommand('new'))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>New Post</span>
                </button>
              ) : null}
            </div>
          </header>

          <div className="shell">
            <main className="content">
              {screen === 'posts' ? (
                <SystemOSBlogManager posts={posts} onPostsChange={setPosts} command={blogCommand} />
              ) : (
                <SystemOSAnalyticsDashboard
                  posts={posts}
                  onOpenPost={(postId, pane) => {
                    setScreen('posts');
                    issueBlogCommand(createBlogCommand('edit', postId, pane));
                  }}
                  onShowTrending={() => {
                    setScreen('posts');
                    issueBlogCommand(createBlogCommand('showTrending'));
                  }}
                  onCreateSimilar={handleCreateSimilar}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
