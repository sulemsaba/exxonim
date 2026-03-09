import type {
  BrandAssets,
  HeroMetric,
  HeroSlide,
  InsightPost,
  NavLink,
  ServiceNavGroup,
  StackItem,
} from "./types";

export const brand: BrandAssets = {
  name: "Exxonim",
  lightLogoSrc: "/exxonim-logo.webp",
  darkLogoSrc: "/logo-dark.png",
};

export const primaryNavLinks: NavLink[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Blogs", href: "#resources" },
  { label: "Contact", href: "#contact" },
  { label: "Career", href: "#career" },
  { label: "FAQs", href: "#faqs" },
];

export const serviceNavGroups: ServiceNavGroup[] = [
  {
    title: "Business Registration Services",
    summary: "BRELA-focused setup, protection, and entity formation.",
    href: "#services",
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
    href: "#results",
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
    href: "#services",
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
    href: "#industries",
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
    href: "#services",
    items: [
      "Business Plan Preparation",
      "Financial Statement Preparation",
      "MEMART Preparation",
      "Revenue Forecasting",
    ],
  },
];

export const heroSlides: HeroSlide[] = [
  {
    label: "Registration desk",
    videoSrc: "",
    title: "Company and organization setup",
    description:
      "Entity formation, business name filing, NGO support, and trademark registration handled with clearer documentation flow.",
  },
  {
    label: "Compliance desk",
    videoSrc: "",
    title: "TIN, returns, and statutory filing",
    description:
      "TRA registration, annual returns, and compliance submissions organized to keep businesses current and submission-ready.",
  },
  {
    label: "Licensing desk",
    videoSrc: "",
    title: "Licensing and regulated approvals",
    description:
      "Business licenses, BOT-linked approvals, and institutional registrations coordinated with follow-up that keeps moving.",
  },
];

export const heroMetrics: HeroMetric[] = [
  {
    title: "Company and NGO Setup",
    description: "Formation support from name search to final registration.",
    iconClass: "icon-bars",
  },
  {
    title: "Tax and Returns",
    description: "TIN application and statutory filing support.",
    iconClass: "icon-people",
  },
  {
    title: "Licensing Support",
    description: "Local licenses and regulator-facing applications.",
    iconClass: "icon-bolt",
  },
  {
    title: "Business Support",
    description: "Plans, statements, and readiness for next decisions.",
    iconClass: "icon-eye",
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
    ctaHref: "#services",
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
    ctaHref: "#results",
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
    ctaHref: "#resources",
    windowTitle: "Transformation Steering",
    windowTag: "Delivery",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/ContextBlindspot.mov",
  },
];

export const insightPosts: InsightPost[] = [
  {
    tag: "Guide",
    title: "Documents to prepare before company registration starts",
    description:
      "A practical shortlist for founders who want the filing process to move without repeated document requests.",
    mediaLabel: "Registration prep",
  },
  {
    tag: "Checklist",
    title: "How to keep annual statutory returns from becoming a backlog",
    description:
      "A simple way to map deadlines, responsible parties, and missing records before penalties stack up.",
    mediaLabel: "Compliance rhythm",
  },
  {
    tag: "Guide",
    title: "When a business license application needs more than the base form",
    description:
      "Supporting documents, sector requirements, and follow-up points that usually determine whether the application stalls.",
    mediaLabel: "Licensing notes",
  },
  {
    tag: "2026",
    title: "What investors and lenders expect from a usable business plan",
    description:
      "A strong plan is less about volume and more about assumptions, structure, and financial coherence.",
    mediaLabel: "Planning support",
  },
];
