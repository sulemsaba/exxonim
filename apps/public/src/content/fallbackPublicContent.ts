import type {
  BlogCategory,
  BlogPost,
  CareerPageContent,
  ContactPageContent,
  HomePageContent,
  InfoPageContent,
  PageRecord,
  PricingPlan,
  ResourcesPageContent,
  SiteSetting,
  Testimonial,
} from "../types";
import type { BrandAssets, CompanyInfo } from "../types";
import type { ApiCareerJob, SiteSettingFooterValue } from "../types/api";
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

export const fallbackCareerPage: PageRecord<CareerPageContent> = createFallbackPage(
  "career",
  "Careers",
  {
    hero: {
      eyebrow: "Fallback hiring view",
      title: "Exxonim keeps the careers route visible while the live feed reconnects.",
      description:
        "You can still understand the hiring direction, the teams Exxonim is building, and the best contact route for current opportunities.",
    },
    focus_areas: [
      "Client operations and workflow coordination",
      "Regulatory and compliance support",
      "Structured follow-up and document readiness",
    ],
    status: {
      label: "Hiring details are refreshing",
      description:
        "Published openings reconnect automatically after the next successful sync. Direct contact remains available right now.",
      primary: {
        label: "Contact Exxonim",
        href: routes.contact,
      },
      secondary: {
        label: "Browse resources",
        href: routes.resources,
      },
    },
  }
);

export const fallbackContactPage: PageRecord<ContactPageContent> = createFallbackPage(
  "contact",
  "Contact",
  {
    hero: {
      eyebrow: "Stable contact path",
      title: "Reach Exxonim even while live content reconnects.",
      description:
        "The contact route stays available so visitors can still send a request, choose the right service path, and use direct fallback contact options.",
    },
    cards: [
      {
        label: "Email",
        value: fallbackCompanyInfo.emails[0] ?? "Use the direct Exxonim email route",
        description: "Best for sending structured details and follow-up questions.",
        action: {
          label: "Email Exxonim",
          href: `mailto:${fallbackCompanyInfo.emails[0] ?? ""}`,
        },
      },
      {
        label: "Phone",
        value: fallbackCompanyInfo.phones[0] ?? "Use the direct Exxonim phone route",
        description: "Use the direct phone path when you need a quick conversation.",
        action: {
          label: "Call Exxonim",
          href: `tel:${(fallbackCompanyInfo.phones[0] ?? "").replace(/\s+/g, "")}`,
        },
      },
      {
        label: "WhatsApp",
        value: "Direct contact",
        description: "Messaging remains available even if the live content layer is delayed.",
        action: {
          label: "Open WhatsApp",
          href: fallbackCompanyInfo.whatsapp || routes.contact,
        },
      },
    ],
  }
);

export const fallbackPrivacyPage: PageRecord<InfoPageContent> = createFallbackPage(
  "privacy",
  "Privacy Policy",
  {
    hero: {
      eyebrow: "Privacy notice",
      title: "Customer and service history lives in the database, not in browser cookies.",
      description:
        "Exxonim uses secure session cookies for admin access, keeps customer and service records in PostgreSQL, and limits browser-side storage to optional preferences like theme memory when you allow it.",
    },
    sections: [
      {
        title: "What we store",
        paragraphs: [
          "Customer history, service records, notes, documents, inbox messages, notifications, and audit logs are stored in the backend database.",
          "We do not use cookies as the main source of truth for business records.",
        ],
      },
      {
        title: "Why we store it",
        paragraphs: [
          "The platform needs operational history to manage requests, track work, notify staff, and produce internal reports grounded in real records.",
          "Retention and access are governed by internal policies and role-based permissions.",
        ],
      },
    ],
    next_step: {
      title: "Need a data request?",
      description:
        "Use Exxonim's support or contact channels and the team will log and process the request through the admin privacy workflow.",
      primary_action: {
        label: "Contact Exxonim",
        href: routes.contact,
      },
      secondary_action: {
        label: "Read your data rights",
        href: routes.dataRights,
      },
    },
  }
);

export const fallbackCookiePage: PageRecord<InfoPageContent> = createFallbackPage(
  "cookies",
  "Cookie Notice",
  {
    hero: {
      eyebrow: "Cookie notice",
      title: "Cookies stay minimal and tied to real browser behavior.",
      description:
        "Necessary cookies support secure admin sessions and consent-state identification. Optional preference storage is limited to browser-side theme memory when you allow it.",
    },
    sections: [
      {
        title: "Necessary storage",
        paragraphs: [
          "Admin authentication uses secure session cookies together with CSRF protection.",
          "Consent records are tied to a consent identifier so the site can remember your choice.",
        ],
      },
      {
        title: "Optional preferences",
        paragraphs: [
          "Theme memory is the only browser preference storage used in this phase, and it should not be treated as a business record.",
          "Analytics and marketing cookies are not active unless the product truly starts using them in a later phase.",
        ],
      },
    ],
    next_step: {
      title: "Review the full privacy details",
      description:
        "The privacy policy and data-rights notice explain what is stored in the system and how requests are handled.",
      primary_action: {
        label: "Privacy policy",
        href: routes.privacy,
      },
      secondary_action: {
        label: "Data rights",
        href: routes.dataRights,
      },
    },
  }
);

