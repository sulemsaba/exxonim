export type Theme = "light" | "dark";

export interface BrandAssets {
  name: string;
  lightLogoSrc: string;
  darkLogoSrc: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  label: string;
  videoSrc: string;
  title: string;
  description: string;
}

export interface HeroMetric {
  title: string;
  description: string;
  iconClass: string;
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

export interface InsightPost {
  tag: string;
  title: string;
  description: string;
  mediaLabel: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}
