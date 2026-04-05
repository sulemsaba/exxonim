import type { DragEvent, ChangeEvent } from 'react';
import type { AdminRouteMatch } from '@exxonim/admin-core/lib/adminRoutes';
import type {
  ApiBlogPost,
  ApiBlogStatus,
  ApiBlogAuthor,
  ApiBlogCategory,
} from '@exxonim/admin-core/types/api';

import { useLocation } from 'react-router';
import { legacyBlogPost } from '@exxonim/admin-core/routes';
import { useRef, useMemo, useState, useEffect } from 'react';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMediaFile } from '@exxonim/admin-core/services/adminMediaService';
import {
  slugify,
  toDatetimeLocalValue,
  getAdminErrorMessage,
  fromDatetimeLocalValue,
  formatWorkflowStatusLabel,
} from '@exxonim/admin-core/utils/admin';
import {
  getAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost,
  createAdminBlogPost,
  archiveAdminBlogPost,
  approveAdminBlogPost,
  listAdminBlogAuthors,
  listAdminBlogPostsPage,
  listAdminBlogCategories,
  publishAdminBlogPost,
  rejectAdminBlogPost,
  submitAdminBlogPostForReview,
  type AdminBlogPostPayload,
} from '@exxonim/admin-core/services/adminBlogService';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormMessage = { tone: 'success' | 'error'; text: string } | null;
type MuiChipColor = 'default' | 'success' | 'warning' | 'error' | 'info';
type BlogViewMode = 'table' | 'cards';
type BlogSortValue = 'newest' | 'oldest' | 'title-asc' | 'title-desc';
type BlogStatusFilter = 'all' | ApiBlogStatus;
type BlogEditorStepKey = 'basics' | 'content' | 'seo' | 'publish';
type BlogWorkflowAction = 'submit' | 'approve' | 'reject' | 'publish' | 'archive';

type PublishRequirement = {
  key: string;
  label: string;
  done: boolean;
  step: BlogEditorStepKey;
};

type BlogEditorValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  categoryId: string;
  authorId: string;
  status: ApiBlogStatus;
  featuredImage: string;
  coverAlt: string;
  mediaLabel: string;
  featuredSlot: string;
  featuredOnHome: boolean;
  readTimeMinutes: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  publishedAt: string;
  relatedSlugs: string;
};

const SLUG_MAX_WORDS = 8;
const SLUG_MAX_LENGTH = 72;

const defaultBlogEditorValues: BlogEditorValues = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  categoryId: '',
  authorId: '',
  status: 'draft',
  featuredImage: '',
  coverAlt: '',
  mediaLabel: '',
  featuredSlot: '',
  featuredOnHome: false,
  readTimeMinutes: '',
  metaTitle: '',
  metaDescription: '',
  ogImageUrl: '',
  publishedAt: '',
  relatedSlugs: '',
};

const featuredSlotOptions = [
  { value: '', label: 'None' },
  { value: 'hero', label: 'Hero' },
  { value: 'popular', label: 'Popular' },
  { value: 'editors-pick', label: 'Editors Pick' },
];

const blogEditorSteps: Array<{
  key: BlogEditorStepKey;
  label: string;
  description: string;
}> = [
  {
    key: 'basics',
    label: 'Basics',
    description: 'Headline, URL, summary, and ownership.',
  },
  {
    key: 'content',
    label: 'Content',
    description: 'Write the body with a richer editor and supporting links.',
  },
  {
    key: 'seo',
    label: 'Media & SEO',
    description: 'Cover image, search metadata, and social sharing.',
  },
  {
    key: 'publish',
    label: 'Publish',
    description: 'Final readiness checks, timing, and placement.',
  },
];

function LoadingState({ label }: { label: string }) {
  return <Alert severity="info">{label}</Alert>;
}

function ErrorState({ error, fallback }: { error: unknown; fallback: string }) {
  return <Alert severity="error">{getAdminErrorMessage(error, fallback)}</Alert>;
}

function ActionToast({
  message,
  onClose,
}: {
  message: FormMessage;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={3200}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        onClose();
      }}
    >
      <Alert
        variant="filled"
        severity={message?.tone === 'success' ? 'success' : 'error'}
        onClose={onClose}
        sx={{ width: '100%', boxShadow: 6 }}
      >
        {message?.text}
      </Alert>
    </Snackbar>
  );
}

function statusColor(status?: string | null): MuiChipColor {
  switch (status) {
    case 'published':
      return 'success';
    case 'pending_review':
      return 'warning';
    case 'rejected':
    case 'archived':
      return 'error';
    default:
      return 'default';
  }
}

