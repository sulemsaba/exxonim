import type { ChangeEvent } from 'react';
import type { AdminRouteMatch } from '@exxonim/admin-core/lib/adminRoutes';
import type {
  ApiBlogPost,
  ApiBlogAuthor,
  ApiBlogStatus,
  ApiBlogCategory,
} from '@exxonim/admin-core/types/api';

import { useMemo, useState, useEffect } from 'react';
import { legacyBlogPost } from '@exxonim/admin-core/routes';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMediaFile } from '@exxonim/admin-core/services/adminMediaService';
import {
  slugify,
  getAdminErrorMessage,
  toDatetimeLocalValue,
  fromDatetimeLocalValue,
} from '@exxonim/admin-core/utils/admin';
import {
  getAdminBlogPost,
  createAdminBlogPost,
  updateAdminBlogPost,
  listAdminBlogAuthors,
  listAdminBlogPostsPage,
  listAdminBlogCategories,
  type AdminBlogPostPayload,
} from '@exxonim/admin-core/services/adminBlogService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
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

const statusOptions: Array<{ value: ApiBlogStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
];

function LoadingState({ label }: { label: string }) {
  return <Alert severity="info">{label}</Alert>;
}

function ErrorState({ error, fallback }: { error: unknown; fallback: string }) {
  return <Alert severity="error">{getAdminErrorMessage(error, fallback)}</Alert>;
}

function SaveMessage({ message }: { message: FormMessage }) {
  if (!message) {
    return null;
  }

  return <Alert severity={message.tone === 'success' ? 'success' : 'error'}>{message.text}</Alert>;
}

