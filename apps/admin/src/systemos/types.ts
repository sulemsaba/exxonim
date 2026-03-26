export type SystemOSTheme = 'dark' | 'light';
export type SystemOSScreen = 'posts' | 'analytics';
export type SystemOSPostStatus = 'draft' | 'published' | 'scheduled' | 'trash';
export type SystemOSRevisionState = '' | 'working' | 'ready_for_review';
export type SystemOSEditorPane = 'basics' | 'content' | 'publishing' | 'seo';
export type SystemOSViewMode = 'table' | 'cards';
export type SystemOSAnalyticsRange = 7 | 30 | 90;
export type SystemOSWorkspaceNoticeTone = 'info' | 'success' | 'error';

export interface SystemOSWorkspaceNotice {
  tone: SystemOSWorkspaceNoticeTone;
  message: string;
}

export interface SystemOSPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  featuredSlot?: string;
  featuredOnHome?: boolean;
  status: SystemOSPostStatus;
  updated: string;
  scheduledFor: string;
  publishedAt: string;
  readTime: string;
  views: number;
  excerpt: string;
  cover: string;
  body: string;
  note: string;
  metaTitle: string;
  metaDescription: string;
  seo: number;
  revisionOf?: number | null;
  revisionState?: SystemOSRevisionState;
  openRevisionId?: number | null;
  openRevisionState?: SystemOSRevisionState;
}

export interface SystemOSCounts {
  all: number;
  draft: number;
  scheduled: number;
  published: number;
  trash: number;
}

export interface SystemOSPageMeta {
  crumbs: string;
  title: string;
  sub: string;
}

export interface SystemOSBlogCommand {
  id: number;
  type: 'new' | 'edit' | 'preview' | 'showTrending';
  postId?: number;
  pane?: SystemOSEditorPane;
}

export interface SystemOSBlogManagerProps {
  posts: SystemOSPost[];
  onPostsChange: (posts: SystemOSPost[]) => void;
  categories?: string[];
  authors?: string[];
  command?: SystemOSBlogCommand | null;
  onCloseEditor?: () => void;
  onRequestNew?: () => void;
  onRequestEdit?: (postId: number) => void;
  currentUserLabel?: string;
  currentUserRole?: string;
  onUploadCover?: (
    file: File,
  ) => Promise<{ url: string; fileName?: string; altText?: string | null }>;
  onSavePost?: (
    post: SystemOSPost,
    options: { previousPost: SystemOSPost | null; action: 'secondary' | 'primary' | 'autosave' },
  ) => Promise<SystemOSPost | void>;
  onSubmitRevision?: (post: SystemOSPost) => Promise<SystemOSPost | void>;
  onApproveRevision?: (post: SystemOSPost) => Promise<void>;
  onReturnRevisionToDraft?: (post: SystemOSPost) => Promise<SystemOSPost | void>;
  workspaceNotice?: SystemOSWorkspaceNotice | null;
  onDismissWorkspaceNotice?: () => void;
}

export interface SystemOSAnalyticsDashboardProps {
  posts: SystemOSPost[];
  defaultRange?: SystemOSAnalyticsRange;
  onOpenPost?: (postId: number, pane?: SystemOSEditorPane) => void;
  onShowTrending?: () => void;
  onCreateSimilar?: (sourcePostId: number) => void;
}

export interface SystemOSAdminProps {
  initialPosts?: SystemOSPost[];
  storageKey?: string;
  themeStorageKey?: string;
  defaultTheme?: SystemOSTheme;
  defaultScreen?: SystemOSScreen;
  persistToLocalStorage?: boolean;
  onPostsChange?: (posts: SystemOSPost[]) => void;
}
