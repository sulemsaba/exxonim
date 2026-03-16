import type {
  BlogAuthor,
  BlogCategory,
  BlogCategoryId,
  BlogFeaturedSlot,
  BlogPost,
  BrandAssets,
  InsightPost,
  NavLink,
  ServiceNavGroup,
  StackItem,
} from "./types";
import { routes } from "./routes";

export const brand: BrandAssets = {
  name: "Exxonim",
  lightLogoSrc: "/exxonim-logo.webp",
  darkLogoSrc: "/logo-dark.png",
};

export const primaryNavLinks: NavLink[] = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Blogs", href: routes.resources },
  { label: "Contact", href: routes.contact },
  { label: "Career", href: routes.career },
  { label: "FAQs", href: routes.faq },
];

export const serviceNavGroups: ServiceNavGroup[] = [
  {
    title: "Business Registration Services",
    summary: "BRELA-focused setup, protection, and entity formation.",
    href: `${routes.services}#company`,
    items: [
      "Company Registration",
      "Business Name Registration",
      "NGO / Organization Registration",
      "Trademark Registration",
    ],
  },
  {
    title: "Tax & Compliance Services",
    summary: "TRA submissions, returns, and tax setup for compliant growth.",
    href: `${routes.services}#tin`,
    items: [
      "TIN Application",
      "Monthly VAT Returns",
      "Annual Statutory Returns",
      "Annual Returns Submission",
    ],
  },
  {
    title: "Licensing & Permits",
    summary: "Licenses and regulated approvals including BOT-linked processes.",
    href: `${routes.services}#license`,
    items: [
      "Business License Applications",
      "Residence Permits",
      "Microfinance Licensing",
      "Central Bank Licensing",
    ],
  },
  {
    title: "Government & Institutional Registrations",
    summary: "Operational registrations for public systems and compliance bodies.",
    href: `${routes.services}#crb`,
    items: [
      "CRB / ERB Registration",
      "OSHA Registration",
      "NSSF / WCF Registration",
      "NeST / GPSA Registration",
    ],
  },
  {
    title: "Business Support & Consulting",
    summary: "Planning, financial preparation, and advisory support for decisions.",
    href: `${routes.services}#plan`,
    items: [
      "Business Plan Preparation",
      "Financial Statement Preparation",
      "MEMART Preparation",
      "Revenue Forecasting",
    ],
  },
];

export const providerLabels: string[] = [
  "Startups",
  "SMEs",
  "NGOs",
  "Construction",
  "Professional services",
  "Trade and distribution",
  "Regulated operators",
];

export const stackItems: StackItem[] = [
  {
    title: "When Strategy Stops at the Offsite",
    subtitle: "Alignment, choices, and commercial priorities",
    description:
      "Leadership teams often agree on ambition but not on the sequence, owners, and tradeoffs needed to move. We turn the plan into a short, practical agenda the business can execute against.",
    ctaLabel: "See our advisory model",
    ctaHref: routes.services,
    windowTitle: "Board Priority Review",
    windowTag: "Strategy",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/BrittleChainCodeBlock1.mov",
  },
  {
    title: "When Growth Creates Operating Friction",
    subtitle: "Cadence, reporting, and management design",
    description:
      "Teams lose momentum when reporting, meetings, and decisions depend on workarounds. We redesign the management system so execution becomes clearer, faster, and easier to sustain.",
    ctaLabel: "Explore operating systems",
    ctaHref: routes.tracking,
    windowTitle: "Operating Cadence Review",
    windowTag: "Cadence",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/The%20_Manual%20Orchestration_%20Tax.mov",
  },
  {
    title: "When Transformation Depends on Heroics",
    subtitle: "Governance, ownership, and change leadership",
    description:
      "Growth creates complexity faster than most companies build structure. We put in place the governance, accountability, and delivery discipline required to scale without drift.",
    ctaLabel: "View transformation approach",
    ctaHref: routes.resources,
    windowTitle: "Transformation Steering",
    windowTag: "Delivery",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/ContextBlindspot.mov",
  },
];

