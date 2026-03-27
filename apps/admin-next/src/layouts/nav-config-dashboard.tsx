import type { ReactNode } from 'react';

import {
  adminNavItems,
  type AdminSection,
  type AdminNavItem,
  isAdminSectionRestrictedForRole,
} from '@exxonim/admin-core/lib/adminRoutes';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const iconMap: Record<AdminNavItem['icon'], string> = {
  dashboard: 'solar:widget-5-bold',
  posts: 'solar:document-text-bold',
  analytics: 'solar:chart-square-bold',
  categories: 'solar:tag-bold',
  authors: 'solar:users-group-rounded-bold',
  page: 'solar:document-bold',
  services: 'solar:shield-check-bold',
  about: 'solar:buildings-3-bold',
  faq: 'solar:question-circle-bold',
  contact: 'solar:phone-calling-rounded-bold',
  careers: 'solar:case-round-bold',
  'all-pages': 'solar:documents-bold',
  jobs: 'solar:case-bold',
  brand: 'solar:palette-round-bold',
  map: 'solar:map-point-bold',
  navigation: 'solar:hamburger-menu-bold',
  pricing: 'solar:wallet-money-bold',
  testimonials: 'solar:chat-round-dots-bold',
  footer: 'solar:text-field-focus-bold',
  seo: 'solar:magnifer-zoom-in-bold',
  roles: 'solar:shield-user-bold',
};

const navBlueprint: Array<{
  subheader: string;
  items: Array<
    | AdminSection
    | {
        section: AdminSection;
        description?: string;
        children: AdminSection[];
      }
  >;
}> = [
  {
    subheader: 'Overview',
    items: ['dashboard'],
  },
  {
    subheader: 'Editorial',
    items: ['blog-posts', 'blog-analytics', 'blog-categories', 'blog-authors'],
  },
  {
    subheader: 'Site Experience',
    items: [
      {
        section: 'pages',
        description: 'Index plus shortcuts for the main Exxonim public pages.',
        children: ['page-home', 'page-services', 'page-about', 'page-faq', 'page-contact', 'page-careers'],
      },
      'jobs',
      'navigation',
      'pricing',
      'testimonials',
    ],
  },
  {
    subheader: 'Brand & Settings',
    items: ['brand-settings', 'contact-settings', 'footer-settings', 'seo-settings'],
  },
  {
    subheader: 'Access',
    items: ['access-roles'],
  },
];

function icon(name: AdminNavItem['icon']) {
  return <Iconify width={24} icon={iconMap[name]} />;
}

function getMatchPrefixes(item: Pick<AdminNavItem, 'section' | 'href'>) {
  switch (item.section) {
    case 'blog-posts':
    case 'blog-analytics':
    case 'blog-categories':
    case 'blog-authors':
    case 'pages':
    case 'jobs':
      return [item.href.replace(/\/$/, '')];
    case 'brand-settings':
      return ['/admin/settings/brand', '/admin/site-settings'];
    case 'contact-settings':
      return ['/admin/settings/contact'];
    case 'footer-settings':
      return ['/admin/settings/footer'];
    case 'seo-settings':
      return ['/admin/settings/seo'];
    default:
      return [item.href.replace(/\/$/, '')];
  }
}

function baseItem(item: AdminNavItem) {
  return {
    title: item.label,
    path: item.href,
    description: item.description,
    icon: icon(item.icon),
    matchPrefixes: getMatchPrefixes(item),
  };
}

export type NavChildItem = {
  title: string;
  path: string;
  matchPrefixes?: string[];
};

export type NavItem = {
  title: string;
  path: string;
  description: string;
  icon: ReactNode;
  matchPrefixes?: string[];
  info?: ReactNode;
  children?: NavChildItem[];
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

export function getNavData(role?: string | null): NavGroup[] {
  const itemsBySection = new Map(adminNavItems.map((item) => [item.section, item] as const));

  return navBlueprint
    .map((group) => {
      const items = group.items.flatMap((entry) => {
        if (typeof entry === 'string') {
          const item = itemsBySection.get(entry);

          if (!item || isAdminSectionRestrictedForRole(role, item.section)) {
            return [];
          }

          return [baseItem(item)];
        }

        const parent = itemsBySection.get(entry.section);

        if (!parent || isAdminSectionRestrictedForRole(role, parent.section)) {
          return [];
        }

        const children = entry.children.flatMap((section) => {
          const child = itemsBySection.get(section);

          if (!child || isAdminSectionRestrictedForRole(role, child.section)) {
            return [];
          }

          return [
            {
              title: child.label,
              path: child.href,
              matchPrefixes: getMatchPrefixes(child),
            },
          ];
        });

        return [
          {
            ...baseItem(parent),
            description: entry.description ?? parent.description,
            children,
          },
        ];
      });

      return { subheader: group.subheader, items };
    })
    .filter((group) => group.items.length > 0);
}
