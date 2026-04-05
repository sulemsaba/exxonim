import { useQuery } from "@tanstack/react-query";
import {
  getCachedSiteSetting,
  getSiteSetting,
} from "../services/siteSettingsService";
import { getCachedNavigation, getNavigation } from "../services/navigationService";
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
}

function hasSiteSettingValue<TValue>(
  setting: SiteSetting<TValue> | undefined
): setting is SiteSetting<TValue> {
  return Boolean(setting?.value);
}

export function usePublicShell(): PublicShellData {
  const navigationQuery = useQuery({
    queryKey: ["navigation"],
    queryFn: getNavigation,
    initialData: getCachedNavigation,
    retry: false,
  });
  const brandQuery = useQuery({
    queryKey: ["site-settings", "brand"],
    queryFn: () => getSiteSetting<BrandAssets>("brand"),
    initialData: () => getCachedSiteSetting<BrandAssets>("brand"),
    retry: false,
  });
  const footerQuery = useQuery({
    queryKey: ["site-settings", "footer"],
    queryFn: () => getSiteSetting<SiteSettingFooterValue>("footer"),
    initialData: () => getCachedSiteSetting<SiteSettingFooterValue>("footer"),
    retry: false,
  });
  const companyQuery = useQuery({
    queryKey: ["site-settings", "company_info"],
    queryFn: () => getSiteSetting<CompanyInfo>("company_info"),
    initialData: () => getCachedSiteSetting<CompanyInfo>("company_info"),
    retry: false,
  });

  const brand = hasSiteSettingValue(brandQuery.data)
    ? brandQuery.data.value
    : fallbackBrand;
  const footer = hasSiteSettingValue(footerQuery.data)
    ? footerQuery.data.value
    : fallbackFooter;
  const company = hasSiteSettingValue(companyQuery.data)
    ? companyQuery.data.value
    : fallbackCompanyInfo;
  const navigationItems =
    navigationQuery.data && navigationQuery.data.length > 0
      ? navigationQuery.data
      : fallbackNavigationItems;

  const hasMissingShellData =
    (!brandQuery.isPending && !hasSiteSettingValue(brandQuery.data)) ||
    (!footerQuery.isPending && !hasSiteSettingValue(footerQuery.data)) ||
    (!companyQuery.isPending && !hasSiteSettingValue(companyQuery.data)) ||
    (!navigationQuery.isPending &&
      (!navigationQuery.data || navigationQuery.data.length === 0));

  const hasShellError = Boolean(
    navigationQuery.error ||
      brandQuery.error ||
      footerQuery.error ||
      companyQuery.error
  );

  const isUsingFallback =
    brand === fallbackBrand ||
    footer === fallbackFooter ||
    company === fallbackCompanyInfo ||
    navigationItems === fallbackNavigationItems;

  return {
    brand,
    footer,
    company,
    navigationItems,
    isDegraded: isUsingFallback || hasShellError || hasMissingShellData,
    isUsingFallback,
  };
}
