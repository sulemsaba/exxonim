import type {
  SystemOSAnalyticsRange,
  SystemOSCounts,
  SystemOSEditorPane,
  SystemOSPageMeta,
  SystemOSPost,
  SystemOSPostStatus,
  SystemOSScreen,
} from './types';

export interface SystemOSAnalyticsCountry {
  label: string;
  value: number;
  share: number;
}

export interface SystemOSAnalyticsCategoryMetric {
  label: string;
  posts: number;
  views: number;
  engagementAvg: number;
  seoAvg: number;
  viewsPerPost: number;
  performance: number;
}

export interface SystemOSPostMetric {
  post: SystemOSPost;
  currentSeries: Array<{ date: Date; value: number }>;
  previousSeries: Array<{ date: Date; value: number }>;
  currentViews: number;
  prevViews: number;
  readMinutes: number;
  seo: number;
  bounce: number;
  completion: number;
  scrollDepth: number;
  engagement: number;
  trend: number;
  signal: 'trending' | 'dropping' | 'steady';
  performance: number;
  risk: number;
}

export interface SystemOSAnalyticsSnapshot {
  range: SystemOSAnalyticsRange;
  posts: SystemOSPost[];
  postMetrics: SystemOSPostMetric[];
  trafficSeries: Array<{ date: Date; value: number }>;
  markerCounts: Array<{ day: string; count: number }>;
  totalViews: number;
  previousViews: number;
  uniqueVisitors: number;
  previousVisitors: number;
  avgRead: number;
  prevAvgRead: number;
  avgBounce: number;
  prevAvgBounce: number;
  avgSeo: number;
  prevAvgSeo: number;
  avgScroll: number;
  prevAvgScroll: number;
  avgCompletion: number;
  prevAvgCompletion: number;
  publishedInPeriod: number;
  publishedPrevious: number;
  scheduledCount: number;
  lowSeoCount: number;
  missingMetaTitle: number;
  missingMetaDescription: number;
  slugIssues: number;
  titleCoverage: number;
  descriptionCoverage: number;
  slugCoverage: number;
  lowSeoShare: number;
  returningShare: number;
  newShare: number;
  mobileShare: number;
  desktopShare: number;
  countries: SystemOSAnalyticsCountry[];
  topPosts: SystemOSPostMetric[];
  worstPosts: SystemOSPostMetric[];
  categories: SystemOSAnalyticsCategoryMetric[];
  bestCategory: SystemOSAnalyticsCategoryMetric;
  worstCategory: SystemOSAnalyticsCategoryMetric;
  categoryRatio: string;
  cadenceRatio: string;
  liveReaders: number;
  lastMinuteViews: number;
  topLivePost?: SystemOSPostMetric;
  nextScheduledPost?: SystemOSPost;
}

export interface SystemOSTrendMeta {
  className: 'good' | 'bad' | 'flat';
  label: string;
}

export function isRevisionPost(post?: Pick<SystemOSPost, 'revisionOf'> | null) {
  return Boolean(post?.revisionOf);
}

export function visiblePosts(posts: SystemOSPost[]) {
  return posts.filter((post) => !isRevisionPost(post));
}

export function createPageMeta(screen: SystemOSScreen): SystemOSPageMeta {
  return screen === 'analytics'
    ? {
        crumbs: 'Admin / Content / Analytics',
        title: 'Analytics',
        sub: 'Live performance across published content and editorial output.',
      }
    : {
        crumbs: 'Admin / Content / Blog Posts',
        title: 'Blog Management',
        sub: 'Publishing control, review, and search in one sharper workspace.',
      };
}

export function createCounts(posts: SystemOSPost[]): SystemOSCounts {
  const list = visiblePosts(posts);
  return {
    all: list.length,
    draft: list.filter((post) => post.status === 'draft').length,
    scheduled: list.filter((post) => post.status === 'scheduled').length,
    published: list.filter((post) => post.status === 'published').length,
    trash: list.filter((post) => post.status === 'trash').length,
  };
}

