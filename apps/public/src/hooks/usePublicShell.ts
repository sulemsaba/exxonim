import { useQuery } from "@tanstack/react-query";
import {
  getCachedSiteSettingResource,
  getSiteSettingResource,
} from "../services/siteSettingsService";
import {
  getCachedNavigationResource,
  getNavigationResource,
} from "../services/navigationService";
import type { SiteSettingFooterValue } from "../types/api";
import type { BrandAssets, CompanyInfo, NavigationItem, SiteSetting } from "../types";
import {
  fallbackBrand as defaultBrand,
  fallbackCompanyInfo as defaultCompanyInfo,
  fallbackFooter as defaultFooter,
  fallbackNavigationItems as defaultNavigationItems,
} from "../content/fallbackShell";

interface PublicShellData {
  brand: BrandAssets;
  company: CompanyInfo;
  footer: SiteSettingFooterValue;
  navigationItems: NavigationItem[];
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
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const brandQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "brand"],
    queryFn: () => getSiteSettingResource<BrandAssets>("brand"),
    initialData: () => getCachedSiteSettingResource<BrandAssets>("brand"),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const footerQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "footer"],
    queryFn: () => getSiteSettingResource<SiteSettingFooterValue>("footer"),
    initialData: () => getCachedSiteSettingResource<SiteSettingFooterValue>("footer"),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
  const companyQuery = useQuery({
    queryKey: ["public-shell", "site-settings", "company_info"],
    queryFn: () => getSiteSettingResource<CompanyInfo>("company_info"),
    initialData: () => getCachedSiteSettingResource<CompanyInfo>("company_info"),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: false,
    staleTime: 1000 * 60 * 60,
  });

  const brand = hasSiteSettingValue(brandQuery.data?.data)
    ? brandQuery.data.data.value
    : defaultBrand;
  const footer = hasSiteSettingValue(footerQuery.data?.data)
    ? footerQuery.data.data.value
    : defaultFooter;
  const company = hasSiteSettingValue(companyQuery.data?.data)
    ? companyQuery.data.data.value
    : defaultCompanyInfo;
  const navigationItems =
    navigationQuery.data?.data && navigationQuery.data.data.length > 0
      ? navigationQuery.data.data
      : defaultNavigationItems;

  return {
    brand,
    footer,
    company,
    navigationItems,
  };
}
