import type {
  BrandAssets,
  FooterLinkGroup,
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
    label: "Executive diagnostic",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/BrittleChainCodeBlock1.mov",
    title: "Leadership focus",
    description:
      "We isolate the few decisions, conflicts, and operating constraints that are actually slowing growth.",
  },
  {
    label: "Operating cadence",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/The%20_Manual%20Orchestration_%20Tax.mov",
    title: "Operating rhythm",
    description:
      "We redesign reporting, meeting cadence, and decision rights so teams move faster with less friction.",
  },
  {
    label: "Transformation office",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/ContextBlindspot.mov",
    title: "Change that holds",
    description:
      "We turn plans into milestones, owners, governance, and review loops that survive real operating pressure.",
  },
];

export const heroMetrics: HeroMetric[] = [
  {
    title: "Growth Strategy",
    description: "Commercial direction with sharper priorities.",
    iconClass: "icon-bars",
  },
  {
    title: "Operating Design",
    description: "Clear roles, cadence, and accountability.",
    iconClass: "icon-people",
  },
  {
    title: "Transformation Delivery",
    description: "Execution support from idea to rollout.",
    iconClass: "icon-bolt",
  },
  {
    title: "Performance Advisory",
    description: "Margin, productivity, and team focus.",
    iconClass: "icon-eye",
  },
];

export const providerLabels: string[] = [
  "Board Priorities",
  "Growth Strategy",
  "Operating Model",
  "Transformation PMO",
  "Commercial Performance",
  "Leadership Alignment",
  "Execution Cadence",
];

export const stackItems: StackItem[] = [
  {
    title: "When Strategy Stops at the Offsite",
    subtitle: "Alignment, choices, and commercial priorities",
    description:
      "Leadership teams often agree on ambition but not on the sequence, owners, and tradeoffs needed to move. We turn the plan into a short, practical agenda the business can execute against.",
    ctaLabel: "See our advisory model",
    ctaHref: "#services",
    windowTitle: "board-priority-map",
    windowTag: "strategy",
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
    windowTitle: "operating-cadence-review",
    windowTag: "ops",
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
    windowTitle: "transformation-office",
    windowTag: "delivery",
    videoSrc:
      "https://asset.acho.io/new-aden-website/home/ContextBlindspot.mov",
  },
];

export const insightPosts: InsightPost[] = [
  {
    tag: "Latest",
    title: "Why Growth Plans Fail in the Middle Layer",
    description:
      "Strategy usually breaks where ownership becomes unclear. Here is how to fix that before execution slows.",
    mediaLabel: "Operating clarity",
  },
  {
    tag: "Latest",
    title: "The Meeting Load That Quietly Kills Momentum",
    description:
      "An executive team can spend a week in updates and still miss the decisions that matter.",
    mediaLabel: "Cadence design",
  },
  {
    tag: "Guide",
    title: "How to Scale Without Rewriting the Whole Business",
    description:
      "Structure should support growth, not slow it down. The key is knowing what to redesign first.",
    mediaLabel: "Scale with structure",
  },
  {
    tag: "2026",
    title: "The Leadership Metrics That Actually Drive Action",
    description:
      "Dashboards become useful when they are tied to choices, not just visibility.",
    mediaLabel: "Decision quality",
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "#top" },
      { label: "Challenges", href: "#stacked-scroll" },
      { label: "Approach", href: "#services" },
      { label: "Sectors", href: "#industries" },
      { label: "Impact", href: "#results" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Advisory",
    links: [
      { label: "Growth Strategy", href: "#services" },
      { label: "Operating Design", href: "#services" },
      { label: "Transformation Delivery", href: "#services" },
      { label: "Performance Advisory", href: "#results" },
      { label: "Executive Workshops", href: "#results" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#resources" },
      { label: "Case Examples", href: "#results" },
      { label: "Sectors", href: "#industries" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms & Conditions", href: "#terms" },
    ],
  },
];
