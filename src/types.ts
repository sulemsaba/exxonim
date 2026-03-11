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

export interface ServiceNavGroup {
  title: string;
  summary: string;
  href: string;
  items: string[];
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