export const blogCategories: BlogCategory[] = [
  {
    id: "registration",
    label: "Registration",
    description:
      "Entity setup, ownership structure, naming, and filing preparation before launch.",
  },
  {
    id: "tax-compliance",
    label: "Tax & Compliance",
    description:
      "TIN setup, returns rhythm, filing control, and practical compliance discipline.",
  },
  {
    id: "licensing-permits",
    label: "Licensing & Permits",
    description:
      "Business licenses, sector approvals, and regulator follow-through for operating clearance.",
  },
  {
    id: "institutional-support",
    label: "Institutional Support",
    description:
      "CRB, ERB, OSHA, NSSF, WCF, and other registrations that keep operations submission-ready.",
  },
  {
    id: "business-support",
    label: "Business Support",
    description:
      "Business plans, financial preparation, governance documents, and readiness material for decisions.",
  },
];

export const blogAuthors: BlogAuthor[] = [
  {
    id: "aisha-msuya",
    name: "Aisha Msuya",
    role: "Business Registration Advisor",
  },
  {
    id: "kelvin-mrema",
    name: "Kelvin Mrema",
    role: "Tax & Filing Lead",
  },
  {
    id: "neema-kweka",
    name: "Neema Kweka",
    role: "Licensing Coordinator",
  },
  {
    id: "rehema-kibwana",
    name: "Rehema Kibwana",
    role: "Institutional Compliance Officer",
  },
  {
    id: "daniel-massawe",
    name: "Daniel Massawe",
    role: "Business Planning Consultant",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "founder-registration-pack-that-keeps-moving",
    title: "The Founder Registration Pack That Keeps a New Filing Moving",
    excerpt:
      "A lean document pack, ownership checklist, and naming sequence that reduce avoidable back-and-forth at the start.",
    publishedAt: "2026-03-10",
    categoryId: "registration",
    authorId: "aisha-msuya",
    coverImageSrc:
      "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7ddd32275d38306a12e_large-Webinar%20Campaign_2024_12_Blog%20Cover_Step-by-Step.webp",
    coverAlt: "Person reviewing business registration materials",
    mediaLabel: "Setup workflow",
    featuredSlot: "hero",
    featuredOnHome: true,
    readTimeMinutes: 5,
    relatedSlugs: [
      "how-to-check-name-readiness-before-brela-submission",
      "documents-founders-should-gather-before-first-filing-call",
      "choosing-between-business-name-and-company-registration",
    ],
  },
  {
    slug: "annual-returns-control-rhythm-for-small-teams",
    title: "Annual Returns Without the Last-Minute Panic",
    excerpt:
      "A practical control rhythm for smaller teams that need owners, evidence, and deadlines clear before penalties pile up.",
    publishedAt: "2026-03-04",
    categoryId: "tax-compliance",
    authorId: "kelvin-mrema",
    coverImageSrc:
      "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d383065aef_Blog%20Cover_2022_08_%20How%20to%20Effectively%20Improve%20Zoom%20Recording%20Quality%20-%20Riverside.fm.webp",
    coverAlt: "Desk setup representing compliance review work",
    mediaLabel: "Compliance rhythm",
    featuredSlot: "popular",
    featuredOnHome: true,
    readTimeMinutes: 4,
    relatedSlugs: [
      "building-a-filing-calendar-that-survives-busy-months",
      "monthly-vat-prep-checks-before-submission-day",
      "what-to-review-before-you-respond-to-a-tax-notice",
    ],
  },
  {
    slug: "business-license-renewal-delays-and-how-to-avoid-them",
    title: "What Usually Delays a Business License Renewal",
    excerpt:
      "Most delays come from missing supporting records, mismatched business activity details, and late follow-through after submission.",
    publishedAt: "2026-02-19",
    categoryId: "licensing-permits",
    authorId: "neema-kweka",
    coverImageSrc:
      "https://cdn.prod.website-files.com/685be7dcd32275d383065239/690b7e6235396f06d7b216ba_Frame%201851040321%20%285%29.webp",
    coverAlt: "Workspace used for licensing and approvals planning",
    mediaLabel: "Approval notes",
    featuredSlot: "editors-pick",
    featuredOnHome: true,
    readTimeMinutes: 4,
    relatedSlugs: [
      "when-a-license-application-needs-more-than-the-base-form",
      "preparing-sector-approval-documents-without-rework",
      "how-to-escalate-licensing-follow-up-with-clean-records",
    ],
  },
  {
    slug: "documents-founders-should-gather-before-first-filing-call",
    title: "Documents Founders Should Gather Before the First Filing Call",
    excerpt:
      "Gathering identity records, ownership details, intended activities, and address evidence early makes the first review more productive.",
    publishedAt: "2026-02-14",
    categoryId: "registration",
    authorId: "aisha-msuya",
    coverImageSrc:
      "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d383067e01_Blog-Cover_2022_05_The-15-Best-Podcast-Recording-Software-in-2022-%28Mac-_-PC%29-%281%29.webp",
    coverAlt: "Administrative planning image for registration readiness",
    mediaLabel: "Readiness pack",
    featuredOnHome: true,
    readTimeMinutes: 3,
  },
  {
    slug: "building-a-filing-calendar-that-survives-busy-months",
    title: "Build a Filing Calendar That Still Works During Busy Months",
    excerpt:
      "Use a short filing calendar built around trigger dates, handoff owners, and evidence folders instead of one spreadsheet no one updates.",
    publishedAt: "2026-02-11",
    categoryId: "tax-compliance",
    authorId: "kelvin-mrema",
    mediaLabel: "Calendar design",
    readTimeMinutes: 5,
  },
  {
    slug: "when-a-license-application-needs-more-than-the-base-form",
    title: "When a License Application Needs More Than the Base Form",
    excerpt:
      "A base form rarely carries the process alone. Supporting letters, sector evidence, and prior approvals usually decide the pace.",
    publishedAt: "2026-01-26",
    categoryId: "licensing-permits",
    authorId: "neema-kweka",
    mediaLabel: "Licensing pack",
    readTimeMinutes: 4,
  },
  {
    slug: "how-to-prepare-crb-erb-registration-with-fewer-resubmissions",
    title: "Prepare CRB or ERB Registration With Fewer Resubmissions",
    excerpt:
      "Qualification records, supporting signatures, and scope clarity matter more than volume when professional registrations are reviewed.",
    publishedAt: "2026-01-22",
    categoryId: "institutional-support",
    authorId: "rehema-kibwana",
    mediaLabel: "Institutional filing",
    readTimeMinutes: 6,
  },
  {
    slug: "what-investors-actually-check-in-a-business-plan",
    title: "What Investors and Lenders Actually Check in a Business Plan",
    excerpt:
      "They look for coherent assumptions, a defendable model, and a plan that connects operations to financial reality.",
    publishedAt: "2026-01-20",
    categoryId: "business-support",
    authorId: "daniel-massawe",
    mediaLabel: "Plan readiness",
    readTimeMinutes: 5,
  },
  {
    slug: "monthly-vat-prep-checks-before-submission-day",
    title: "Monthly VAT Checks to Run Before Submission Day",
    excerpt:
      "A short pre-submission review helps catch missing invoices, coding gaps, and reconciliation issues before they become repeated corrections.",
    publishedAt: "2026-01-16",
    categoryId: "tax-compliance",
    authorId: "kelvin-mrema",
    mediaLabel: "VAT control",
    readTimeMinutes: 4,
  },
  {
    slug: "preparing-sector-approval-documents-without-rework",
    title: "Preparing Sector Approval Documents Without Rework",
    excerpt:
      "A clean evidence pack, consistent names, and a simple approval tracker prevent many licensing files from stalling midway.",
    publishedAt: "2026-01-14",
    categoryId: "licensing-permits",
    authorId: "neema-kweka",
    mediaLabel: "Sector approvals",
    readTimeMinutes: 4,
  },
  {
    slug: "osha-nssf-and-wcf-registration-sequencing-for-new-employers",
    title: "How New Employers Should Sequence OSHA, NSSF, and WCF Registration",
    excerpt:
      "A better sequence reduces duplicate submissions and helps operations teams prepare the right records for each step.",
    publishedAt: "2026-01-09",
    categoryId: "institutional-support",
    authorId: "rehema-kibwana",
    mediaLabel: "Employer setup",
    readTimeMinutes: 5,
  },
  {
    slug: "financial-statements-and-memart-what-needs-to-match",
    title: "Financial Statements and MEMART: What Needs to Match",
    excerpt:
      "Founders often treat governance documents and financials separately, but weak alignment shows up quickly during review.",
    publishedAt: "2026-01-07",
    categoryId: "business-support",
    authorId: "daniel-massawe",
    mediaLabel: "Governance fit",
    readTimeMinutes: 4,
  },
  {
    slug: "how-to-check-name-readiness-before-brela-submission",
    title: "How to Check Name Readiness Before a BRELA Submission",
    excerpt:
      "A short internal screening can reduce avoidable name rejection and make the incorporation sequence cleaner from day one.",
    publishedAt: "2026-01-05",
    categoryId: "registration",
    authorId: "aisha-msuya",
    mediaLabel: "Name screening",
    readTimeMinutes: 3,
  },
  {
    slug: "what-to-review-before-you-respond-to-a-tax-notice",
    title: "What to Review Before You Respond to a Tax Notice",
    excerpt:
      "Before replying, confirm the filing trail, underlying records, and the exact period in question so the response is defensible.",
    publishedAt: "2025-12-18",
    categoryId: "tax-compliance",
    authorId: "kelvin-mrema",
    mediaLabel: "Response prep",
    readTimeMinutes: 4,
  },
];