function stripRichText(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toRichTextHtml(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  if (/<[a-z][\s\S]*>/i.test(trimmedValue)) {
    return trimmedValue;
  }

  return trimmedValue
    .split(/\n\s*\n+/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function normalizeRichTextHtml(value: string) {
  const trimmedValue = value.trim();

  return stripRichText(trimmedValue) ? trimmedValue : '';
}

function countWords(value: string) {
  const normalizedText = stripRichText(value);

  return normalizedText ? normalizedText.split(/\s+/).length : 0;
}

function splitList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function composeBlogBody(post: ApiBlogPost) {
  if (typeof post.content.html === 'string' && post.content.html.trim()) {
    return post.content.html;
  }

  const parts = [
    post.content.introduction,
    ...(post.content.highlights ?? []),
    ...(post.content.sections ?? []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
    ]),
  ].filter((item) => typeof item === 'string' && item.trim().length > 0);

  return parts.join('\n\n');
}

function createEditorValues(post?: ApiBlogPost | null): BlogEditorValues {
  if (!post) {
    return defaultBlogEditorValues;
  }

  return {
    title: post.title ?? '',
    slug: post.slug ?? '',
    excerpt: post.excerpt ?? '',
    body: composeBlogBody(post),
    categoryId: post.category?.id ? String(post.category.id) : '',
    authorId: post.author?.id ? String(post.author.id) : '',
    status: post.status ?? 'draft',
    featuredImage: post.featured_image ?? '',
    coverAlt: post.cover_alt ?? '',
    mediaLabel: post.media_label ?? '',
    featuredSlot: post.featured_slot ?? '',
    featuredOnHome: Boolean(post.featured_on_home),
    readTimeMinutes: post.read_time_minutes ? String(post.read_time_minutes) : '',
    metaTitle: post.meta_title ?? '',
    metaDescription: post.meta_description ?? '',
    ogImageUrl: post.og_image_url ?? '',
    publishedAt: toDatetimeLocalValue(post.published_at),
    relatedSlugs: (post.related_slugs ?? []).join('\n'),
  };
}

function createContentPayload(body: string, original?: ApiBlogPost | null) {
  const normalizedBody = body.trim();

  if (original && normalizedBody === composeBlogBody(original).trim()) {
    return original.content;
  }

  if (!normalizedBody) {
    return {
      introduction: '',
      highlights: [],
      sections: [],
    };
  }

  if (/<[a-z][\s\S]*>/i.test(normalizedBody)) {
    return {
      introduction: '',
      highlights: [],
      sections: [],
      html: normalizedBody,
    };
  }

  const blocks = normalizedBody
    .split(/\n\s*\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const introduction = blocks[0] ?? '';
  const sectionParagraphs = blocks.slice(1);

  return {
    introduction,
    highlights: [],
    sections: sectionParagraphs.length
      ? [
          {
            heading: 'Main Section',
            paragraphs: sectionParagraphs,
          },
        ]
      : [],
  };
}

function createPayload(values: BlogEditorValues, original?: ApiBlogPost | null): AdminBlogPostPayload {
  const readTimeValue = Number(values.readTimeMinutes);
  const publishedAt =
    values.status !== 'published'
      ? null
      : fromDatetimeLocalValue(values.publishedAt) ??
        original?.published_at ??
        new Date().toISOString();

  return {
    title: values.title.trim() || 'Untitled post',
    slug: clampEditorSlug(values.slug) || clampEditorSlug(values.title) || 'untitled-post',
    excerpt: values.excerpt.trim() || null,
    content: createContentPayload(values.body, original),
    category_id: values.categoryId ? Number(values.categoryId) : null,
    author_id: values.authorId ? Number(values.authorId) : null,
    featured_image: values.featuredImage.trim() || null,
    cover_alt: values.coverAlt.trim() || null,
    media_label: values.mediaLabel.trim() || null,
    featured_slot: values.featuredSlot.trim() || null,
    featured_on_home: values.featuredOnHome,
    read_time_minutes:
      Number.isFinite(readTimeValue) && readTimeValue > 0 ? readTimeValue : null,
    related_slugs: splitList(values.relatedSlugs),
    meta_title: values.metaTitle.trim() || null,
    meta_description: values.metaDescription.trim() || null,
    og_image_url: values.ogImageUrl.trim() || values.featuredImage.trim() || null,
    published_at: publishedAt,
    status: values.status,
  };
}

function estimateSeoScore(values: BlogEditorValues) {
  let score = 28;

  if (values.slug.trim().length >= 8) score += 10;
  if (values.title.trim().length >= 24) score += 10;
  if (values.excerpt.trim().length >= 48) score += 10;
  if (countWords(values.body) >= 140) score += 14;
  if (values.metaTitle.trim().length >= 20) score += 12;
  if (values.metaDescription.trim().length >= 70) score += 12;
  if (values.featuredImage.trim() || values.ogImageUrl.trim()) score += 10;
  if (values.categoryId) score += 7;
  if (values.authorId) score += 7;

  return Math.min(100, score);
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatRelativeTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return `${fToNow(value)} ago`;
}

function resolvePublicPreviewUrl(slug: string) {
  const path = legacyBlogPost(slug);

  if (typeof window === 'undefined') {
    return path;
  }

  const url = new URL(window.location.href);

  if (url.port === '3039') {
    url.port = '5173';
  }

  url.pathname = path;
  url.search = '';
  url.hash = '';

  return url.toString();
}

function normalizeOptionValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function clampEditorSlug(value: string) {
  const normalized = slugify(value);

  if (!normalized) {
    return '';
  }

  return normalized
    .split('-')
    .filter(Boolean)
    .slice(0, SLUG_MAX_WORDS)
    .join('-')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '');
}

function withFocusSearch(pathname: string, search: string, enabled: boolean) {
  const params = new URLSearchParams(search);

  if (enabled) {
    params.set('focus', '1');
  } else {
    params.delete('focus');
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function buildUniqueOptions<T extends { name?: string | null }>(items: T[]) {
  const uniqueOptions = new Map<string, { label: string; value: string }>();

  items.forEach((item) => {
    const rawName = item.name?.trim();

    if (!rawName) {
      return;
    }

    const normalizedValue = normalizeOptionValue(rawName);

    if (!normalizedValue || uniqueOptions.has(normalizedValue)) {
      return;
    }

    uniqueOptions.set(normalizedValue, {
      label: rawName,
      value: normalizedValue,
    });
  });

  return [...uniqueOptions.values()].sort((left, right) => left.label.localeCompare(right.label));
}

function dedupeNamedRecords<T extends { id: number; name?: string | null }>(items: T[]) {
  const uniqueItems = new Map<string, T>();

  items.forEach((item) => {
    const normalizedName = normalizeOptionValue(item.name);

    if (!normalizedName || uniqueItems.has(normalizedName)) {
      return;
    }

    uniqueItems.set(normalizedName, item);
  });

  return [...uniqueItems.values()].sort((left, right) =>
    (left.name ?? '').localeCompare(right.name ?? '')
  );
}

function buildPublishRequirements(values: BlogEditorValues): PublishRequirement[] {
  return [
    { key: 'title', label: 'Title', done: Boolean(values.title.trim()), step: 'basics' },
    { key: 'slug', label: 'Slug', done: Boolean(values.slug.trim()), step: 'basics' },
    {
      key: 'category',
      label: 'Category',
      done: Boolean(values.categoryId),
      step: 'basics',
    },
    {
      key: 'author',
      label: 'Author',
      done: Boolean(values.authorId),
      step: 'basics',
    },
    {
      key: 'body',
      label: 'Body',
      done: countWords(values.body) >= 120,
      step: 'content',
    },
    {
      key: 'cover',
      label: 'Cover image',
      done: Boolean(values.featuredImage.trim()),
      step: 'seo',
    },
    {
      key: 'meta-description',
      label: 'Meta description',
      done: values.metaDescription.trim().length >= 70,
      step: 'seo',
    },
  ];
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  focusMode?: boolean;
  minHeight?: number;
};

function RichTextEditor({
  value,
  onChange,
  onUploadImage,
  focusMode = false,
  minHeight = 320,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const htmlValue = useMemo(() => toRichTextHtml(value), [value]);
  const [dragActive, setDragActive] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!editorRef.current || editorRef.current.innerHTML === htmlValue) {
      return;
    }

    editorRef.current.innerHTML = htmlValue;
  }, [htmlValue]);

  const emitChange = () => {
    onChange(normalizeRichTextHtml(editorRef.current?.innerHTML ?? ''));
  };

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection?.rangeCount || !editorRef.current) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    selectionRef.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();

    if (!selectionRef.current || !selection) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const placeCaretFromPoint = (clientX: number, clientY: number) => {
    const selection = window.getSelection();

    if (!selection || !editorRef.current) {
      return;
    }

    let nextRange: Range | null = null;
    const documentWithCaretRange = document as Document & {
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
      caretPositionFromPoint?: (
        x: number,
        y: number
      ) => { offsetNode: Node; offset: number } | null;
    };

    if (documentWithCaretRange.caretRangeFromPoint) {
      nextRange = documentWithCaretRange.caretRangeFromPoint(clientX, clientY);
    } else if (documentWithCaretRange.caretPositionFromPoint) {
      const position = documentWithCaretRange.caretPositionFromPoint(clientX, clientY);

      if (position) {
        nextRange = document.createRange();
        nextRange.setStart(position.offsetNode, position.offset);
        nextRange.collapse(true);
      }
    }

    if (!nextRange || !editorRef.current.contains(nextRange.commonAncestorContainer)) {
      restoreSelection();
      return;
    }

    selection.removeAllRanges();
    selection.addRange(nextRange);
    selectionRef.current = nextRange.cloneRange();
  };

  const runCommand = (command: string, argument?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, argument);
    emitChange();
    saveSelection();
  };

  const insertHtml = (html: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    emitChange();
    saveSelection();
  };

  const handleImageInsertion = async (file?: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    setImageUploading(true);

    try {
      const imageUrl = await onUploadImage(file);

      if (!imageUrl) {
        return;
      }

      insertHtml(
        `<p><img src="${escapeHtml(imageUrl)}" alt="" style="max-width:100%;height:auto;border-radius:16px;" /></p><p><br></p>`
      );
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => runCommand('bold')}>
            <Iconify icon="solar:text-bold-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => runCommand('italic')}>
            <Iconify icon="solar:text-italic-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Heading">
          <IconButton size="small" onClick={() => runCommand('formatBlock', '<h2>')}>
            <Iconify icon="solar:text-bold-square-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bulleted list">
          <IconButton size="small" onClick={() => runCommand('insertUnorderedList')}>
            <Iconify icon="solar:list-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Quote">
          <IconButton size="small" onClick={() => runCommand('formatBlock', '<blockquote>')}>
            <Iconify icon="solar:plain-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Link">
          <IconButton
            size="small"
            onClick={() => {
              saveSelection();
              const url = window.prompt('Enter the link URL');

              if (!url) {
                return;
              }

              runCommand('createLink', url);
            }}
          >
            <Iconify icon="solar:link-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear formatting">
          <IconButton size="small" onClick={() => runCommand('removeFormat')}>
            <Iconify icon="solar:eraser-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert image">
          <IconButton
            size="small"
            onClick={() => {
              saveSelection();
              fileInputRef.current?.click();
            }}
          >
            <Iconify icon="solar:gallery-add-bold" width={18} />
          </IconButton>
        </Tooltip>
      </Stack>

      <input
        hidden
        ref={fileInputRef}
        accept="image/*"
        type="file"
        onChange={(event) => {
          void handleImageInsertion(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />

      <Paper
        variant="outlined"
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
          }
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          placeCaretFromPoint(event.clientX, event.clientY);
          void handleImageInsertion(event.dataTransfer.files?.[0] ?? null);
        }}
        sx={{
          borderRadius: 2.5,
          borderColor: dragActive ? 'primary.main' : 'divider',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: dragActive ? '0 0 0 3px rgba(8, 56, 61, 0.08)' : 'none',
        }}
      >
        {imageUploading ? <LinearProgress /> : null}
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onFocus={saveSelection}
          data-placeholder="Start with the opening paragraph, then use headings and lists to structure the article."
          sx={{
            p: 2,
            minHeight: focusMode ? 'calc(100vh - 180px)' : minHeight,
            outline: 'none',
            typography: 'body1',
            lineHeight: 1.8,
            '&:empty:before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
            },
            '& p': { my: 0 },
            '& p + p': { mt: 2 },
            '& h2': { mt: 2.5, mb: 1, typography: 'h5' },
            '& ul, & ol': { pl: 3, my: 1.5 },
            '& blockquote': {
              m: 0,
              pl: 2,
              py: 0.5,
              color: 'text.secondary',
              borderLeft: '3px solid',
              borderColor: 'divider',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          }}
        />
      </Paper>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Use headings, lists, quotes, links, and inline images. Drag files into the editor or use the image button.
      </Typography>
    </Stack>
  );
}