function statusColor(status?: string | null): MuiChipColor {
  switch (status) {
    case 'published':
      return 'success';
    case 'scheduled':
      return 'warning';
    case 'archived':
      return 'error';
    default:
      return 'default';
  }
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
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
    values.status === 'draft' || values.status === 'archived'
      ? null
      : fromDatetimeLocalValue(values.publishedAt) ??
        (values.status === 'published' ? new Date().toISOString() : null);

  return {
    title: values.title.trim() || 'Untitled post',
    slug: values.slug.trim() || slugify(values.title) || 'untitled-post',
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

function buildReadinessItems(values: BlogEditorValues) {
  const items: string[] = [];

  if (values.title.trim()) items.push('Title set');
  if (values.slug.trim()) items.push('Slug ready');
  if (values.excerpt.trim().length >= 48) items.push('Excerpt strong');
  if (countWords(values.body) >= 140) items.push('Body substantial');
  if (values.metaTitle.trim()) items.push('Meta title');
  if (values.metaDescription.trim()) items.push('Meta description');
  if (values.featuredImage.trim() || values.ogImageUrl.trim()) items.push('Social image');
  if (values.categoryId) items.push('Category assigned');
  if (values.authorId) items.push('Author assigned');

  return items;
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

function getStatusLabel(status?: string | null) {
  if (status === 'archived') {
    return 'Trash';
  }

  return status || 'Draft';
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<BlogViewMode>('table');
  const [sortBy, setSortBy] = useState<BlogSortValue>('newest');
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const listQuery = useQuery({
    queryKey: ['admin-next', 'blog-posts', 'page'],
    queryFn: () => listAdminBlogPostsPage({ page: 1, limit: 30 }),
  });

  const postItems = listQuery.data?.items;
  const posts = useMemo(() => postItems ?? [], [postItems]);
  const pageSize = viewMode === 'cards' ? 6 : 8;

  const categoryOptions = useMemo(() => {
    const seen = new Set<number>();

    return posts
      .filter((post) => post.category?.id && !seen.has(post.category.id))
      .map((post) => {
        seen.add(post.category!.id);
        return post.category!;
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [posts]);

  const authorOptions = useMemo(() => {
    const seen = new Set<number>();

    return posts
      .filter((post) => post.author?.id && !seen.has(post.author.id))
      .map((post) => {
        seen.add(post.author!.id);
        return post.author!;
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [posts]);

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
        categoryFilter === 'all' || String(post.category?.id ?? '') === categoryFilter;
      const matchesAuthor = authorFilter === 'all' || String(post.author?.id ?? '') === authorFilter;

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

  return (
    <Stack spacing={3}>
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
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="archived">Trash</MenuItem>
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
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
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
                  <MenuItem key={author.id} value={String(author.id)}>
                    {author.name}
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
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 1080 }}>
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
                          <TableCell sx={{ minWidth: 420, maxWidth: 0 }}>
                            <Stack spacing={0.9}>
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
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
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
                                  |
                                </Box>
                                0 views
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ minWidth: 160 }}>
                            <Stack spacing={0.35}>
                              <Typography variant="body2">
                                {post.category?.name || 'Uncategorized'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {post.featured_slot || 'Standard grid'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ minWidth: 190 }}>
                            <Stack spacing={0.25}>
                              <Typography variant="body2">
                                {post.author?.name || 'Unassigned'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {post.author?.role || 'Editorial team'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ minWidth: 140 }}>
                            <Chip
                              size="small"
                              variant="outlined"
                              color={statusColor(post.status)}
                              label={getStatusLabel(post.status)}
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 160 }}>
                            <Stack spacing={0.25}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {formatDateTime(post.updated_at)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {formatRelativeTime(post.updated_at)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 180 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                component="a"
                                href={resolvePublicPreviewUrl(post.slug)}
                                target="_blank"
                                rel="noreferrer"
                                variant="text"
                                size="small"
                                color="inherit"
                              >
                                Open
                              </Button>
                              <Button
                                component={RouterLink}
                                href={adminRoutes.blogPostEdit(post.id)}
                                variant="text"
                                size="small"
                                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />}
                              >
                                Edit
                              </Button>
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
                        <Card variant="outlined" sx={{ height: 1, borderRadius: 2.5 }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.5}>
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

                              {post.excerpt ? (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    minHeight: 64,
                                  }}
                                >
                                  {post.excerpt}
                                </Typography>
                              ) : null}

                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {post.read_time_minutes ?? 5} min read
                                <Box component="span" sx={{ px: 0.75 }}>
                                  |
                                </Box>
                                0 views
                              </Typography>

                              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={post.category?.name || 'Uncategorized'}
                                />
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={post.featured_slot || 'Standard grid'}
                                />
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={1.25}
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography variant="body2">
                                    {post.author?.name || 'Unassigned'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {post.author?.role || 'Editorial team'}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {formatDateTime(post.updated_at)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {formatRelativeTime(post.updated_at)}
                                  </Typography>
                                </Box>
                              </Stack>

                              <Stack direction="row" spacing={1}>
                                <Button
                                  component="a"
                                  href={resolvePublicPreviewUrl(post.slug)}
                                  target="_blank"
                                  rel="noreferrer"
                                  variant="text"
                                  color="inherit"
                                >
                                  Open
                                </Button>
                                <Button
                                  component={RouterLink}
                                  href={adminRoutes.blogPostEdit(post.id)}
                                  variant="outlined"
                                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />}
                                >
                                  Edit post
                                </Button>
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
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<FormMessage>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
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
  const seoScore = useMemo(() => estimateSeoScore(values), [values]);
  const readinessItems = useMemo(() => buildReadinessItems(values), [values]);
  const bodyWordCount = useMemo(() => countWords(values.body), [values.body]);
  const coverPreviewUrl = values.featuredImage.trim() || values.ogImageUrl.trim();

  useEffect(() => {
    if (isEditMode) {
      if (!postQuery.data) {
        return;
      }

      setValues(createEditorValues(postQuery.data));
      setSlugManuallyEdited(true);
      setMessage(null);
      setCoverUploadError(null);
      return;
    }

    setValues(defaultBlogEditorValues);
    setSlugManuallyEdited(false);
    setMessage(null);
    setCoverUploadError(null);
  }, [isEditMode, postQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (nextValues: BlogEditorValues) => {
      const payload = createPayload(nextValues, originalPost);

      if (isEditMode && match.entityId) {
        return updateAdminBlogPost(match.entityId, payload);
      }

      return createAdminBlogPost(payload);
    },
    onSuccess: async (savedPost, submittedValues) => {
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
        text:
          submittedValues.status === 'published'
            ? 'Blog post published.'
            : isEditMode
              ? 'Blog post updated.'
              : 'Blog post created.',
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

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
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

  function handleSubmit(nextStatus?: ApiBlogStatus) {
    const normalizedStatus = nextStatus ?? values.status;
    const nextValues: BlogEditorValues = {
      ...values,
      status: normalizedStatus,
      slug: values.slug.trim() || slugify(values.title) || 'untitled-post',
      publishedAt:
        normalizedStatus === 'published' && !values.publishedAt
          ? toDatetimeLocalValue(new Date().toISOString())
          : values.publishedAt,
    };

    setMessage(null);
    saveMutation.mutate(nextValues);
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing={3}>
        <SaveMessage message={message} />

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            display: 'grid',
            gap: 2,
            background:
              'linear-gradient(135deg, rgba(8, 56, 61, 0.08) 0%, rgba(255, 255, 255, 0.92) 100%)',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            alignItems={{ lg: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                <Chip
                  size="small"
                  variant="outlined"
                  color={statusColor(values.status)}
                  label={values.status}
                />
                {values.featuredOnHome ? (
                  <Chip size="small" variant="outlined" color="info" label="Featured on home" />
                ) : null}
                <Chip size="small" variant="outlined" label={`${bodyWordCount} words`} />
                <Chip size="small" variant="outlined" label={`SEO ${seoScore}%`} />
              </Stack>
              <Typography variant="h4" sx={{ mt: 1.5 }}>
                {isEditMode ? values.title || 'Edit blog post' : 'New blog post'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', maxWidth: 720 }}>
                Build and publish Exxonim articles inside the Material Kit shell, with live blog
                APIs, structured metadata, and a cleaner editorial workflow.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={() => router.push(adminRoutes.blogPosts)}
              >
                Back to posts
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => handleSubmit('draft')}
                disabled={saveMutation.isPending || coverUploading}
              >
                Save draft
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saveMutation.isPending || coverUploading}
                startIcon={<Iconify icon="solar:diskette-bold" />}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="success"
                onClick={() => handleSubmit('published')}
                disabled={saveMutation.isPending || coverUploading}
              >
                Publish now
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title="Post content"
                  subheader="Core editorial fields for title, slug, excerpt, and body."
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
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
                                ? slugify(nextTitle)
                                : current.slug,
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <TextField
                        fullWidth
                        label="Slug"
                        value={values.slug}
                        onChange={(event) => {
                          setSlugManuallyEdited(true);
                          updateField('slug', slugify(event.target.value));
                        }}
                        helperText="URL-friendly and lowercase."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant="outlined"
                        sx={{ height: '100%' }}
                        onClick={() => {
                          setSlugManuallyEdited(true);
                          updateField('slug', slugify(values.title));
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
                        helperText={`${values.excerpt.trim().length} characters`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={18}
                        label="Body"
                        value={values.body}
                        onChange={(event) => updateField('body', event.target.value)}
                        helperText="Plain text paragraphs are supported. HTML is preserved if you paste or maintain HTML content."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title="Search and social metadata"
                  subheader="Control search snippets and social share fields."
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Meta title"
                        value={values.metaTitle}
                        onChange={(event) => updateField('metaTitle', event.target.value)}
                        helperText={`${values.metaTitle.trim().length} characters`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title="Publishing setup"
                  subheader="Status, timing, taxonomy, and placement in one control surface."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2.5}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={values.status}
                      onChange={(event) =>
                        updateField('status', event.target.value as ApiBlogStatus)
                      }
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      type="datetime-local"
                      label={
                        values.status === 'scheduled'
                          ? 'Scheduled for'
                          : values.status === 'published'
                            ? 'Published at'
                            : 'Publish timestamp'
                      }
                      value={values.publishedAt}
                      onChange={(event) => updateField('publishedAt', event.target.value)}
                      disabled={values.status === 'draft' || values.status === 'archived'}
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

                    {values.status === 'scheduled' && !values.publishedAt ? (
                      <Alert severity="warning">
                        Scheduled posts need a release date and time.
                      </Alert>
                    ) : null}

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6, lg: 12 }}>
                        <TextField
                          select
                          fullWidth
                          label="Category"
                          value={values.categoryId}
                          onChange={(event) => updateField('categoryId', event.target.value)}
                        >
                          <MenuItem value="">Unassigned</MenuItem>
                          {(categoriesQuery.data ?? []).map((category: ApiBlogCategory) => (
                            <MenuItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6, lg: 12 }}>
                        <TextField
                          select
                          fullWidth
                          label="Author"
                          value={values.authorId}
                          onChange={(event) => updateField('authorId', event.target.value)}
                        >
                          <MenuItem value="">Unassigned</MenuItem>
                          {(authorsQuery.data ?? []).map((author: ApiBlogAuthor) => (
                            <MenuItem key={author.id} value={String(author.id)}>
                              {author.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

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

                    <TextField
                      fullWidth
                      label="Read time"
                      value={values.readTimeMinutes}
                      onChange={(event) =>
                        updateField('readTimeMinutes', event.target.value.replace(/[^\d]/g, ''))
                      }
                      helperText="Minutes only."
                    />

                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Related slugs"
                      value={values.relatedSlugs}
                      onChange={(event) => updateField('relatedSlugs', event.target.value)}
                      helperText="One slug per line or comma-separated."
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title="Media and readiness"
                  subheader="Cover image, social media support, and quick publishing checks."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2.5}>
                    {coverPreviewUrl ? (
                      <Box
                        component="img"
                        alt={values.coverAlt || values.title || 'Blog cover preview'}
                        src={coverPreviewUrl}
                        sx={{
                          width: '100%',
                          aspectRatio: '16 / 10',
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        No cover image selected.
                      </Paper>
                    )}

                    {coverUploading ? <LinearProgress /> : null}
                    {coverUploadError ? <Alert severity="error">{coverUploadError}</Alert> : null}

                    <Button component="label" variant="outlined" disabled={coverUploading}>
                      Upload image
                      <input hidden accept="image/*" type="file" onChange={handleCoverUpload} />
                    </Button>

                    <TextField
                      fullWidth
                      label="Featured image URL"
                      value={values.featuredImage}
                      onChange={(event) => updateField('featuredImage', event.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Cover alt text"
                      value={values.coverAlt}
                      onChange={(event) => updateField('coverAlt', event.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Media label"
                      value={values.mediaLabel}
                      onChange={(event) => updateField('mediaLabel', event.target.value)}
                    />

                    <Divider />

                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">SEO readiness</Typography>
                        <Typography variant="subtitle2">{seoScore}%</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={seoScore}
                        sx={{ height: 10, borderRadius: 999 }}
                      />
                    </Box>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {readinessItems.length ? (
                        readinessItems.map((item) => (
                          <Chip key={item} size="small" variant="outlined" label={item} />
                        ))
                      ) : (
                        <Chip
                          size="small"
                          variant="outlined"
                          label="Add title and content to begin"
                        />
                      )}
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Body words: <strong>{bodyWordCount}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Excerpt length: <strong>{values.excerpt.trim().length}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Last published at: <strong>{values.publishedAt || 'Not set'}</strong>
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
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