const slotOrder: BlogFeaturedSlot[] = ["hero", "popular", "editors-pick"];
const categoryMap = new Map(blogCategories.map((category) => [category.id, category]));
const authorMap = new Map(blogAuthors.map((author) => [author.id, author]));

function toUtcDateValue(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime();
}

function comparePostsNewestFirst(a: BlogPost, b: BlogPost) {
  return toUtcDateValue(b.publishedAt) - toUtcDateValue(a.publishedAt);
}

export function getBlogCategoryById(categoryId: BlogCategoryId) {
  return categoryMap.get(categoryId);
}

export function getBlogAuthorById(authorId: string) {
  return authorMap.get(authorId);
}

export function getBlogPostBySlug(
  slug: string,
  posts: BlogPost[] = blogPosts
) {
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getFeaturedBlogPosts(posts: BlogPost[] = blogPosts) {
  return posts
    .filter((post) => post.featuredSlot)
    .sort((left, right) => {
      const leftIndex = slotOrder.indexOf(left.featuredSlot as BlogFeaturedSlot);
      const rightIndex = slotOrder.indexOf(
        right.featuredSlot as BlogFeaturedSlot
      );

      if (leftIndex === rightIndex) {
        return comparePostsNewestFirst(left, right);
      }

      return leftIndex - rightIndex;
    });
}

export function getVisibleBlogPosts(options?: {
  posts?: BlogPost[];
  categoryId?: BlogCategoryId | "all";
  limit?: number;
  excludeSlugs?: string[];
}) {
  const {
    posts = blogPosts,
    categoryId = "all",
    limit,
    excludeSlugs = [],
  } = options ?? {};
  const blockedSlugs = new Set(excludeSlugs);
  const visiblePosts = posts
    .filter((post) => {
      if (blockedSlugs.has(post.slug)) {
        return false;
      }

      if (categoryId === "all") {
        return true;
      }

      return post.categoryId === categoryId;
    })
    .sort(comparePostsNewestFirst);

  return typeof limit === "number" ? visiblePosts.slice(0, limit) : visiblePosts;
}

export function getHomeInsightPosts(posts: BlogPost[] = blogPosts): InsightPost[] {
  const selectedPosts = posts
    .filter((post) => post.featuredOnHome)
    .sort(comparePostsNewestFirst)
    .slice(0, 4);

  return selectedPosts.map((post) => ({
    tag: getBlogCategoryById(post.categoryId)?.label ?? "Insight",
    title: post.title,
    description: post.excerpt,
    mediaLabel: post.mediaLabel,
  }));
}

export function getHomeBlogPosts(posts: BlogPost[] = blogPosts) {
  return posts
    .filter((post) => post.featuredOnHome)
    .sort(comparePostsNewestFirst)
    .slice(0, 4);
}

export function getRelatedBlogPosts(
  slug: string,
  posts: BlogPost[] = blogPosts
) {
  const currentPost = posts.find((post) => post.slug === slug);

  if (!currentPost) {
    return [];
  }

  if (currentPost.relatedSlugs?.length) {
    return currentPost.relatedSlugs
      .map((relatedSlug) => posts.find((post) => post.slug === relatedSlug))
      .filter((post): post is BlogPost => Boolean(post))
      .slice(0, 3);
  }

  return posts
    .filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.categoryId === currentPost.categoryId
    )
    .sort(comparePostsNewestFirst)
    .slice(0, 3);
}
