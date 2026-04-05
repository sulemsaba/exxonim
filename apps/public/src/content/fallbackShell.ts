import type { SiteSettingFooterValue } from "../types/api";
import type { BrandAssets, CompanyInfo, NavigationItem } from "../types";
import { routes } from "../routes";

const FALLBACK_TIMESTAMP = "fallback";

function createNavigationItem(
  id: number,
  title: string,
  url: string,
  order: number,
  options?: {
    kind?: string;
    parentId?: number | null;
    description?: string;
    children?: NavigationItem[];
  }
): NavigationItem {
  return {
    id,
    title,
    url,
    description: options?.description,
    kind: options?.kind ?? "primary",
    order,
    isActive: true,
    parentId: options?.parentId ?? null,
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
    children: options?.children ?? [],
  };
}

const servicesNavigation = createNavigationItem(100, "Services", routes.services, 3, {
  children: [
    createNavigationItem(110, "Business Setup", routes.services, 1, {
      kind: "group",
      parentId: 100,
      children: [
        createNavigationItem(111, "Company Registration", routes.services, 1, {
          kind: "secondary",
          parentId: 110,
        }),
        createNavigationItem(112, "TIN Application", routes.services, 2, {
          kind: "secondary",
          parentId: 110,
        }),
        createNavigationItem(113, "Business License Applications", routes.services, 3, {
          kind: "secondary",
          parentId: 110,
        }),
      ],
    }),
    createNavigationItem(120, "Compliance Support", routes.services, 2, {
      kind: "group",
      parentId: 100,
      children: [
        createNavigationItem(121, "Statutory Filings", routes.services, 1, {
          kind: "secondary",
          parentId: 120,
        }),
        createNavigationItem(122, "Regulatory Renewals", routes.services, 2, {
          kind: "secondary",
          parentId: 120,
        }),
        createNavigationItem(123, "Operational Advisory", routes.services, 3, {
          kind: "secondary",
          parentId: 120,
        }),
      ],
    }),
  ],
});

const resourcesNavigation = createNavigationItem(
  200,
  "Resources",
  routes.resources,
  4,
  {
    children: [
      createNavigationItem(210, "Guides", routes.resources, 1, {
        kind: "group",
        parentId: 200,
        children: [
          createNavigationItem(211, "Blog", routes.resources, 1, {
            kind: "secondary",
            parentId: 210,
          }),
          createNavigationItem(212, "FAQ", routes.faq, 2, {
            kind: "secondary",
            parentId: 210,
          }),
          createNavigationItem(213, "Support", routes.support, 3, {
            kind: "secondary",
            parentId: 210,
          }),
        ],
      }),
    ],
  }
);

export const fallbackBrand: BrandAssets = {
  name: "Exxonim",
  lightLogoSrc: "/exxonim-logo.webp",
  darkLogoSrc: "/assets/logo-dark.png",
};

export const fallbackCompanyInfo: CompanyInfo = {
  name: "Exxonim",
  phones: [],
  emails: [],
  address: "Tanzania",
  whatsapp: "",
};

export const fallbackNavigationItems: NavigationItem[] = [
  createNavigationItem(1, "About", routes.about, 1),
  createNavigationItem(2, "FAQ", routes.faq, 2),
  servicesNavigation,
  resourcesNavigation,
  createNavigationItem(5, "Career", routes.career, 5),
  createNavigationItem(6, "Contact", routes.contact, 6),
];

export const fallbackFooter: SiteSettingFooterValue = {
  quick_links: [
    { label: "About", href: routes.about },
    { label: "Services", href: routes.services },
    { label: "Resources", href: routes.resources },
    { label: "Career", href: routes.career },
    { label: "Contact", href: routes.contact },
  ],
  other_resources: [
    { label: "FAQ", href: routes.faq },
    { label: "Support", href: routes.support },
    { label: "Terms", href: routes.terms },
    { label: "Privacy", href: routes.privacy },
  ],
  tagline:
    "Registration, licensing, and practical compliance support for businesses, NGOs, and institutions.",
  primary_cta: {
    label: "Contact Exxonim",
    href: routes.contact,
  },
  social_links: [],
  copyright:
    "Exxonim. Core site navigation and contact fallback are available while live content reconnects.",
};
