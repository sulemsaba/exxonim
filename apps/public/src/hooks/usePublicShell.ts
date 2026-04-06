import { useQuery } from "@tanstack/react-query";
import {
  getCachedSiteSettingResource,
  getSiteSettingResource,
} from "../services/siteSettingsService";
import {
  getCachedNavigationResource,
  getNavigationResource,
} from "../services/navigationService";
import type { PublicContentSource } from "@exxonim/shared/publicContentCache";
import type { SiteSettingFooterValue } from "../types/api";
import type { BrandAssets, CompanyInfo, NavigationItem, SiteSetting } from "../types";
import {
  fallbackBrand,
  fallbackCompanyInfo,
  fallbackFooter,
  fallbackNavigationItems,
} from "../content/fallbackShell";

interface PublicShellData {
  brand: BrandAssets;
  company: CompanyInfo;
  footer: SiteSettingFooterValue;
  navigationItems: NavigationItem[];
  isDegraded: boolean;
  isUsingFallback: boolean;
  shellSource: PublicContentSource;
  missingModules: string[];
}

function hasSiteSettingValue<TValue>(
  setting: SiteSetting<TValue> | undefined
): setting is SiteSetting<TValue> {
  return Boolean(setting?.value);
}

export function usePublicShell(): PublicShellData {
  const navigationQuery = useQuery({
    queryKey: ["public-shell", "navigation"],
    queryFn: getNavigationResource,
    initialData: getCachedNavigationResource,
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const brandQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "brand"],
    queryFn: () => getSiteSettingResource<BrandAssets>("brand"),
    initialData: () => getCachedSiteSettingResource<BrandAssets>("brand"),
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const footerQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "footer"],
    queryFn: () => getSiteSettingResource<SiteSettingFooterValue>("footer"),
    initialData: () => getCachedSiteSettingResource<SiteSettingFooterValue>("footer"),
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const companyQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "company_info"],
    queryFn: () => getSiteSettingResource<CompanyInfo>("company_info"),
    initialData: () => getCachedSiteSettingResource<CompanyInfo>("company_info"),
    retry: false,
    staleTime: 1000 * 60 * 60,
  });

  const brand = hasSiteSettingValue(brandQuery.data?.data)
    ? brandQuery.data.data.value
    : fallbackBrand;
  const footer = hasSiteSettingValue(footerQuery.data?.data)
    ? footerQuery.data.data.value
    : fallbackFooter;
  const company = hasSiteSettingValue(companyQuery.data?.data)
    ? companyQuery.data.data.value
    : fallbackCompanyInfo;
  const navigationItems =
    navigationQuery.data?.data && navigationQuery.data.data.length > 0
      ? navigationQuery.data.data
      : fallbackNavigationItems;

  const missingModules = [
    !hasSiteSettingValue(brandQuery.data?.data) ? "brand" : null,
    !hasSiteSettingValue(footerQuery.data?.data) ? "footer" : null,
    !hasSiteSettingValue(companyQuery.data?.data) ? "company" : null,
    !navigationQuery.data?.data?.length ? "navigation" : null,
  ].filter((value): value is string => Boolean(value));

  const isUsingFallback =
    brandQuery.data?.source === "fallback" ||
    footerQuery.data?.source === "fallback" ||
    companyQuery.data?.source === "fallback" ||
    navigationQuery.data?.source === "fallback" ||
    brand === fallbackBrand ||
    footer === fallbackFooter ||
    company === fallbackCompanyInfo ||
    navigationItems === fallbackNavigationItems;

  const hasShellCache =
    navigationQuery.data?.source === "cache" ||
    brandQuery.data?.source === "cache" ||
    footerQuery.data?.source === "cache" ||
    companyQuery.data?.source === "cache";

  const hasShellFallback = isUsingFallback;
  const hasShellError = Boolean(
    navigationQuery.data?.error ||
      brandQuery.data?.error ||
      footerQuery.data?.error ||
      companyQuery.data?.error
  );
  const shellSource: PublicContentSource = hasShellFallback
    ? "fallback"
    : hasShellCache || hasShellError
      ? "cache"
      : "live";

  return {
    brand,
    footer,
    company,
    navigationItems,
    isDegraded: shellSource !== "live" || missingModules.length > 0 || hasShellError,
    isUsingFallback,
    shellSource,
    missingModules,
  };
}
