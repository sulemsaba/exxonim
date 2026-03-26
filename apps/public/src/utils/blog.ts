import type {
  BlogArticleContent,
  BlogArticleSection,
  BlogCategoryId,
  BlogPost,
} from "../types";

function toUtcDateValue(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime();
}

function cleanText(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function sanitizeBlogHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function hasUsableBlogBody(content?: BlogArticleContent | null) {
  if (!content) {
    return false;
  }

  if (stripHtml(cleanText(content.html)).length >= 8) {
    return true;
  }

  if (cleanText(content.introduction).length >= 8) {
    return true;
  }

  return content.sections.some((section) => {
    if (cleanText(section.heading).length >= 2) {
      return true;
    }

    return section.paragraphs.some((paragraph) => cleanText(paragraph).length >= 8);
  });
}

export function getRenderableBlogHtml(content?: BlogArticleContent | null) {
  const html = cleanText(content?.html);
  return html ? sanitizeBlogHtml(html) : "";
}

export function getRenderableBlogSections(
  post: Pick<BlogPost, "excerpt" | "content">
): BlogArticleSection[] {
  const content = post.content;
  if (!content) {
    return [];
  }

  if (getRenderableBlogHtml(content)) {
    return [];
  }

  if (content.sections.length > 0) {
    return content.sections;
  }

  const introParagraphs = cleanText(content.introduction)
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!introParagraphs.length) {
    return [];
  }

  return [
    {
      heading: "Article",
      paragraphs: introParagraphs,
    },
  ];
}

export function getBlogArticleIntro(post: Pick<BlogPost, "excerpt" | "content">) {
  const content = post.content;
  if (!content) {
    return post.excerpt || "";
  }

  const sections = getRenderableBlogSections(post);
  if (sections.length > 0) {
    return content.sections.length > 0
      ? content.introduction
      : post.excerpt || sections[0]?.paragraphs[0] || content.introduction;
  }

  return post.excerpt || content.introduction;
}

export function comparePostsNewestFirst(left: BlogPost, right: BlogPost) {
  return toUtcDateValue(right.publishedAt) - toUtcDateValue(left.publishedAt);
}

export function getFeaturedBlogPosts(posts: BlogPost[]) {
  const slotOrder = ["hero", "popular", "editors-pick"];

  return posts
    .filter((post) => post.featuredSlot)
    .sort((left, right) => {
      const leftIndex = slotOrder.indexOf(left.featuredSlot ?? "");
      const rightIndex = slotOrder.indexOf(right.featuredSlot ?? "");

      if (leftIndex === rightIndex) {
        return comparePostsNewestFirst(left, right);
      }

      return leftIndex - rightIndex;
    });
}

export function getHomeBlogPosts(posts: BlogPost[]) {
  return posts.filter((post) => post.featuredOnHome).sort(comparePostsNewestFirst).slice(0, 4);
}

export function getVisibleBlogPosts(options: {
  posts: BlogPost[];
  categoryId?: BlogCategoryId | "all";
  limit?: number;
  excludeSlugs?: string[];
}) {
  const { posts, categoryId = "all", limit, excludeSlugs = [] } = options;
  const blockedSlugs = new Set(excludeSlugs);

  const visiblePosts = posts
    .filter((post) => {
      if (blockedSlugs.has(post.slug)) {
        return false;
      }

      if (categoryId === "all") {
        return true;
      }

      return post.category?.id === categoryId;
    })
    .sort(comparePostsNewestFirst);

  return typeof limit === "number" ? visiblePosts.slice(0, limit) : visiblePosts;
}

export function buildResourcesBlogLayout(posts: BlogPost[]) {
  const featuredPosts = getFeaturedBlogPosts(posts);
  const allPostsNewestFirst = getVisibleBlogPosts({ posts, categoryId: "all" });
  const explicitHeroPost = featuredPosts.find((post) => post.featuredSlot === "hero");
  const heroPost = explicitHeroPost ?? allPostsNewestFirst[0] ?? null;
  const prioritizedTopRailPosts = featuredPosts.filter((post) => post.slug !== heroPost?.slug);
  const fallbackTopRailPosts = allPostsNewestFirst.filter((post) => post.slug !== heroPost?.slug);
  const topRailPosts = Array.from(
    new Map(
      [...prioritizedTopRailPosts, ...fallbackTopRailPosts].map((post) => [post.slug, post])
    ).values()
  ).slice(0, 3);

  return {
    heroPost,
    topRailPosts,
    topSectionSlugs: heroPost ? [heroPost.slug, ...topRailPosts.map((post) => post.slug)] : [],
  };
}

export function getRelatedBlogPosts(currentPost: BlogPost, posts: BlogPost[]) {
  if (currentPost.relatedSlugs.length) {
    return currentPost.relatedSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter((post): post is BlogPost => Boolean(post))
      .slice(0, 3);
  }

  return posts
    .filter(
      (post) => post.slug !== currentPost.slug && post.category?.id === currentPost.category?.id
    )
    .sort(comparePostsNewestFirst)
    .slice(0, 3);
}
