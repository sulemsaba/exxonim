export interface ApiSiteSetting<TValue = unknown> {
  id: number;
  key: string;
  value: TValue;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingBrandValue {
  name: string;
  companyShortName: string;
  tagline: string;
  lightLogoSrc: string;
  darkLogoSrc: string;
  faviconUrl?: string | null;
  brandColors: {
    primary: string;
    secondary: string;
  };
}

export interface SiteSettingCompanyInfoValue {
  name: string;
  legalCompanyName: string;
  companyShortName: string;
  phones: string[];
  emails: string[];
  address: string;
  whatsapp: string;
}

export interface SiteSettingOfficeHourValue {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  open: string;
  close: string;
  closed: boolean;
}

export interface SiteSettingSocialLinkValue {
  platform: "facebook" | "instagram" | "linkedin" | "x" | "youtube" | "tiktok";
  label: string;
  url: string;
  isActive: boolean;
}

export interface SiteSettingOfficeValue {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country: string;
  mapLabel: string;
  googleMapsUrl: string;
  embedUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isPrimary: boolean;
}

export interface SiteSettingContactMapValue {
  officeHours: SiteSettingOfficeHourValue[];
  socialLinks: SiteSettingSocialLinkValue[];
  offices: SiteSettingOfficeValue[];
}

export interface SiteSettingFooterValue {
  quick_links: Array<{ label: string; href: string }>;
  other_resources: Array<{ label: string; href: string }>;
  tagline: string;
  primary_cta: { label: string; href: string };
  social_links?: SiteSettingSocialLinkValue[];
  copyright: string;
}

export interface SiteSettingSeoDefaultsValue {
  siteName: string;
  canonicalBaseUrl: string;
  defaultMetaTitle?: string | null;
  defaultMetaDescription?: string | null;
  defaultShareImageUrl?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface SiteSettingPolicyVersionsValue {
  privacy_policy: string;
  cookie_notice: string;
  data_rights_notice: string;
}