function getStatusLabel(status?: string | null) {
  return formatWorkflowStatusLabel(status);
}

function sortPosts(posts: ApiBlogPost[], sortBy: BlogSortValue) {
  const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

  return [...posts].sort((left, right) => {
    if (sortBy === 'title-asc') {
      return collator.compare(left.title, right.title);
    }

    if (sortBy === 'title-desc') {
      return collator.compare(right.title, left.title);
    }

    const leftTime = new Date(left.updated_at || left.created_at).getTime();
    const rightTime = new Date(right.updated_at || right.created_at).getTime();

    return sortBy === 'oldest' ? leftTime - rightTime : rightTime - leftTime;
  });
}

function BlogPostsIndexPanel() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<BlogViewMode>('table');
  const [sortBy, setSortBy] = useState<BlogSortValue>('newest');
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState<FormMessage>(null);
  const listQuery = useQuery({
    queryKey: ['admin-next', 'blog-posts', 'page'],
    queryFn: () => listAdminBlogPostsPage({ page: 1, limit: 30 }),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (post: ApiBlogPost) => {
      const duplicateTitle = `${post.title} (Copy)`;
      const duplicateValues: BlogEditorValues = {
        ...createEditorValues(post),
        title: duplicateTitle,
        slug: `${slugify(duplicateTitle)}-${String(Date.now()).slice(-4)}`,
        status: 'draft',
        publishedAt: '',
        featuredOnHome: false,
      };

      return createAdminBlogPost(createPayload(duplicateValues, post));
    },
    onSuccess: () => {
      setActionMessage({ tone: 'success', text: 'Draft duplicate created.' });
      void queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts'] });
    },
    onError: (error) => {
      setActionMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to duplicate this post.'),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => deleteAdminBlogPost(postId),
    onSuccess: () => {
      setActionMessage({ tone: 'success', text: 'Post deleted.' });
      void queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts'] });
    },
    onError: (error) => {
      setActionMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to delete this post.'),
      });
    },
  });

  const postItems = listQuery.data?.items;
  const posts = useMemo(() => postItems ?? [], [postItems]);
  const pageSize = viewMode === 'cards' ? 6 : 8;

  const categoryOptions = useMemo(
    () => buildUniqueOptions(posts.map((post) => post.category).filter(Boolean) as ApiBlogCategory[]),
    [posts]
  );

  const authorOptions = useMemo(
    () => buildUniqueOptions(posts.map((post) => post.author).filter(Boolean) as ApiBlogAuthor[]),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = posts.filter((post) => {
      const matchesSearch =
        !query ||
        [post.title, post.slug, post.excerpt ?? '', post.category?.name ?? '', post.author?.name ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === 'all' || (post.status ?? 'draft') === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' ||
        normalizeOptionValue(post.category?.name) === categoryFilter;
      const matchesAuthor =
        authorFilter === 'all' || normalizeOptionValue(post.author?.name) === authorFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    });

    return sortPosts(result, sortBy);
  }, [authorFilter, categoryFilter, posts, search, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [authorFilter, categoryFilter, search, sortBy, statusFilter, viewMode]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  if (listQuery.isLoading) {
    return <LoadingState label="Loading blog posts..." />;
  }

  if (listQuery.isError) {
    return <ErrorState error={listQuery.error} fallback="Unable to load blog posts." />;
  }

  const filteredDraftCount = filteredPosts.filter((post) => post.status === 'draft').length;
  const filteredPublishedCount = filteredPosts.filter((post) => post.status === 'published').length;
  const pageStart = filteredPosts.length ? (page - 1) * pageSize + 1 : 0;
  const pageEnd = filteredPosts.length ? Math.min(page * pageSize, filteredPosts.length) : 0;
  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    authorFilter !== 'all' ||
    sortBy !== 'newest';
  const actionPending = duplicateMutation.isPending || deleteMutation.isPending;

  const handleDuplicate = (post: ApiBlogPost) => {
    setActionMessage(null);
    duplicateMutation.mutate(post);
  };

  const handleDelete = (post: ApiBlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    setActionMessage(null);
    deleteMutation.mutate(post.id);
  };

  return (
    <Stack spacing={3}>
      <ActionToast message={actionMessage} onClose={() => setActionMessage(null)} />

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          display: 'grid',
          gap: 2,
          background:
            'linear-gradient(135deg, rgba(8, 56, 61, 0.06) 0%, rgba(255, 255, 255, 0.88) 100%)',
        }}
      >
        <Stack spacing={2.5}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, slugs, excerpts, categories, or authors"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" width={18} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as BlogStatusFilter)}
              >
                <MenuItem value="all">All statuses</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending_review">Pending review</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <MenuItem value="all">All categories</MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={authorFilter}
                onChange={(event) => setAuthorFilter(event.target.value)}
              >
                <MenuItem value="all">All authors</MenuItem>
                {authorOptions.map((author) => (
                  <MenuItem key={author.value} value={author.value}>
                    {author.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as BlogSortValue)}
              >
                <MenuItem value="newest">Newest first</MenuItem>
                <MenuItem value="oldest">Oldest first</MenuItem>
                <MenuItem value="title-asc">Title A-Z</MenuItem>
                <MenuItem value="title-desc">Title Z-A</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {filteredPosts.length} results
              <Box component="span" sx={{ px: 1 }}>
                |
              </Box>
              {filteredDraftCount} drafts
              <Box component="span" sx={{ px: 1 }}>
                |
              </Box>
              {filteredPublishedCount} live
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Button
                type="button"
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                color={viewMode === 'table' ? 'primary' : 'inherit'}
                startIcon={<Iconify icon="solar:list-bold" />}
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                type="button"
                variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                color={viewMode === 'cards' ? 'primary' : 'inherit'}
                startIcon={<Iconify icon="solar:widget-5-bold" />}
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button
                type="button"
                variant="text"
                color="inherit"
                startIcon={<Iconify icon="solar:restart-bold" />}
                disabled={!hasActiveFilters}
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setAuthorFilter('all');
                  setSortBy('newest');
                }}
              >
                Clear filters
              </Button>
              <Button
                component={RouterLink}
                href={adminRoutes.blogPostsNew}
                variant="contained"
                startIcon={<Iconify icon="solar:add-circle-bold" />}
              >
                New post
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Card>
        <CardHeader
          title={viewMode === 'table' ? 'Post library' : 'Post cards'}
          subheader={`${filteredPosts.length} matching posts`}
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {filteredPosts.length ? (
            <>
              {viewMode === 'table' ? (
                <TableContainer sx={{ overflowX: { xs: 'auto', lg: 'hidden' } }}>
                  <Table size="small" sx={{ minWidth: 860, tableLayout: { md: 'fixed' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Updated</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPosts.map((post) => (
                        <TableRow
                          hover
                          key={post.id}
                          sx={{
                            '& td': { py: 2 },
                          }}
                        >
                          <TableCell sx={{ width: { md: '42%' }, minWidth: 0 }}>
                            <Stack spacing={0.75}>
                              <Link
                                component={RouterLink}
                                href={adminRoutes.blogPostEdit(post.id)}
                                underline="hover"
                                color="inherit"
                                sx={{
                                  fontWeight: 700,
                                  display: 'block',
                                  lineHeight: 1.4,
                                  whiteSpace: 'normal',
                                  wordBreak: 'normal',
                                }}
                              >
                                {post.title}
                              </Link>

                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontFamily: 'monospace',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                /{post.slug}
                              </Typography>

                              {post.excerpt ? (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {post.excerpt}
                                </Typography>
                              ) : null}

                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {post.read_time_minutes ?? 5} min read
                                <Box component="span" sx={{ px: 0.75 }}>
                                  ·
                                </Box>
                                0 views
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ width: { md: '14%' }, minWidth: 110 }}>
                            <Typography noWrap variant="body2">
                              {post.category?.name || 'Uncategorized'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ width: { md: '14%' }, minWidth: 110 }}>
                            <Typography noWrap variant="body2">
                              {post.author?.name || 'Unassigned'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ width: { md: '10%' }, minWidth: 92 }}>
                            <Chip
                              size="small"
                              variant="outlined"
                              color={statusColor(post.status)}
                              label={getStatusLabel(post.status)}
                            />
                          </TableCell>
                          <TableCell sx={{ width: { md: '12%' }, minWidth: 116 }}>
                            <Stack spacing={0.25}>
                              <Tooltip title={formatDateTime(post.updated_at)} placement="top">
                                <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
                                  {formatRelativeTime(post.updated_at)}
                                </Typography>
                              </Tooltip>
                              <Typography noWrap variant="caption" sx={{ color: 'text.secondary' }}>
                                {formatDateTime(post.updated_at)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ width: { md: '12%' }, minWidth: 168 }}>
                            <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                              <Tooltip title="View post">
                                <IconButton
                                  component="a"
                                  href={resolvePublicPreviewUrl(post.slug)}
                                  target="_blank"
                                  rel="noreferrer"
                                  size="small"
                                  color="inherit"
                                >
                                  <Iconify icon="solar:eye-bold" width={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Duplicate draft">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="inherit"
                                    disabled={actionPending}
                                    onClick={() => handleDuplicate(post)}
                                  >
                                    <Iconify icon="solar:copy-bold" width={18} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Edit post">
                                <IconButton
                                  component={RouterLink}
                                  href={adminRoutes.blogPostEdit(post.id)}
                                  size="small"
                                  color="inherit"
                                >
                                  <Iconify icon="solar:pen-bold" width={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete post">
                                <span>
                                  <IconButton
                                    size="small"
                                    color="inherit"
                                    disabled={actionPending}
                                    onClick={() => handleDelete(post)}
                                  >
                                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {paginatedPosts.map((post) => (
                      <Grid key={post.id} size={{ xs: 12, md: 6, xl: 4 }}>
                        <Card
                          variant="outlined"
                          sx={{ height: 1, borderRadius: 2.5, overflow: 'hidden' }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              pt: '56%',
                              bgcolor: 'grey.100',
                              borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
                            }}
                          >
                            {post.featured_image ? (
                              <Box
                                component="img"
                                src={post.featured_image}
                                alt={post.cover_alt || post.title}
                                sx={{
                                  inset: 0,
                                  width: 1,
                                  height: 1,
                                  objectFit: 'cover',
                                  position: 'absolute',
                                }}
                              />
                            ) : (
                              <Stack
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                  inset: 0,
                                  px: 2,
                                  position: 'absolute',
                                  color: 'text.secondary',
                                  background:
                                    'linear-gradient(135deg, rgba(8, 56, 61, 0.08) 0%, rgba(8, 56, 61, 0.18) 100%)',
                                }}
                              >
                                <Iconify icon="solar:gallery-wide-bold" width={28} />
                                <Typography variant="caption">No cover image</Typography>
                              </Stack>
                            )}
                          </Box>

                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.25}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                                justifyContent="space-between"
                              >
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  color={statusColor(post.status)}
                                  label={getStatusLabel(post.status)}
                                />
                                {post.featured_on_home ? (
                                  <Chip size="small" color="info" variant="outlined" label="Featured" />
                                ) : null}
                              </Stack>

                              <Box>
                                <Link
                                  component={RouterLink}
                                  href={adminRoutes.blogPostEdit(post.id)}
                                  underline="hover"
                                  color="inherit"
                                  sx={{
                                    fontWeight: 700,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {post.title}
                                </Link>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mt: 0.5,
                                    display: 'block',
                                    color: 'text.secondary',
                                    fontFamily: 'monospace',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  /{post.slug}
                                </Typography>
                              </Box>

                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {post.read_time_minutes ?? 5} min read
                                <Box component="span" sx={{ px: 0.75 }}>
                                  |
                                </Box>
                                0 views
                              </Typography>

                              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={post.category?.name || 'Uncategorized'}
                                />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {post.author?.name || 'Unassigned'}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Tooltip title={formatDateTime(post.updated_at)} placement="top">
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Updated {formatRelativeTime(post.updated_at)}
                                  </Typography>
                                </Tooltip>
                              </Stack>

                              <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                                <Tooltip title="View post">
                                  <IconButton
                                    component="a"
                                    href={resolvePublicPreviewUrl(post.slug)}
                                    target="_blank"
                                    rel="noreferrer"
                                    size="small"
                                    color="inherit"
                                  >
                                    <Iconify icon="solar:eye-bold" width={18} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Duplicate draft">
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="inherit"
                                      disabled={actionPending}
                                      onClick={() => handleDuplicate(post)}
                                    >
                                      <Iconify icon="solar:copy-bold" width={18} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Edit post">
                                  <IconButton
                                    component={RouterLink}
                                    href={adminRoutes.blogPostEdit(post.id)}
                                    size="small"
                                    color="inherit"
                                  >
                                    <Iconify icon="solar:pen-bold" width={18} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete post">
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="inherit"
                                      disabled={actionPending}
                                      onClick={() => handleDelete(post)}
                                    >
                                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider />

              <Box
                sx={{
                  px: 3,
                  py: 2,
                  gap: 1.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Showing {pageStart}-{pageEnd} of {filteredPosts.length} posts
                </Typography>

                {totalPages > 1 ? (
                  <Pagination
                    page={page}
                    count={totalPages}
                    color="primary"
                    size="small"
                    onChange={(_, value) => setPage(value)}
                  />
                ) : null}
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">No posts matched the current filter.</Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

function BlogPostEditorPanel({ match }: { match: AdminRouteMatch }) {
  const isEditMode = match.mode === 'edit';
  const router = useRouter();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { admin, hasPermission } = useAuth();
  const [message, setMessage] = useState<FormMessage>(null);
  const [activeStep, setActiveStep] = useState<BlogEditorStepKey>('basics');
  const [pendingFocusField, setPendingFocusField] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverDragActive, setCoverDragActive] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditMode);
  const [values, setValues] = useState<BlogEditorValues>(defaultBlogEditorValues);

  const postQuery = useQuery({
    queryKey: ['admin-next', 'blog-posts', match.entityId],
    queryFn: () => getAdminBlogPost(match.entityId!),
    enabled: isEditMode && Boolean(match.entityId),
  });
  const categoriesQuery = useQuery({
    queryKey: ['admin-next', 'blog-categories'],
    queryFn: listAdminBlogCategories,
  });
  const authorsQuery = useQuery({
    queryKey: ['admin-next', 'blog-authors'],
    queryFn: listAdminBlogAuthors,
  });

  const originalPost = postQuery.data ?? null;
  const categoryRecords = useMemo(
    () => dedupeNamedRecords(categoriesQuery.data ?? []),
    [categoriesQuery.data]
  );
  const authorRecords = useMemo(
    () => dedupeNamedRecords(authorsQuery.data ?? []),
    [authorsQuery.data]
  );
  const seoScore = useMemo(() => estimateSeoScore(values), [values]);
  const publishRequirements = useMemo(() => buildPublishRequirements(values), [values]);
  const bodyWordCount = useMemo(() => countWords(values.body), [values.body]);
  const coverPreviewUrl = values.featuredImage.trim() || values.ogImageUrl.trim();
  const activeStepIndex = blogEditorSteps.findIndex((step) => step.key === activeStep);
  const publishReadyCount = publishRequirements.filter((item) => item.done).length;
  const publishProgress = Math.round((publishReadyCount / publishRequirements.length) * 100);
  const missingRequirements = publishRequirements.filter((item) => !item.done);
  const canPublish = missingRequirements.length === 0;
  const selectedCategory =
    categoryRecords.find((item) => String(item.id) === values.categoryId) ?? null;
  const selectedAuthor = authorRecords.find((item) => String(item.id) === values.authorId) ?? null;
  const isFocusMode = useMemo(
    () => new URLSearchParams(location.search).get('focus') === '1',
    [location.search]
  );
  const previewSlug = clampEditorSlug(values.slug || values.title);
  const previewUrl = previewSlug ? resolvePublicPreviewUrl(previewSlug) : '';
  const editorTitle = values.title.trim() || 'Untitled draft';
  const currentStatus = values.status || 'draft';
  const adminIdentity = admin?.email || 'admin@example.com';
  const saveStateLabel = originalPost ? 'Saved changes' : 'Not saved yet';
  const statusLine = `${getStatusLabel(currentStatus)} / ${saveStateLabel} / ${adminIdentity}`;
  const statusNote = originalPost
    ? currentStatus === 'published'
      ? 'Published version is live.'
      : currentStatus === 'pending_review'
        ? 'Awaiting reviewer approval.'
        : currentStatus === 'rejected'
          ? 'Changes requested. Update the post, then submit it again.'
          : currentStatus === 'archived'
            ? 'Archived posts stay out of the public site until republished.'
            : 'Draft saved and ready for edits'
    : 'Draft not saved yet';
  const nextRequirementText = missingRequirements.length
    ? `Next: ${missingRequirements
        .slice(0, 2)
        .map((item) => item.label)
        .join(', ')}.`
    : 'All required publish fields are complete.';

  useEffect(() => {
    if (isEditMode) {
      if (!postQuery.data) {
        return;
      }

      setValues(createEditorValues(postQuery.data));
      setSlugManuallyEdited(true);
      setActiveStep('basics');
      setMessage(null);
      setCoverUploadError(null);
      return;
    }

    setValues(defaultBlogEditorValues);
    setSlugManuallyEdited(false);
    setActiveStep('basics');
    setMessage(null);
    setCoverUploadError(null);
  }, [isEditMode, postQuery.data]);

  useEffect(() => {
    if (!pendingFocusField) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const fieldContainer = document.querySelector(
        `[data-blog-field="${pendingFocusField}"]`
      ) as HTMLElement | null;

      if (!fieldContainer) {
        return;
      }

      fieldContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const focusTarget = (
        fieldContainer.matches('input, textarea, [contenteditable="true"]')
          ? fieldContainer
          : fieldContainer.querySelector(
              'input, textarea, [contenteditable="true"], button, [role="combobox"]'
            )
      ) as HTMLElement | null;

      window.setTimeout(() => focusTarget?.focus(), 120);
    });

    setPendingFocusField(null);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeStep, pendingFocusField]);

  const saveMutation = useMutation({
    mutationFn: async (nextValues: BlogEditorValues) => {
      const payload = createPayload(nextValues, originalPost);

      if (isEditMode && match.entityId) {
        return updateAdminBlogPost(match.entityId, payload);
      }

      return createAdminBlogPost(payload);
    },
    onSuccess: async (savedPost) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts', savedPost.id] }),
      ]);

      setValues(createEditorValues(savedPost));
      setSlugManuallyEdited(true);
      setMessage({
        tone: 'success',
        text: isEditMode ? 'Blog post saved.' : 'Blog post draft created.',
      });

      if (!isEditMode) {
        router.replace(adminRoutes.blogPostEdit(savedPost.id));
      }
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to save blog post changes.'),
      });
    },
  });

  const workflowMutation = useMutation({
    mutationFn: async (action: BlogWorkflowAction) => {
      const targetId = originalPost?.id ?? match.entityId;

      if (!targetId) {
        throw new Error('Save this blog post before running workflow actions.');
      }

      switch (action) {
        case 'submit':
          return submitAdminBlogPostForReview(targetId);
        case 'approve':
          return approveAdminBlogPost(targetId);
        case 'reject':
          return rejectAdminBlogPost(targetId);
        case 'publish':
          return publishAdminBlogPost(targetId);
        case 'archive':
          return archiveAdminBlogPost(targetId);
        default:
          throw new Error('Unsupported workflow action.');
      }
    },
    onSuccess: async (savedPost, action) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'blog-posts', savedPost.id] }),
      ]);

      setValues(createEditorValues(savedPost));
      setSlugManuallyEdited(true);

      const successMessages: Record<BlogWorkflowAction, string> = {
        submit: 'Blog post submitted for review.',
        approve: 'Blog post approved and published.',
        reject: 'Blog post rejected and returned to the author.',
        publish: 'Blog post published.',
        archive: 'Blog post archived.',
      };

      setMessage({ tone: 'success', text: successMessages[action] });
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to run this workflow action.'),
      });
    },
  });

  const canSubmitForReview =
    Boolean(originalPost) &&
    hasPermission('blog_post.submit_review') &&
    (currentStatus === 'draft' || currentStatus === 'rejected');
  const canApprove =
    Boolean(originalPost) &&
    hasPermission('blog_post.approve') &&
    currentStatus === 'pending_review';
  const canReject =
    Boolean(originalPost) &&
    hasPermission('blog_post.reject') &&
    currentStatus === 'pending_review';
  const canPublishDirectly =
    Boolean(originalPost) &&
    hasPermission('blog_post.publish') &&
    (currentStatus === 'draft' || currentStatus === 'pending_review' || currentStatus === 'rejected');
  const canArchivePost =
    Boolean(originalPost) &&
    hasPermission('blog_post.archive') &&
    currentStatus !== 'archived';
  const isActionPending = saveMutation.isPending || workflowMutation.isPending;

  if (isEditMode && !match.entityId) {
    return <ErrorState error={new Error('Missing blog post id.')} fallback="Missing blog post id." />;
  }

  if (
    categoriesQuery.isLoading ||
    authorsQuery.isLoading ||
    (isEditMode && postQuery.isLoading)
  ) {
    return <LoadingState label="Loading blog editor..." />;
  }

  if (categoriesQuery.isError) {
    return <ErrorState error={categoriesQuery.error} fallback="Unable to load blog categories." />;
  }

  if (authorsQuery.isError) {
    return <ErrorState error={authorsQuery.error} fallback="Unable to load blog authors." />;
  }

  if (isEditMode && postQuery.isError) {
    return <ErrorState error={postQuery.error} fallback="Unable to load blog post." />;
  }

  function updateField<K extends keyof BlogEditorValues>(field: K, value: BlogEditorValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function uploadCoverFile(file?: File | null) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setCoverUploadError('Choose an image file for the blog cover.');
      return;
    }

    setCoverUploading(true);
    setCoverUploadError(null);

    try {
      const media = await uploadMediaFile(file, values.coverAlt || undefined);

      setValues((current) => ({
        ...current,
        featuredImage: media.url,
        ogImageUrl: current.ogImageUrl || media.url,
      }));
    } catch (error) {
      setCoverUploadError(getAdminErrorMessage(error, 'Unable to upload cover image.'));
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    await uploadCoverFile(file);
  }

  async function handleCoverDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setCoverDragActive(false);
    await uploadCoverFile(event.dataTransfer.files?.[0]);
  }

  function handleSave() {
    const nextValues: BlogEditorValues = {
      ...values,
      slug: clampEditorSlug(values.slug) || clampEditorSlug(values.title) || 'untitled-post',
    };

    setMessage(null);
    saveMutation.mutate(nextValues);
  }

  async function handleInlineImageUpload(file: File) {
    try {
      const media = await uploadMediaFile(file);
      return media.url;
    } catch (error) {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to upload inline image.'),
      });
      return null;
    }
  }

  function goToStep(step: BlogEditorStepKey) {
    setActiveStep(step);
  }

  function toggleFocusMode() {
    router.replace(withFocusSearch(location.pathname, location.search, !isFocusMode));
  }

  function jumpToRequirement(item: PublishRequirement) {
    setActiveStep(item.step);
    setPendingFocusField(item.key);
  }

  function goToNextStep() {
    const nextStep = blogEditorSteps[activeStepIndex + 1];

    if (nextStep) {
      setActiveStep(nextStep.key);
    }
  }

  function goToPreviousStep() {
    const previousStep = blogEditorSteps[activeStepIndex - 1];

    if (previousStep) {
      setActiveStep(previousStep.key);
    }
  }

  function renderActiveStep() {
    switch (activeStep) {
      case 'basics':
        return (
          <Grid container spacing={3}>
            <Grid data-blog-field="title" size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                value={values.title}
                onChange={(event) => {
                  const nextTitle = event.target.value;

                  setValues((current) => ({
                    ...current,
                    title: nextTitle,
                    slug:
                      !slugManuallyEdited || !current.slug.trim()
                        ? clampEditorSlug(nextTitle)
                        : current.slug,
                  }));
                }}
                helperText="Make the headline clear and publication-ready."
              />
            </Grid>
            <Grid data-blog-field="slug" size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Slug"
                value={values.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  updateField('slug', clampEditorSlug(event.target.value));
                }}
                helperText={`URL-friendly, lowercase, and limited to ${SLUG_MAX_WORDS} words.`}
                inputProps={{ maxLength: SLUG_MAX_LENGTH }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                size="small"
                sx={{ height: '100%' }}
                onClick={() => {
                  setSlugManuallyEdited(true);
                  updateField('slug', clampEditorSlug(values.title));
                }}
              >
                Generate slug
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Excerpt"
                value={values.excerpt}
                onChange={(event) => updateField('excerpt', event.target.value)}
                helperText={`${values.excerpt.trim().length} characters. Keep it sharp and scannable.`}
              />
            </Grid>
            <Grid data-blog-field="category" size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={values.categoryId}
                onChange={(event) => updateField('categoryId', event.target.value)}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {categoryRecords.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid data-blog-field="author" size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Author"
                value={values.authorId}
                onChange={(event) => updateField('authorId', event.target.value)}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {authorRecords.map((author) => (
                  <MenuItem key={author.id} value={String(author.id)}>
                    {author.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      case 'content':
        return (
          <Stack spacing={3}>
            <Box data-blog-field="body">
              <RichTextEditor
                value={values.body}
                focusMode={isFocusMode}
                onChange={(value) => updateField('body', value)}
                onUploadImage={handleInlineImageUpload}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Read time"
                  value={values.readTimeMinutes}
                  onChange={(event) =>
                    updateField('readTimeMinutes', event.target.value.replace(/[^\d]/g, ''))
                  }
                  helperText="Minutes only."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Related slugs"
                  value={values.relatedSlugs}
                  onChange={(event) => updateField('relatedSlugs', event.target.value)}
                  helperText="One slug per line or comma-separated."
                />
              </Grid>
            </Grid>
          </Stack>
        );
      case 'seo':
        return (
          <Stack spacing={3}>
            <Box data-blog-field="cover">
              <Paper
                variant="outlined"
                onDragOver={(event) => {
                  event.preventDefault();
                  setCoverDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setCoverDragActive(false);
                }}
                onDrop={handleCoverDrop}
                sx={{
                  p: coverPreviewUrl ? 1.5 : 3,
                  borderRadius: 2.5,
                  borderStyle: 'dashed',
                  borderWidth: 1.5,
                  textAlign: 'center',
                  color: 'text.secondary',
                  borderColor: coverDragActive ? 'primary.main' : 'divider',
                  bgcolor: coverDragActive ? 'action.hover' : 'background.paper',
                  transition: (theme) =>
                    theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  boxShadow: coverDragActive ? '0 0 0 3px rgba(8, 56, 61, 0.08)' : 'none',
                }}
              >
                {coverPreviewUrl ? (
                  <Stack spacing={1.5}>
                    <Box
                      component="img"
                      alt={values.coverAlt || values.title || 'Blog cover preview'}
                      src={coverPreviewUrl}
                      sx={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Drag a new cover image here, or upload one from your device.
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1.25} alignItems="center">
                    <Iconify icon="solar:cloud-upload-bold" width={34} />
                    <Typography variant="subtitle2">Drop cover image here</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                      Drag and drop an image to upload it instantly, or use the upload button below.
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </Box>

            {coverUploading ? <LinearProgress /> : null}
            {coverUploadError ? <Alert severity="error">{coverUploadError}</Alert> : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component="label" variant="outlined" disabled={coverUploading}>
                Upload image
                <input hidden accept="image/*" type="file" onChange={handleCoverUpload} />
              </Button>
            </Stack>

            <Grid container spacing={3}>
              <Grid data-blog-field="cover" size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Featured image URL"
                  value={values.featuredImage}
                  onChange={(event) => updateField('featuredImage', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Cover alt text"
                  value={values.coverAlt}
                  onChange={(event) => updateField('coverAlt', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Media label"
                  value={values.mediaLabel}
                  onChange={(event) => updateField('mediaLabel', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Meta title"
                  value={values.metaTitle}
                  onChange={(event) => updateField('metaTitle', event.target.value)}
                  helperText={`${values.metaTitle.trim().length} characters`}
                />
              </Grid>
              <Grid data-blog-field="meta-description" size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Meta description"
                  value={values.metaDescription}
                  onChange={(event) => updateField('metaDescription', event.target.value)}
                  helperText={`${values.metaDescription.trim().length} characters`}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Open Graph image URL"
                  value={values.ogImageUrl}
                  onChange={(event) => updateField('ogImageUrl', event.target.value)}
                />
              </Grid>
            </Grid>
          </Stack>
        );
      case 'publish':
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {coverPreviewUrl ? (
                  <Box
                    component="img"
                    alt={values.coverAlt || values.title || 'Post cover'}
                    src={coverPreviewUrl}
                    sx={{
                      width: '100%',
                      height: { xs: 220, md: 280 },
                      objectFit: 'cover',
                      display: 'block',
                      bgcolor: 'background.neutral',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: { xs: 220, md: 280 },
                      display: 'grid',
                      placeItems: 'center',
                      color: 'text.secondary',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Stack spacing={1.25} alignItems="center">
                      <Iconify icon="solar:gallery-wide-bold" width={34} />
                      <Typography variant="subtitle2">Add a cover image</Typography>
                    </Stack>
                  </Box>
                )}

                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
                      <Chip
                        size="small"
                        color={statusColor(values.status)}
                        label={getStatusLabel(values.status)}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Final review
                      </Typography>
                    </Stack>

                    <Box>
                      <Typography variant="h4">{values.title.trim() || 'Untitled draft'}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.75, color: 'text.secondary', fontFamily: 'monospace' }}
                      >
                        /{values.slug || 'untitled-draft'}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {values.excerpt.trim() || 'Add a short excerpt so the final preview reads clearly.'}
                    </Typography>

                    <Grid container spacing={1.5}>
                      {[
                        {
                          label: 'Category',
                          value: selectedCategory?.name?.trim() || 'Not selected',
                        },
                        {
                          label: 'Author',
                          value: selectedAuthor?.name?.trim() || 'Not selected',
                        },
                        {
                          label: 'Body words',
                          value: String(bodyWordCount),
                        },
                        {
                          label: 'SEO strength',
                          value: `${seoScore}%`,
                        },
                        {
                          label: 'Cover image',
                          value: coverPreviewUrl ? 'Ready' : 'Missing',
                        },
                        {
                          label: 'Featured slot',
                          value: values.featuredSlot || 'None',
                        },
                      ].map((item) => (
                        <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {item.label}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                              {item.value}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={3}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardHeader
                    title="Publishing Readiness"
                    subheader="Mandatory fields for a clean Exxonim post."
                  />
                  <Divider />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {publishReadyCount} of {publishRequirements.length} required fields complete.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {nextRequirementText}
                      </Typography>

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">Progress</Typography>
                          <Typography variant="subtitle2">{publishProgress}%</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={publishProgress}
                          sx={{ height: 8, borderRadius: 999 }}
                        />
                      </Box>

                      <Stack spacing={1}>
                        {publishRequirements.map((item) => (
                          <Button
                            key={item.key}
                            type="button"
                            variant="outlined"
                            color={item.done ? 'success' : 'inherit'}
                            onClick={() => jumpToRequirement(item)}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: 2,
                              justifyContent: 'space-between',
                              textTransform: 'none',
                            }}
                            endIcon={
                              <Iconify
                                width={16}
                                icon={item.done ? 'solar:check-circle-bold' : 'solar:alt-arrow-right-bold'}
                              />
                            }
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3 }}>
                  <CardHeader
                    title="Publishing"
                    subheader="Status, timing, placement, and release controls."
                  />
                  <Divider />
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Workflow status"
                        value={getStatusLabel(values.status)}
                        helperText="Status changes happen through the workflow buttons, not this form."
                        slotProps={{ input: { readOnly: true } }}
                      />

                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Published at"
                        value={values.publishedAt}
                        onChange={(event) => updateField('publishedAt', event.target.value)}
                        disabled={values.status !== 'published'}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />

                      <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            updateField('publishedAt', toDatetimeLocalValue(new Date().toISOString()))
                          }
                          disabled={values.status !== 'published'}
                        >
                          Use now
                        </Button>
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={values.featuredOnHome}
                              onChange={(_, checked) => updateField('featuredOnHome', checked)}
                            />
                          }
                          label="Featured on home"
                        />
                      </Stack>

                      <TextField
                        select
                        fullWidth
                        label="Featured slot"
                        value={values.featuredSlot}
                        onChange={(event) => updateField('featuredSlot', event.target.value)}
                      >
                        {featuredSlotOptions.map((option) => (
                          <MenuItem key={option.value || 'none'} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <Stack spacing={3}>
        <ActionToast message={message} onClose={() => setMessage(null)} />

        <Card
          sx={{
            borderRadius: isFocusMode ? 2 : 3,
            minHeight: isFocusMode ? 'calc(100vh - 92px)' : undefined,
            boxShadow: isFocusMode ? 'none' : undefined,
          }}
        >
          <CardHeader
            title={editorTitle}
            subheader={
              <Stack spacing={0.25} sx={{ pt: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {statusLine}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {statusNote}
                </Typography>
              </Stack>
            }
            action={
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                {!isFocusMode ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`Step ${activeStepIndex + 1} of ${blogEditorSteps.length}`}
                  />
                ) : null}
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={toggleFocusMode}
                >
                  {isFocusMode ? 'Exit focus' : 'Focus mode'}
                </Button>
              </Stack>
            }
          />
          <Divider />
          <CardContent sx={{ p: isFocusMode ? { xs: 2, md: 2.5 } : { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={3}>
              <Button
                type="button"
                size="small"
                variant="text"
                color="inherit"
                sx={{ alignSelf: 'flex-start' }}
                startIcon={<Iconify icon="solar:alt-arrow-left-linear" width={18} />}
                onClick={() => router.push(adminRoutes.blogPosts)}
              >
                Back to posts
              </Button>

              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={2}
                alignItems={{ lg: 'flex-start' }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    type="button"
                    size="small"
                    variant="outlined"
                    color="inherit"
                    disabled={!originalPost || !previewSlug}
                    onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    variant="outlined"
                    onClick={handleSave}
                    disabled={isActionPending}
                  >
                    {isEditMode ? 'Save changes' : 'Create draft'}
                  </Button>
                  {canSubmitForReview ? (
                    <Button
                      type="button"
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => workflowMutation.mutate('submit')}
                      disabled={isActionPending}
                    >
                      Submit for review
                    </Button>
                  ) : null}
                  {canReject ? (
                    <Button
                      type="button"
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => workflowMutation.mutate('reject')}
                      disabled={isActionPending}
                    >
                      Reject
                    </Button>
                  ) : null}
                  {canApprove ? (
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => workflowMutation.mutate('approve')}
                      disabled={isActionPending || !canPublish}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {canPublishDirectly ? (
                    <Button
                      type="button"
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => workflowMutation.mutate('publish')}
                      disabled={isActionPending || !canPublish}
                    >
                      Publish
                    </Button>
                  ) : null}
                  {canArchivePost ? (
                    <Button
                      type="button"
                      size="small"
                      variant="text"
                      color="inherit"
                      onClick={() => workflowMutation.mutate('archive')}
                      disabled={isActionPending}
                    >
                      Archive
                    </Button>
                  ) : null}
                </Stack>
              </Stack>

              {!isFocusMode ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    background:
                      'linear-gradient(135deg, rgba(8, 56, 61, 0.04) 0%, rgba(255, 255, 255, 0.96) 100%)',
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={0.75}
                      justifyContent="space-between"
                      alignItems={{ sm: 'center' }}
                    >
                      <Typography variant="subtitle2">Publishing Progress</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {publishReadyCount} of {publishRequirements.length} required fields complete
                      </Typography>
                    </Stack>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {activeStep === 'publish' ? 'Final review' : nextRequirementText}
                        </Typography>
                        <Typography variant="subtitle2">{publishProgress}%</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={publishProgress}
                        sx={{ height: 8, borderRadius: 999 }}
                      />
                    </Box>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {publishRequirements.map((item) => (
                        <Button
                          key={item.key}
                          type="button"
                          size="small"
                          variant={item.done ? 'contained' : 'outlined'}
                          color={item.done ? 'success' : 'inherit'}
                          onClick={() => jumpToRequirement(item)}
                          sx={{
                            minWidth: 0,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 999,
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              ) : null}

              {!isFocusMode ? (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {blogEditorSteps.map((step) => (
                    <Button
                      key={step.key}
                      type="button"
                      size="small"
                      variant={activeStep === step.key ? 'contained' : 'outlined'}
                      color={activeStep === step.key ? 'primary' : 'inherit'}
                      onClick={() => goToStep(step.key)}
                    >
                      {step.label}
                    </Button>
                  ))}
                </Stack>
              ) : null}

              {renderActiveStep()}

              {!isFocusMode ? (
                <>
                  <Divider />

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    justifyContent="space-between"
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      color="inherit"
                      onClick={goToPreviousStep}
                      disabled={activeStepIndex === 0}
                    >
                      Previous
                    </Button>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button
                        type="button"
                        variant="text"
                        size="small"
                        color="inherit"
                        onClick={handleSave}
                        disabled={isActionPending}
                      >
                        Save changes
                      </Button>

                      {activeStepIndex < blogEditorSteps.length - 1 ? (
                        <Button type="button" size="small" variant="contained" onClick={goToNextStep}>
                          Continue
                        </Button>
                      ) : (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                          {canSubmitForReview ? (
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              color="warning"
                              onClick={() => workflowMutation.mutate('submit')}
                              disabled={isActionPending}
                            >
                              Submit for review
                            </Button>
                          ) : null}
                          {canReject ? (
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => workflowMutation.mutate('reject')}
                              disabled={isActionPending}
                            >
                              Reject
                            </Button>
                          ) : null}
                          {canApprove ? (
                            <Button
                              type="button"
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => workflowMutation.mutate('approve')}
                              disabled={isActionPending || !canPublish}
                            >
                              Approve now
                            </Button>
                          ) : null}
                          {canPublishDirectly ? (
                            <Button
                              type="button"
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => workflowMutation.mutate('publish')}
                              disabled={isActionPending || !canPublish}
                            >
                              Publish now
                            </Button>
                          ) : null}
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export function BlogPostsRoutePanel({ match }: { match: AdminRouteMatch }) {
  if (match.mode === 'index') {
    return <BlogPostsIndexPanel />;
  }

  return <BlogPostEditorPanel match={match} />;
}