export const fallbackDataRightsPage: PageRecord<InfoPageContent> = createFallbackPage(
  "data-rights",
  "Data Rights",
  {
    hero: {
      eyebrow: "Data rights",
      title: "Access, correction, and deletion requests are handled through a documented internal workflow.",
      description:
        "Exxonim keeps privacy handling operational and auditable. Requests are logged internally, reviewed, and processed without silently deleting audit-critical history.",
    },
    sections: [
      {
        title: "Available request types",
        paragraphs: [
          "You can ask for access to personal data, correction of inaccurate data, or deletion handling where legally and operationally appropriate.",
        ],
        bullets: [
          "Access requests",
          "Correction requests",
          "Deletion requests with reviewed anonymization or constrained delete handling",
        ],
      },
      {
        title: "How requests are handled",
        paragraphs: [
          "Requests currently come through existing support and contact channels, then staff log them into the admin privacy-request workflow.",
          "Deletion handling avoids silent hard deletion of audit-critical records and keeps an explicit audit trail.",
        ],
      },
    ],
    next_step: {
      title: "Start a request",
      description:
        "Use the contact or support page and Exxonim staff will log the request for verification and follow-up.",
      primary_action: {
        label: "Contact Exxonim",
        href: routes.contact,
      },
      secondary_action: {
        label: "Support",
        href: routes.support,
      },
    },
  }
);

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

export const fallbackPricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Foundation",
    badge: "Stable start",
    description:
      "A fallback package outline for registration and first-step compliance work while live pricing reconnects.",
    notes: "Use the Exxonim contact route for the latest package guidance.",
    recommended: false,
    features: [
      { label: "Entity setup guidance", included: true },
      { label: "Document checklist review", included: true },
      { label: "Licensing follow-through", included: false },
    ],
  },
  {
    id: 2,
    name: "Operating",
    badge: "Recommended",
    description:
      "A balanced fallback plan for teams that need registration, licensing, and recurring compliance support.",
    notes: "Live package details return automatically after the next successful sync.",
    recommended: true,
    features: [
      { label: "Entity setup guidance", included: true },
      { label: "Licensing follow-through", included: true },
      { label: "Compliance reminders", included: true },
    ],
  },
  {
    id: 3,
    name: "Continuity",
    badge: "Extended coverage",
    description:
      "A higher-touch fallback outline for teams with multiple filings, renewals, and document dependencies.",
    notes: "Contact Exxonim directly for a tailored scope while the live catalog reconnects.",
    recommended: false,
    features: [
      { label: "Priority support coordination", included: true },
      { label: "Ongoing compliance planning", included: true },
      { label: "Multi-stream document support", included: true },
    ],
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    eyebrow: "Fallback review",
    headline: "The public shell still gives visitors a clear next step.",
    support:
      "Even without live testimonials, Exxonim keeps the trust path readable with stable service framing and direct contact options.",
    quote:
      "We could still understand the service direction, the next action, and how to reach the team while the live feed recovered.",
    name: "Operations Team",
    role: "Fallback reference",
    initials: "OT",
  },
  {
    id: 2,
    eyebrow: "Fallback review",
    headline: "Important public context stays visible instead of disappearing.",
    support:
      "The site continues to show service categories, contact paths, and core positioning even during temporary backend interruptions.",
    quote:
      "The experience still felt intentional because the shell stayed complete and the contact route remained obvious.",
    name: "Compliance Lead",
    role: "Fallback reference",
    initials: "CL",
  },
];

export const fallbackJobs: ApiCareerJob[] = [
  {
    id: 1,
    title: "Client Operations Coordinator",
    slug: "client-operations-coordinator",
    department: "Operations",
    employment_type: "Full-time",
    location_mode: "hybrid",
    city: "Dar es Salaam",
    country: "Tanzania",
    compensation_label: null,
    experience_label: "Mid-level",
    summary:
      "Support registration and compliance workflows while the live hiring feed reconnects.",
    description:
      "Coordinate internal follow-through, document readiness, and status visibility across active client work.",
    requirements: [
      "Comfort working with operational checklists",
      "Clear written communication",
      "Confidence handling structured follow-up work",
    ],
    responsibilities: [
      "Track active workstreams",
      "Coordinate next actions with the team",
      "Help keep filing and follow-up work organized",
    ],
    status: "published",
    is_published: true,
    published_at: "2026-04-01T00:00:00Z",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
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
    case "career":
      return fallbackCareerPage;
    case "contact":
      return fallbackContactPage;
    case "resources":
      return fallbackResourcesPage;
    case "privacy":
      return fallbackPrivacyPage;
    case "cookies":
      return fallbackCookiePage;
    case "data-rights":
      return fallbackDataRightsPage;
    default:
      return undefined;
  }
}

export { fallbackBlogCategories, fallbackNavigationItems };
