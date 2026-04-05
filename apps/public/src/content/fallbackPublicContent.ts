import type {
  BlogCategory,
  BlogPost,
  HomePageContent,
  PageRecord,
  ResourcesPageContent,
  SiteSetting,
} from "../types";
import type { BrandAssets, CompanyInfo } from "../types";
import type { SiteSettingFooterValue } from "../types/api";
import {
  fallbackBrand,
  fallbackCompanyInfo,
  fallbackFooter,
  fallbackNavigationItems,
} from "./fallbackShell";
import { routes } from "../routes";

const FALLBACK_RECORD_ID = 0;
const FALLBACK_TIMESTAMP = "fallback";

function createFallbackPage<TContent>(
  slug: string,
  title: string,
  content: TContent
): PageRecord<TContent> {
  return {
    id: FALLBACK_RECORD_ID,
    title,
    slug,
    content,
    isPublished: true,
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  };
}

function createFallbackSiteSetting<TValue>(
  key: string,
  value: TValue
): SiteSetting<TValue> {
  return {
    id: FALLBACK_RECORD_ID,
    key,
    value,
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  };
}

const fallbackBlogCategories: BlogCategory[] = [
  {
    id: "business-setup",
    label: "Business Setup",
    description: "Foundational guidance for registrations, filings, and first-step compliance.",
  },
  {
    id: "compliance",
    label: "Compliance",
    description: "Practical reminders and process notes for recurring obligations.",
  },
  {
    id: "operations",
    label: "Operations",
    description: "Operational guidance for teams managing growing workloads and deadlines.",
  },
];

function getFallbackCategory(id: string) {
  return fallbackBlogCategories.find((category) => category.id === id);
}

export const fallbackHomePage: PageRecord<HomePageContent> = createFallbackPage(
  "home",
  "Exxonim",
  {
    hero: {
      eyebrow: "Read-only fallback mode",
      title: "Business setup and compliance support still available while live services reconnect.",
      description:
        "Exxonim helps organizations move through registration, licensing, and regulatory follow-through with a clearer process and fewer avoidable delays.",
      cta: {
        label: "Contact Exxonim",
        href: routes.contact,
      },
      highlights: [
        {
          title: "Setup",
          detail: "Company, NGO, and business registration support",
        },
        {
          title: "Compliance",
          detail: "Licensing, renewals, and practical filing follow-up",
        },
        {
          title: "Guidance",
          detail: "Clear next steps while live content reconnects",
        },
      ],
    },
    provider_section: {
      kicker: "Trusted workflow references",
      title: "Fallback brand and partner references stay visible even during backend interruptions.",
      logos: [
        { alt: "Utec", src: "/assets/clients/utec.webp" },
        { alt: "TRCS", src: "/assets/clients/trcs.webp" },
        { alt: "Levo", src: "/assets/clients/levo.webp" },
        { alt: "GET", src: "/assets/clients/get.webp" },
      ],
    },
    stack_section: {
      items: [
        {
          title: "Start with the right setup path",
          subtitle: "Choose the filing sequence that matches the organization you are building.",
          description:
            "Fallback content keeps the core value proposition visible so visitors can still understand the service direction before live content comes back.",
          ctaLabel: "Discuss your case",
          ctaHref: routes.contact,
          windowTitle: "Setup",
          windowTag: "Fallback",
          videoSrc: "",
        },
        {
          title: "Keep compliance work organized",
          subtitle: "Stay clear on what is filed, what is pending, and what should happen next.",
          description:
            "The public shell remains usable with a stable message and contact path instead of collapsing into empty states.",
          ctaLabel: "Explore services",
          ctaHref: routes.services,
          windowTitle: "Compliance",
          windowTag: "Fallback",
          videoSrc: "",
        },
      ],
      default_feature_rows: [
        {
          title: "Registration support",
          description: "Company, NGO, and business-name setup guidance.",
          visualKey: "registration",
        },
        {
          title: "Tax and licensing",
          description: "TIN, licensing, and approval support that stays readable in fallback mode.",
          visualKey: "tax",
        },
        {
          title: "Operational continuity",
          description: "A stable shell, working contact path, and preserved orientation for visitors.",
          visualKey: "institutional",
        },
      ],
      feature_visual_content: {
        registration: {
          workstreamValue: "Registration",
          counterpartLabel: "Client",
          counterpartValue: "Organization setup",
          focusValue: "Setup path",
          summaryTitle: "Fallback keeps the core journey readable.",
          summaryBody:
            "Visitors can still understand the registration and compliance offering even if live CMS content is unavailable.",
        },
        tax: {
          workstreamValue: "Compliance",
          counterpartLabel: "Client",
          counterpartValue: "Ongoing obligations",
          focusValue: "Filings and renewals",
          summaryTitle: "Fallback protects continuity.",
          summaryBody:
            "The site can still show useful service framing instead of a blocked or empty homepage.",
        },
        institutional: {
          workstreamValue: "Operations",
          counterpartLabel: "Shell",
          counterpartValue: "Always visible",
          focusValue: "Navigation, contact, and positioning",
          summaryTitle: "Core shell content remains available.",
          summaryBody:
            "The navigation, brand, and basic public explanation remain visible while live data reconnects.",
        },
      },
    },
    insights_section: {
      title: "Fallback insights",
      intro: "Public content falls back to a stable baseline when live services are temporarily unavailable.",
      footer_copy: "Live content replaces this automatically after the next successful fetch.",
    },
  }
);

