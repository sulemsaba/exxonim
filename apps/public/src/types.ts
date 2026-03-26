export type Theme = "light" | "dark";
export type BlogCategoryId = string;
export type BlogFeaturedSlot = "hero" | "popular" | "editors-pick" | string;

export interface BrandAssets {
  name: string;
  lightLogoSrc: string;
  darkLogoSrc: string;
}

export interface CompanyInfo {
  name: string;
  phones: string[];
  emails: string[];
  address: string;
  whatsapp: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterContent {
  quickLinks: NavLink[];
  otherResources: NavLink[];
  tagline: string;
  primaryCta: {
    label: string;
    href: string;
  };
  copyright: string;
}

export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  kind: string;
  order: number;
  isActive: boolean;
  parentId?: number | null;
  createdAt: string;
  updatedAt: string;
  children: NavigationItem[];
}

export interface ServiceNavGroup {
  title: string;
  summary: string;
  href: string;
  items: string[];
}

export interface ProviderLogo {
  alt: string;
  src: string;
}

export interface StackItem {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  windowTitle: string;
  windowTag: string;
  videoSrc: string;
}

export interface FeatureRow {
  title: string;
  description: string;
  visualKey: string;
}

export interface FeatureVisualContent {
  workstreamValue: string;
  counterpartLabel: string;
  counterpartValue: string;
  focusValue: string;
  summaryTitle: string;
  summaryBody: string;
}

export interface BlogCategory {
  id: BlogCategoryId;
  label: string;
  description?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role?: string;
  avatarSrc?: string;
  bio?: string;
}

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogArticleContent {
  introduction: string;
  highlights: string[];
  sections: BlogArticleSection[];
  html?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category?: BlogCategory;
  author?: BlogAuthor;
  coverImageSrc?: string;
  coverAlt?: string;
  mediaLabel: string;
  featuredSlot?: BlogFeaturedSlot;
  featuredOnHome: boolean;
  readTimeMinutes?: number;
  relatedSlugs: string[];
  metaTitle?: string;
  metaDescription?: string;
  content?: BlogArticleContent;
}

export interface Testimonial {
  id: number;
  eyebrow: string;
  headline: string;
  support: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  badge?: string;
  description: string;
  notes: string;
  recommended: boolean;
  features: PricingFeature[];
}

export interface ServiceSignal {
  value: string;
  label: string;
  detail: string;
}

export interface ServiceFlowItem {
  step: string;
  title: string;
  detail: string;
}

export interface ServiceCatalogItem {
  id: string;
  label: string;
  detail: string;
}

export interface ServiceCatalogGroup {
  title: string;
  description: string;
  services: ServiceCatalogItem[];
}

export interface TrackingCheckpoint {
  title: string;
  detail: string;
  status: string;
}

export interface TrackingCaseExample {
  title: string;
  detail: string;
}

export interface TrackingWorkflowStep {
  title: string;
  detail: string;
}

export interface ContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PageRecord<TContent = Record<string, unknown>> {
  id: number;
  title: string;
  slug: string;
  content: TContent;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSetting<TValue = unknown> {
  id: number;
  key: string;
  value: TValue;
  createdAt: string;
  updatedAt: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  highlights: Array<{
    title: string;
    detail: string;
  }>;
}

export interface ProviderSectionContent {
  kicker: string;
  title: string;
  logos: ProviderLogo[];
}

export interface HomeInsightsContent {
  title: string;
  intro: string;
  footer_copy: string;
}

export interface HomePageContent {
  hero: HomeHeroContent;
  provider_section: ProviderSectionContent;
  stack_section: {
    items: StackItem[];
    default_feature_rows: FeatureRow[];
    feature_visual_content: Record<string, FeatureVisualContent>;
  };
  insights_section: HomeInsightsContent;
}

export interface AboutPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  company_profile: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    working_style_label?: string;
    working_style: string;
  };
  support_profiles_section?: {
    title: string;
    description: string;
  };
  support_profiles: Array<{
    title: string;
    description: string;
  }>;
  service_scope_section?: {
    title: string;
    description: string;
  };
  service_scope: Array<{
    title: string;
    description: string;
  }>;
  operating_model_section?: {
    title: string;
    description: string;
  };
  operating_model: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  client_expectations_section?: {
    title: string;
    description: string;
  };
  client_expectations: string[];
  cta: {
    title: string;
    description: string;
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
}

export interface FaqPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface CareerPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  focus_areas: string[];
  status: {
    label: string;
    description: string;
    primary: {
      label: string;
      href: string;
    };
    secondary: {
      label: string;
      href: string;
    };
  };
}

export interface ContactPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: Array<{
    label: string;
    value: string;
    description: string;
    action: {
      label: string;
      href: string;
    };
  }>;
}

export interface ServicesOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  panel_title: string;
  panel_body: string;
  service_signals: ServiceSignal[];
  service_nav_groups: ServiceNavGroup[];
  service_flow: ServiceFlowItem[];
  service_promises: string[];
}

export interface ServicesCatalogContent {
  eyebrow: string;
  title: string;
  description: string;
  service_groups: ServiceCatalogGroup[];
}

export interface TrackingSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  checkpoints: TrackingCheckpoint[];
  case_examples: TrackingCaseExample[];
  workflow_steps: TrackingWorkflowStep[];
}

export interface RequestConsultationPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  summary: {
    title: string;
    description: string;
    bullets: string[];
  };
}

export interface ServicesPageContent {
  overview: ServicesOverviewContent;
  catalog: ServicesCatalogContent;
  tracking_section: TrackingSectionContent;
}

export interface ResourcesPageContent {
  hero_title: string;
  trending_label?: string;
  top_media: {
    hero: string;
    banner: string;
    trending: string[];
  };
  article_sidebar?: {
    title: string;
    description: string;
    primary_cta?: {
      label: string;
      href: string;
    };
  };
  empty_state: {
    title: string;
    description: string;
  };
}

export interface InfoPageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  sections: ContentSection[];
  next_step?: {
    title: string;
    description: string;
    primary_action?: { href: string; label: string };
    secondary_action?: { href: string; label: string };
  };
}
