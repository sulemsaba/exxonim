import type { BlogCategoryId, BlogPost } from "../types";

function toUtcDateValue(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime();
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
  return posts
    .filter((post) => post.featuredOnHome)
    .sort(comparePostsNewestFirst)
    .slice(0, 4);
}

export function getVisibleBlogPosts(options: {
  posts: BlogPost[];
  categoryId?: BlogCategoryId | "all";
  limit?: number;
  excludeSlugs?: string[];
}) {
  const {
    posts,
    categoryId = "all",
    limit,
    excludeSlugs = [],
  } = options;
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

export function getRelatedBlogPosts(currentPost: BlogPost, posts: BlogPost[]) {
  if (currentPost.relatedSlugs.length) {
    return currentPost.relatedSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter((post): post is BlogPost => Boolean(post))
      .slice(0, 3);
  }

  return posts
    .filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.category?.id === currentPost.category?.id
    )
    .sort(comparePostsNewestFirst)
    .slice(0, 3);
}