export const fallbackResourcesPage: PageRecord<ResourcesPageContent> =
  createFallbackPage("resources", "Resources", {
    hero_title: "Guides, updates, and practical notes for setup and compliance work",
    trending_label: "Fallback reads",
    top_media: {
      hero: "/assets/exxonim-logo.webp",
      banner: "/assets/logo-dark.png",
      trending: [
        "/assets/clients/utec.webp",
        "/assets/clients/trcs.webp",
        "/assets/clients/levo.webp",
      ],
    },
    article_sidebar: {
      title: "Need direct help?",
      description:
        "Fallback content is available while the live resource feed reconnects. You can still contact Exxonim directly.",
      primary_cta: {
        label: "Contact Exxonim",
        href: routes.contact,
      },
    },
    empty_state: {
      title: "Articles are temporarily unavailable.",
      description:
        "Please check back shortly, or contact Exxonim directly for immediate guidance.",
    },
  });

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "company-registration-basics",
    title: "Company registration basics before your first filing",
    excerpt:
      "A short checklist for preparing incorporation details, supporting documents, and first-step authority submissions.",
    publishedAt: "2026-03-22",
    category: getFallbackCategory("business-setup"),
    mediaLabel: "Company registration basics",
    featuredSlot: "hero",
    featuredOnHome: true,
    relatedSlugs: ["tin-registration-checklist", "compliance-calendar-basics"],
    content: {
      introduction:
        "Start with the exact entity type, ownership information, and document set you expect to file so the process does not stall later.",
      highlights: [
        "Confirm the legal structure first.",
        "Prepare identity and address documents before filing.",
        "Map which authority comes first in your sequence.",
      ],
      sections: [
        {
          heading: "Before you submit",
          paragraphs: [
            "Gather shareholder or member details, draft names, and contact records in one place.",
            "Keep a simple filing checklist so follow-up requests do not create unnecessary delays.",
          ],
        },
      ],
    },
  },
  {
    id: 2,
    slug: "tin-registration-checklist",
    title: "TIN registration checklist for new businesses",
    excerpt:
      "The basic inputs teams should verify before starting tax registration and related account setup.",
    publishedAt: "2026-03-10",
    category: getFallbackCategory("compliance"),
    mediaLabel: "TIN registration checklist",
    featuredSlot: "popular",
    featuredOnHome: true,
    relatedSlugs: ["company-registration-basics", "licensing-renewal-prep"],
    content: {
      introduction:
        "Tax registration runs more smoothly when core entity details, contact records, and supporting documents are already aligned.",
      highlights: [
        "Keep legal and trading names consistent.",
        "Prepare contact and location details exactly as filed elsewhere.",
      ],
      sections: [
        {
          heading: "Consistency matters",
          paragraphs: [
            "Small mismatches across names, addresses, and contact points often create avoidable back-and-forth during review.",
          ],
        },
      ],
    },
  },
  {
    id: 3,
    slug: "licensing-renewal-prep",
    title: "How to prepare for licensing and renewal cycles",
    excerpt:
      "A practical way to track renewal dates, support files, and internal approvals before deadlines start to compress.",
    publishedAt: "2026-02-28",
    category: getFallbackCategory("compliance"),
    mediaLabel: "Licensing renewal prep",
    featuredSlot: "editors-pick",
    featuredOnHome: false,
    relatedSlugs: ["tin-registration-checklist", "compliance-calendar-basics"],
    content: {
      introduction:
        "Renewal work is easier when the team keeps one calendar, one document source, and one owner for each filing track.",
      highlights: [
        "Track deadlines in one place.",
        "Assign one accountable owner per renewal stream.",
      ],
      sections: [
        {
          heading: "Set the cadence",
          paragraphs: [
            "A shared filing calendar prevents deadlines from becoming last-minute recovery work.",
          ],
        },
      ],
    },
  },
  {
    id: 4,
    slug: "compliance-calendar-basics",
    title: "Build a simple compliance calendar your team can actually use",
    excerpt:
      "A lightweight operating model for recurring filings, reminders, and decision points across the year.",
    publishedAt: "2026-02-12",
    category: getFallbackCategory("operations"),
    mediaLabel: "Compliance calendar basics",
    featuredOnHome: false,
    relatedSlugs: ["licensing-renewal-prep", "company-registration-basics"],
    content: {
      introduction:
        "A workable calendar is short, visible, and tied to the next action rather than stored in disconnected spreadsheets.",
      highlights: [
        "Use one owner and one date per obligation.",
        "Record the next action, not just the deadline.",
      ],
      sections: [
        {
          heading: "Keep it simple",
          paragraphs: [
            "The calendar only helps if the team can see what is pending and who moves it forward.",
          ],
        },
      ],
    },
  },
];

export const fallbackBrandSetting = createFallbackSiteSetting<BrandAssets>(
  "brand",
  fallbackBrand
);

export const fallbackCompanyInfoSetting = createFallbackSiteSetting<CompanyInfo>(
  "company_info",
  fallbackCompanyInfo
);

export const fallbackFooterSetting =
  createFallbackSiteSetting<SiteSettingFooterValue>("footer", fallbackFooter);

export function getFallbackSiteSetting(key: string) {
  switch (key) {
    case "brand":
      return fallbackBrandSetting;
    case "company_info":
      return fallbackCompanyInfoSetting;
    case "footer":
      return fallbackFooterSetting;
    default:
      return undefined;
  }
}

export function getFallbackPage(slug: string) {
  switch (slug) {
    case "home":
      return fallbackHomePage;
    case "resources":
      return fallbackResourcesPage;
    default:
      return undefined;
  }
}

export { fallbackBlogCategories, fallbackNavigationItems };
