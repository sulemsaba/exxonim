import { blogPosts, getBlogPostBySlug } from "./content";
import { getResourcePostSlug, normalizePathname, resourcePost, routes } from "./routes";

export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
  image: string;
  type: "website" | "article";
  robots: string;
}

export const siteOrigin = "https://exxonim.tz";
const defaultImage = `${siteOrigin}/exxonim-logo.webp`;

const pageSeoMap: Record<string, Omit<PageSeo, "canonicalPath">> = {
  [normalizePathname(routes.home)]: {
    title: "Exxonim | Registration, Licensing, and Compliance Support",
    description:
      "Exxonim helps businesses, NGOs, and institutions handle registration, licensing, statutory filing, and practical compliance work in Tanzania.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.about)]: {
    title: "About Exxonim | Practical Regulatory Support",
    description:
      "Learn how Exxonim supports registration, regulatory follow-through, and compliance preparation for growing organizations in Tanzania.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.faq)]: {
    title: "FAQ | Exxonim",
    description:
      "Answers to common questions about registration, filings, licensing, and how Exxonim supports follow-through after submission.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.services)]: {
    title: "Services | Exxonim",
    description:
      "Explore Exxonim services for company registration, licensing, tax compliance, institutional registration, and business support.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.tracking)]: {
    title: "Consultation Follow-Through | Exxonim",
    description:
      "See how Exxonim structures intake, review, submission, and follow-up so clients know the next step after they reach out.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.resources)]: {
    title: "Resources | Exxonim",
    description:
      "Read Exxonim articles on registration readiness, filing control, licensing preparation, and operational compliance support.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.career)]: {
    title: "Career | Exxonim",
    description:
      "Explore career opportunities at Exxonim for client service, compliance support, documentation, and operations-focused roles.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.contact)]: {
    title: "Contact Exxonim",
    description:
      "Contact Exxonim to start a consultation, ask a question, or follow up on registration, licensing, and compliance work.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.support)]: {
    title: "Support | Exxonim",
    description:
      "Get support contact details, expected response channels, and guidance on how to share filing or licensing questions with Exxonim.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.terms)]: {
    title: "Terms of Use | Exxonim",
    description:
      "Review the Exxonim website terms of use covering access, content, permitted use, and contact details.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.privacy)]: {
    title: "Privacy Policy | Exxonim",
    description:
      "Read the Exxonim website privacy policy describing the information the site receives and how Exxonim uses it.",
    image: defaultImage,
    type: "website",
    robots: "index,follow",
  },
  [normalizePathname(routes.notFound)]: {
    title: "Page Not Found | Exxonim",
    description:
      "The page you requested could not be found. Return to Exxonim home, services, or resources.",
    image: defaultImage,
    type: "website",
    robots: "noindex,follow",
  },
};

function buildAbsoluteUrl(path: string) {
  return new URL(path, siteOrigin).toString();
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ensureMetaTag(selector: string, setup: (meta: HTMLMetaElement) => void) {
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    setup(meta);
    document.head.appendChild(meta);
  }

  return meta;
}

function ensureLinkTag(selector: string, setup: (link: HTMLLinkElement) => void) {
  let link = document.querySelector(selector) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    setup(link);
    document.head.appendChild(link);
  }

  return link;
}

export function getPageSeo(pathname: string | undefined): PageSeo {
  const normalizedPathname = normalizePathname(pathname);
  const articleSlug = getResourcePostSlug(normalizedPathname);

  if (articleSlug) {
    const post = getBlogPostBySlug(articleSlug, blogPosts);

    if (post) {
      return {
        title: `${post.title} | Exxonim Resources`,
        description: post.excerpt,
        canonicalPath: resourcePost(post.slug),
        image: post.coverImageSrc ?? defaultImage,
        type: "article",
        robots: "index,follow",
      };
    }

    return {
      ...pageSeoMap[normalizePathname(routes.notFound)],
      canonicalPath: routes.notFound,
    };
  }

  const pageSeo = pageSeoMap[normalizedPathname] ?? pageSeoMap[normalizePathname(routes.notFound)];

  return {
    ...pageSeo,
    canonicalPath:
      pageSeo === pageSeoMap[normalizePathname(routes.notFound)]
        ? routes.notFound
        : normalizedPathname === "/"
          ? routes.home
          : `${normalizedPathname}/`,
  };
}

export function applyPageSeo(pathname: string | undefined) {
  const seo = getPageSeo(pathname);
  const canonicalUrl = buildAbsoluteUrl(seo.canonicalPath);

  document.title = seo.title;

  const metaDescription = ensureMetaTag(
    'meta[name="description"]',
    (meta) => {
      meta.name = "description";
      meta.setAttribute("data-exxonim", "description");
    }
  );
  metaDescription.content = seo.description;

  const robotsMeta = ensureMetaTag('meta[name="robots"]', (meta) => {
    meta.name = "robots";
    meta.setAttribute("data-exxonim", "robots");
  });
  robotsMeta.content = seo.robots;

  const ogTitle = ensureMetaTag('meta[property="og:title"]', (meta) => {
    meta.setAttribute("property", "og:title");
    meta.setAttribute("data-exxonim", "og:title");
  });
  ogTitle.content = seo.title;

  const ogDescription = ensureMetaTag(
    'meta[property="og:description"]',
    (meta) => {
      meta.setAttribute("property", "og:description");
      meta.setAttribute("data-exxonim", "og:description");
    }
  );
  ogDescription.content = seo.description;

  const ogType = ensureMetaTag('meta[property="og:type"]', (meta) => {
    meta.setAttribute("property", "og:type");
    meta.setAttribute("data-exxonim", "og:type");
  });
  ogType.content = seo.type;

  const ogUrl = ensureMetaTag('meta[property="og:url"]', (meta) => {
    meta.setAttribute("property", "og:url");
    meta.setAttribute("data-exxonim", "og:url");
  });
  ogUrl.content = canonicalUrl;

  const ogImage = ensureMetaTag('meta[property="og:image"]', (meta) => {
    meta.setAttribute("property", "og:image");
    meta.setAttribute("data-exxonim", "og:image");
  });
  ogImage.content = seo.image;

  const twitterCard = ensureMetaTag('meta[name="twitter:card"]', (meta) => {
    meta.name = "twitter:card";
    meta.setAttribute("data-exxonim", "twitter:card");
  });
  twitterCard.content = "summary_large_image";

  const twitterTitle = ensureMetaTag('meta[name="twitter:title"]', (meta) => {
    meta.name = "twitter:title";
    meta.setAttribute("data-exxonim", "twitter:title");
  });
  twitterTitle.content = seo.title;

  const twitterDescription = ensureMetaTag(
    'meta[name="twitter:description"]',
    (meta) => {
      meta.name = "twitter:description";
      meta.setAttribute("data-exxonim", "twitter:description");
    }
  );
  twitterDescription.content = seo.description;

  const twitterImage = ensureMetaTag('meta[name="twitter:image"]', (meta) => {
    meta.name = "twitter:image";
    meta.setAttribute("data-exxonim", "twitter:image");
  });
  twitterImage.content = seo.image;

  const canonicalLink = ensureLinkTag(
    'link[rel="canonical"][data-exxonim="canonical"]',
    (link) => {
      link.rel = "canonical";
      link.setAttribute("data-exxonim", "canonical");
    }
  );
  canonicalLink.href = canonicalUrl;
}

export function escapeSeoValue(value: string) {
  return escapeHtmlAttribute(value);
}