export function uniqueValues(posts: SystemOSPost[], key: 'category' | 'author') {
  return [...new Set(posts.map((post) => post[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function relativeTime(value?: string) {
  if (!value) return '--';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function statusClass(status: SystemOSPostStatus) {
  return ['draft', 'published', 'scheduled', 'trash'].includes(status) ? status : 'draft';
}

export function parseReadMinutes(value = '') {
  const minutes = Number.parseInt(value, 10);
  return Number.isFinite(minutes) ? minutes : 0;
}

export function estimateSeo(post: Pick<SystemOSPost, 'slug' | 'cover' | 'excerpt' | 'metaTitle' | 'metaDescription'>) {
  let score = 50;
  if (post.metaTitle.trim().length >= 20) score += 15;
  if (post.metaDescription.trim().length >= 60) score += 15;
  if (post.slug.trim()) score += 10;
  if (post.cover.trim()) score += 5;
  if (post.excerpt.trim().length >= 40) score += 5;
  return Math.min(100, score);
}

export function nextScheduled(posts: SystemOSPost[]) {
  return [...posts]
    .filter((post) => post.status === 'scheduled' && post.scheduledFor)
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())[0];
}

export function formatPreviewParagraphs(body = '') {
  const source = body.trim() || 'Write the article content here.';
  return source.split(/\n{2,}/).map((paragraph) => paragraph.split('\n'));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function startOfDay(value: Date | string = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function dayOffsetDate(offset = 0) {
  const date = startOfDay();
  date.setDate(date.getDate() - offset);
  return date;
}

export function dayKey(value: Date | string) {
  return startOfDay(value).toISOString().slice(0, 10);
}

export function isWithinWindow(value: string, days: number, offset = 0) {
  if (!value) return false;
  const target = startOfDay(value);
  const end = dayOffsetDate(offset);
  const start = new Date(end);
  start.setDate(end.getDate() - days + 1);
  return target >= start && target <= end;
}

export function timeUntil(value?: string) {
  if (!value) return '--';
  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) return 'today';
  const hours = Math.round(diff / 3600000);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.round(hours / 24);
  return `in ${days}d`;
}

function scoreSeo(post: SystemOSPost) {
  return clamp(Number(post.seo || 0), 0, 100);
}

function postReadMinutes(post: SystemOSPost) {
  return Math.max(1, parseReadMinutes(post.readTime) || 3);
}

function postCoverage(post: SystemOSPost) {
  let score = 0;
  if (post.metaTitle.trim().length >= 20) score += 1;
  if (post.metaDescription.trim().length >= 60) score += 1;
  if (post.excerpt.trim().length >= 40) score += 1;
  return score;
}

function postBounceRate(post: SystemOSPost) {
  const freshness = isWithinWindow(post.updated, 14) ? -3 : 0;
  const statusPenalty = post.status === 'draft' ? 6 : post.status === 'scheduled' ? 3 : 0;
  return clamp(
    Math.round(76 - postReadMinutes(post) * 2.7 - scoreSeo(post) * 0.18 - postCoverage(post) * 3 + freshness + statusPenalty),
    24,
    82,
  );
}

function postCompletion(post: SystemOSPost) {
  return clamp(Math.round(100 - postBounceRate(post) + postReadMinutes(post) * 2.2), 30, 96);
}

function postScrollDepth(post: SystemOSPost) {
  return clamp(Math.round(postCompletion(post) * 0.84 + postReadMinutes(post) * 1.6), 38, 96);
}

function postEngagement(post: SystemOSPost) {
  return clamp(
    Math.round(postCompletion(post) * 0.58 + scoreSeo(post) * 0.24 + Math.min(100, Number(post.views || 0) / 24) * 0.18),
    24,
    97,
  );
}

function analyticsAnchorDate(post: SystemOSPost) {
  return post.publishedAt || post.scheduledFor || post.updated || new Date().toISOString();
}

function buildPostSeries(post: SystemOSPost, days: number, offset = 0) {
  return Array.from({ length: days }, (_, index) => {
    const daysAgo = days - index - 1 + offset;
    const pointDate = dayOffsetDate(daysAgo);
    const anchor = startOfDay(analyticsAnchorDate(post));
    const distance = Math.abs(Math.round((pointDate.getTime() - anchor.getTime()) / 86400000));
    const base = Math.max(18, Number(post.views || 0));
    const perDay = base / Math.max(16, days * 1.35);
    const statusFactor = post.status === 'published' ? 1.18 : post.status === 'scheduled' ? 0.82 : 0.62;
    const seoFactor = 0.78 + scoreSeo(post) / 170;
    const freshness = 0.88 + (Math.max(0, 24 - Math.min(24, distance)) / 24) * 0.42;
    const rhythm = 0.8 + (((Number(post.id || 1) * 17) + (index + 1 + offset) * 9) % 13) / 20;
    const weekdayFactor = [0, 6].includes(pointDate.getDay()) ? 0.9 : 1;
    const bodyFactor = post.body.trim() ? 1.04 : 0.92;
    const value =
      post.status === 'trash'
        ? 0
        : Math.max(2, Math.round(perDay * statusFactor * seoFactor * freshness * rhythm * weekdayFactor * bodyFactor));
    return { date: pointDate, value };
  });
}

function sumSeries(series: Array<{ value: number }>) {
  return series.reduce((total, point) => total + point.value, 0);
}

export function percentChange(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function trendMeta(current: number, previous: number, invert = false, digits = 0): SystemOSTrendMeta {
  const delta = Number(percentChange(current, previous).toFixed(digits));
  const className = delta === 0 ? 'flat' : invert ? (delta <= 0 ? 'good' : 'bad') : delta >= 0 ? 'good' : 'bad';
  const arrow = delta === 0 ? '->' : delta > 0 ? '^' : 'v';
  const sign = delta > 0 ? '+' : '';
  return {
    className,
    label: `${arrow} ${sign}${delta}%`,
  };
}

function aggregateCategories(postMetrics: SystemOSPostMetric[]) {
  const map = new Map<string, SystemOSAnalyticsCategoryMetric>();
  postMetrics.forEach((metric) => {
    const label = metric.post.category || 'Unknown';
    const current = map.get(label) || {
      label,
      posts: 0,
      views: 0,
      engagementAvg: 0,
      seoAvg: 0,
      viewsPerPost: 0,
      performance: 0,
    };
    current.posts += 1;
    current.views += metric.currentViews;
    current.engagementAvg += metric.engagement;
    current.seoAvg += metric.seo;
    map.set(label, current);
  });
  return [...map.values()]
    .map((metric) => {
      const posts = Math.max(1, metric.posts);
      const viewsPerPost = metric.views / posts;
      const engagementAvg = metric.engagementAvg / posts;
      const seoAvg = metric.seoAvg / posts;
      return {
        ...metric,
        viewsPerPost,
        engagementAvg,
        seoAvg,
        performance: viewsPerPost * 0.58 + engagementAvg * 18 + seoAvg * 8,
      };
    })
    .sort((a, b) => b.performance - a.performance || b.views - a.views);
}

export function buildAnalyticsSnapshot(posts: SystemOSPost[], range: SystemOSAnalyticsRange): SystemOSAnalyticsSnapshot {
  const activePosts = posts.filter((post) => post.status !== 'trash');
  const postMetrics = activePosts.map<SystemOSPostMetric>((post) => {
    const currentSeries = buildPostSeries(post, range);
    const previousSeries = buildPostSeries(post, range, range);
    const currentViews = sumSeries(currentSeries);
    const prevViews = sumSeries(previousSeries);
    const readMinutes = postReadMinutes(post);
    const seo = scoreSeo(post);
    const bounce = postBounceRate(post);
    const completion = postCompletion(post);
    const scrollDepth = postScrollDepth(post);
    const engagement = postEngagement(post);
    const trend = percentChange(currentViews, prevViews);
    const signal = trend >= 10 ? 'trending' : trend <= -8 ? 'dropping' : 'steady';
    const performance = currentViews * 0.58 + engagement * 20 + seo * 10;
    const risk = (100 - engagement) * 1.15 + bounce + Math.max(0, 70 - seo) * 1.25 + Math.max(0, 280 - currentViews) / 7;
    return {
      post,
      currentSeries,
      previousSeries,
      currentViews,
      prevViews,
      readMinutes,
      seo,
      bounce,
      completion,
      scrollDepth,
      engagement,
      trend,
      signal,
      performance,
      risk,
    };
  });

  const fallbackSeries = Array.from({ length: range }, (_, index) => ({
    date: dayOffsetDate(range - index - 1),
    value: 0,
  }));
  const trafficSeries = Array.from({ length: range }, (_, index) => ({
    date: postMetrics[0]?.currentSeries[index]?.date || fallbackSeries[index].date,
    value: postMetrics.reduce((sum, metric) => sum + (metric.currentSeries[index]?.value || 0), 0),
  }));

  const totalViews = sumSeries(trafficSeries);
  const previousViews = postMetrics.reduce((sum, metric) => sum + metric.prevViews, 0);
  const currentWeight = postMetrics.reduce((sum, metric) => sum + Math.max(1, metric.currentViews), 0);
  const previousWeight = postMetrics.reduce((sum, metric) => sum + Math.max(1, metric.prevViews), 0);
  const weightedCurrent = (key: keyof Pick<SystemOSPostMetric, 'readMinutes' | 'bounce' | 'seo' | 'scrollDepth' | 'completion'>) =>
    currentWeight
      ? postMetrics.reduce((sum, metric) => sum + metric[key] * Math.max(1, metric.currentViews), 0) / currentWeight
      : 0;
  const weightedPrevious = (key: keyof Pick<SystemOSPostMetric, 'readMinutes' | 'bounce' | 'seo' | 'scrollDepth' | 'completion'>) =>
    previousWeight
      ? postMetrics.reduce((sum, metric) => sum + metric[key] * Math.max(1, metric.prevViews), 0) / previousWeight
      : 0;

  const avgRead = weightedCurrent('readMinutes');
  const prevAvgRead = weightedPrevious('readMinutes');
  const avgBounce = weightedCurrent('bounce');
  const prevAvgBounce = weightedPrevious('bounce');
  const avgSeo = weightedCurrent('seo');
  const prevAvgSeo = weightedPrevious('seo');
  const avgScroll = weightedCurrent('scrollDepth');
  const prevAvgScroll = weightedPrevious('scrollDepth');
  const avgCompletion = weightedCurrent('completion');
  const prevAvgCompletion = weightedPrevious('completion');
  const publishedInPeriod = activePosts.filter((post) => isWithinWindow(post.publishedAt, range)).length;
  const publishedPrevious = activePosts.filter((post) => isWithinWindow(post.publishedAt, range, range)).length;
  const scheduledCount = posts.filter((post) => post.status === 'scheduled').length;
  const lowSeoCount = activePosts.filter((post) => scoreSeo(post) < 70).length;
  const missingMetaTitle = activePosts.filter((post) => post.metaTitle.trim().length < 20).length;
  const missingMetaDescription = activePosts.filter((post) => post.metaDescription.trim().length < 60).length;
  const slugIssues = activePosts.filter((post) => !post.slug || post.slug !== slugify(post.slug) || post.slug.length < 8 || /--/.test(post.slug)).length;
  const titleCoverage = activePosts.length ? Math.round(((activePosts.length - missingMetaTitle) / activePosts.length) * 100) : 0;
  const descriptionCoverage = activePosts.length
    ? Math.round(((activePosts.length - missingMetaDescription) / activePosts.length) * 100)
    : 0;
  const slugCoverage = activePosts.length ? Math.round(((activePosts.length - slugIssues) / activePosts.length) * 100) : 0;
  const lowSeoShare = activePosts.length ? Math.round((lowSeoCount / activePosts.length) * 100) : 0;
  const uniqueVisitors = Math.round(totalViews * (0.56 + clamp(avgSeo / 500, 0, 0.16) + clamp((100 - avgBounce) / 500, 0, 0.08)));
  const previousVisitors = Math.round(
    previousViews * (0.56 + clamp(prevAvgSeo / 500, 0, 0.16) + clamp((100 - prevAvgBounce) / 500, 0, 0.08)),
  );

  const returningShare = activePosts.length
    ? clamp(Math.round(34 + avgCompletion * 0.35 + avgSeo * 0.16 - avgBounce * 0.18), 30, 74)
    : 0;
  const newShare = activePosts.length ? 100 - returningShare : 0;
  const mobileShare = activePosts.length ? clamp(Math.round(56 - avgRead * 2.2 + avgBounce * 0.1), 38, 72) : 0;
  const desktopShare = activePosts.length ? 100 - mobileShare : 0;

  const countrySeed = [
    { label: 'Tanzania', value: clamp(Math.round(28 + publishedInPeriod * 4 - lowSeoCount), 18, 44) },
    { label: 'Kenya', value: clamp(Math.round(20 + avgSeo / 7), 14, 30) },
    { label: 'United States', value: clamp(Math.round(16 + avgRead * 2), 10, 28) },
  ];
  const countryTotal = countrySeed.reduce((sum, item) => sum + item.value, 0) || 1;
  const countries = countrySeed.map<SystemOSAnalyticsCountry>((country) => ({
    ...country,
    share: Math.round((country.value / countryTotal) * 100),
  }));

  const topPosts = [...postMetrics].sort((a, b) => b.performance - a.performance || b.currentViews - a.currentViews).slice(0, 6);
  const worstPosts = [...postMetrics].sort((a, b) => b.risk - a.risk || a.currentViews - b.currentViews).slice(0, 3);
  const categories = aggregateCategories(postMetrics);
  const bestCategory = categories[0] || {
    label: 'No category',
    posts: 0,
    views: 0,
    engagementAvg: 0,
    seoAvg: 0,
    viewsPerPost: 0,
    performance: 0,
  };
  const worstCategory = categories[categories.length - 1] || bestCategory;
  const categoryRatio = worstCategory.viewsPerPost ? (bestCategory.viewsPerPost / Math.max(1, worstCategory.viewsPerPost)).toFixed(1) : '1.0';
  const recentMetrics = postMetrics.filter((metric) => isWithinWindow(metric.post.updated, 30) || isWithinWindow(metric.post.publishedAt, 30));
  const backlogMetrics = postMetrics.filter((metric) => !recentMetrics.includes(metric));
  const recentViews = recentMetrics.length ? recentMetrics.reduce((sum, metric) => sum + metric.currentViews, 0) / recentMetrics.length : 0;
  const backlogViews = backlogMetrics.length ? backlogMetrics.reduce((sum, metric) => sum + metric.currentViews, 0) / backlogMetrics.length : 0;
  const cadenceRatio = backlogViews ? (recentViews / backlogViews).toFixed(1) : '1.0';
  const topLivePost = topPosts[0];
  const nextScheduledPost = [...posts]
    .filter((post) => post.status === 'scheduled' && post.scheduledFor)
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())[0];
  const liveReaders = activePosts.length ? clamp(Math.round(uniqueVisitors / Math.max(10, range * 0.75 || 1)), 3, 64) : 0;
  const lastMinuteViews = activePosts.length
    ? clamp(Math.round((topLivePost?.currentViews || 12) / Math.max(9, range * 2.2)), 2, 24)
    : 0;
  const markerMap = new Map<string, number>();
  activePosts.filter((post) => isWithinWindow(post.publishedAt, range)).forEach((post) => {
    const key = dayKey(post.publishedAt);
    markerMap.set(key, (markerMap.get(key) || 0) + 1);
  });

  return {
    range,
    posts: activePosts,
    postMetrics,
    trafficSeries,
    markerCounts: [...markerMap.entries()].map(([day, count]) => ({ day, count })),
    totalViews,
    previousViews,
    uniqueVisitors,
    previousVisitors,
    avgRead,
    prevAvgRead,
    avgBounce,
    prevAvgBounce,
    avgSeo,
    prevAvgSeo,
    avgScroll,
    prevAvgScroll,
    avgCompletion,
    prevAvgCompletion,
    publishedInPeriod,
    publishedPrevious,
    scheduledCount,
    lowSeoCount,
    missingMetaTitle,
    missingMetaDescription,
    slugIssues,
    titleCoverage,
    descriptionCoverage,
    slugCoverage,
    lowSeoShare,
    returningShare,
    newShare,
    mobileShare,
    desktopShare,
    countries,
    topPosts,
    worstPosts,
    categories,
    bestCategory,
    worstCategory,
    categoryRatio,
    cadenceRatio,
    liveReaders,
    lastMinuteViews,
    topLivePost,
    nextScheduledPost,
  };
}

export function createEmptyPost(seedId = Date.now()): SystemOSPost {
  return {
    id: seedId,
    title: '',
    slug: '',
    category: '',
    author: '',
    featuredSlot: '',
    featuredOnHome: false,
    status: 'draft',
    updated: new Date().toISOString(),
    scheduledFor: '',
    publishedAt: '',
    readTime: '5 min read',
    views: 0,
    excerpt: '',
    cover: '',
    body: '',
    note: '',
    metaTitle: '',
    metaDescription: '',
    seo: 50,
    revisionOf: null,
    revisionState: '',
    openRevisionId: null,
    openRevisionState: '',
  };
}

export function clonePostForDraft(post: SystemOSPost, seedId = Date.now()): SystemOSPost {
  return {
    ...post,
    id: seedId,
    title: `${post.title} Follow-up`,
    slug: `${post.slug}-follow-up`,
    status: 'draft',
    featuredOnHome: false,
    publishedAt: '',
    scheduledFor: '',
    views: 0,
    updated: new Date().toISOString(),
    note: `Follow-up to ${post.title}`,
    metaTitle: '',
    metaDescription: '',
    seo: 56,
    revisionOf: null,
    revisionState: '',
    openRevisionId: null,
    openRevisionState: '',
  };
}

export function createInlineSeoUpdate(post: SystemOSPost) {
  return {
    ...post,
    updated: new Date().toISOString(),
    seo: estimateSeo(post),
  };
}

export function buildTrendChartGeometry(
  series: Array<{ date: Date; value: number }>,
  markerCounts: Array<{ day: string; count: number }>,
) {
  const width = 920;
  const height = 248;
  const pad = { top: 18, right: 18, bottom: 32, left: 36 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const maxValue = Math.max(...series.map((point) => point.value), 10);
  const points = series.map((point, index) => {
    const x = pad.left + (plotWidth * index) / Math.max(1, series.length - 1);
    const y = pad.top + plotHeight - (point.value / maxValue) * plotHeight;
    return { ...point, x, y };
  });
  const xTickIndexes = [...new Set([0, Math.floor((series.length - 1) * 0.25), Math.floor((series.length - 1) * 0.5), Math.floor((series.length - 1) * 0.75), series.length - 1])];
  return {
    width,
    height,
    pad,
    plotHeight,
    maxValue,
    points,
    xTickIndexes,
    markers: markerCounts
      .map((marker) => {
        const point = points.find((entry) => dayKey(entry.date) === marker.day);
        return point ? { ...marker, point } : null;
      })
      .filter((marker): marker is { day: string; count: number; point: (typeof points)[number] } => Boolean(marker)),
  };
}

export function chartDateLabel(date: Date, range: SystemOSAnalyticsRange) {
  return date.toLocaleDateString(undefined, range <= 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' });
}

export function createHeroMetrics(snapshot: SystemOSAnalyticsSnapshot) {
  return [
    {
      label: 'Total Views',
      value: snapshot.totalViews.toLocaleString(),
      note: `Last ${snapshot.range} days across ${snapshot.posts.length} tracked posts.`,
      trend: trendMeta(snapshot.totalViews, snapshot.previousViews),
    },
    {
      label: 'Unique Visitors',
      value: snapshot.uniqueVisitors.toLocaleString(),
      note: `${snapshot.returningShare}% of traffic is returning audience.`,
      trend: trendMeta(snapshot.uniqueVisitors, snapshot.previousVisitors),
    },
    {
      label: 'Avg Read Time',
      value: `${snapshot.avgRead.toFixed(1)} min`,
      note: 'Weighted by live traffic, not just raw post count.',
      trend: trendMeta(snapshot.avgRead, snapshot.prevAvgRead, false, 1),
    },
    {
      label: 'Bounce Rate',
      value: `${Math.round(snapshot.avgBounce)}%`,
      note: `${snapshot.worstPosts.length} posts are pushing exits above baseline.`,
      trend: trendMeta(snapshot.avgBounce, snapshot.prevAvgBounce, true),
    },
    {
      label: 'SEO Average',
      value: `${Math.round(snapshot.avgSeo)}`,
      note: `${snapshot.lowSeoCount} posts are below the 70-point threshold.`,
      trend: trendMeta(snapshot.avgSeo, snapshot.prevAvgSeo),
    },
    {
      label: 'Posts Published',
      value: snapshot.publishedInPeriod.toLocaleString(),
      note: `${snapshot.scheduledCount} more scheduled for release next.`,
      trend: trendMeta(snapshot.publishedInPeriod, snapshot.publishedPrevious),
    },
  ];
}

export function getStorageValue<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in embedded or restricted environments.
  }
}

export function sortPosts(posts: SystemOSPost[], sort: 'newest' | 'oldest' | 'views' | 'az') {
  const list = [...posts];
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
    case 'views':
      return list.sort((a, b) => b.views - a.views);
    case 'az':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return list.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
  }
}

export function filterPosts(
  posts: SystemOSPost[],
  options: {
    tab: SystemOSPostStatus | 'all';
    status: SystemOSPostStatus | 'all';
    category: string;
    author: string;
    query: string;
    sort: 'newest' | 'oldest' | 'views' | 'az';
  },
) {
  const query = options.query.trim().toLowerCase();
  let list = [...visiblePosts(posts)];
  if (options.tab !== 'all') list = list.filter((post) => post.status === options.tab);
  if (options.status !== 'all') list = list.filter((post) => post.status === options.status);
  if (options.category !== 'all') list = list.filter((post) => post.category === options.category);
  if (options.author !== 'all') list = list.filter((post) => post.author === options.author);
  if (query) {
    list = list.filter((post) =>
      [post.title, post.slug, post.excerpt, post.body, post.category, post.author].join(' ').toLowerCase().includes(query),
    );
  }
  return sortPosts(list, options.sort);
}

export function paginatePosts(posts: SystemOSPost[], page: number, perPage: number) {
  const pages = Math.max(1, Math.ceil(posts.length / perPage));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * perPage;
  return {
    rows: posts.slice(start, start + perPage),
    total: posts.length,
    pages,
    page: safePage,
    start,
    end: Math.min(start + perPage, posts.length),
  };
}

export function applyStatusChange(post: SystemOSPost, status: SystemOSPostStatus): SystemOSPost {
  const nextPost = {
    ...post,
    status,
    updated: new Date().toISOString(),
  };
  if (status === 'published' && !post.publishedAt) nextPost.publishedAt = new Date().toISOString();
  if (status === 'scheduled' && !post.scheduledFor) nextPost.scheduledFor = new Date(Date.now() + 86400000).toISOString();
  if (status !== 'scheduled') nextPost.scheduledFor = status === 'published' ? post.scheduledFor : '';
  if (status !== 'published') nextPost.publishedAt = status === 'scheduled' ? post.publishedAt : post.publishedAt;
  return nextPost;
}

export function createBlogCommand(type: 'new' | 'edit' | 'preview' | 'showTrending', postId?: number, pane?: SystemOSEditorPane) {
  return {
    id: Date.now(),
    type,
    postId,
    pane,
  };
}
