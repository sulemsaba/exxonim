import type {
  ApiSiteSetting,
  SiteSettingBrandValue,
  SiteSettingCompanyInfoValue,
  SiteSettingContactMapValue,
  SiteSettingFooterValue,
  SiteSettingSeoDefaultsValue,
} from "../types/api";
import {
  createAdminSiteSetting,
  listAdminSiteSettings,
  updateAdminSiteSettingByKey,
} from "./adminSiteSettingsService";

type StructuredSettingValue =
  | SiteSettingBrandValue
  | SiteSettingCompanyInfoValue
  | SiteSettingContactMapValue
  | SiteSettingFooterValue
  | SiteSettingSeoDefaultsValue;

async function findSetting<TValue = StructuredSettingValue>(key: string) {
  const settings = await listAdminSiteSettings();
  return (settings.find((setting) => setting.key === key) as ApiSiteSetting<TValue> | undefined) ?? null;
}

async function upsertSetting<TValue extends StructuredSettingValue>(key: string, value: TValue) {
  const existing = await findSetting<TValue>(key);

  if (existing) {
    return updateAdminSiteSettingByKey(existing.key, { key, value });
  }

  return createAdminSiteSetting({ key, value });
}

export function getBrandSetting() {
  return findSetting<SiteSettingBrandValue>("brand");
}

export function upsertBrandSetting(value: SiteSettingBrandValue) {
  return upsertSetting("brand", value);
}

export function getCompanyInfoSetting() {
  return findSetting<SiteSettingCompanyInfoValue>("company_info");
}

export function upsertCompanyInfoSetting(value: SiteSettingCompanyInfoValue) {
  return upsertSetting("company_info", value);
}

export function getContactMapSetting() {
  return findSetting<SiteSettingContactMapValue>("contact_map");
}

export function upsertContactMapSetting(value: SiteSettingContactMapValue) {
  return upsertSetting("contact_map", value);
}

export function getFooterSetting() {
  return findSetting<SiteSettingFooterValue>("footer");
}

export function upsertFooterSetting(value: SiteSettingFooterValue) {
  return upsertSetting("footer", value);
}

export function getSeoDefaultsSetting() {
  return findSetting<SiteSettingSeoDefaultsValue>("seo_defaults");
}

export function upsertSeoDefaultsSetting(value: SiteSettingSeoDefaultsValue) {
  return upsertSetting("seo_defaults", value);
}
