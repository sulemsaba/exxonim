import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getBrandSetting,
  getCompanyInfoSetting,
  upsertBrandSetting,
  upsertCompanyInfoSetting,
} from "../../services/adminStructuredSettingsService";
import { getAdminErrorMessage } from "../../utils/admin";

export function BrandSettingsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [values, setValues] = useState({
    name: "",
    companyShortName: "",
    legalCompanyName: "",
    tagline: "",
    lightLogoSrc: "",
    darkLogoSrc: "",
    faviconUrl: "",
    brandPrimary: "#3a6600",
    brandSecondary: "#0d8a64",
  });

  const brandQuery = useQuery({
    queryKey: ["admin", "site-settings", "brand"],
    queryFn: getBrandSetting,
  });
  const companyQuery = useQuery({
    queryKey: ["admin", "site-settings", "company_info"],
    queryFn: getCompanyInfoSetting,
  });

  useEffect(() => {
    if (!brandQuery.data && !companyQuery.data) {
      return;
    }

    setValues({
      name: companyQuery.data?.value.name ?? brandQuery.data?.value.name ?? "",
      companyShortName:
        companyQuery.data?.value.companyShortName ??
        brandQuery.data?.value.companyShortName ??
        "",
      legalCompanyName: companyQuery.data?.value.legalCompanyName ?? "",
      tagline: brandQuery.data?.value.tagline ?? "",
      lightLogoSrc: brandQuery.data?.value.lightLogoSrc ?? "",
      darkLogoSrc: brandQuery.data?.value.darkLogoSrc ?? "",
      faviconUrl: brandQuery.data?.value.faviconUrl ?? "",
      brandPrimary: brandQuery.data?.value.brandColors.primary ?? "#3a6600",
      brandSecondary: brandQuery.data?.value.brandColors.secondary ?? "#0d8a64",
    });
  }, [brandQuery.data, companyQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        upsertBrandSetting({
          name: values.name,
          companyShortName: values.companyShortName,
          tagline: values.tagline,
          lightLogoSrc: values.lightLogoSrc,
          darkLogoSrc: values.darkLogoSrc,
          faviconUrl: values.faviconUrl || null,
          brandColors: {
            primary: values.brandPrimary,
            secondary: values.brandSecondary,
          },
        }),
        upsertCompanyInfoSetting({
          name: values.name,
          legalCompanyName: values.legalCompanyName,
          companyShortName: values.companyShortName,
          phones: companyQuery.data?.value.phones ?? [],
          emails: companyQuery.data?.value.emails ?? [],
          address: companyQuery.data?.value.address ?? "",
          whatsapp: companyQuery.data?.value.whatsapp ?? "",
        }),
      ]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "brand"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "company_info"] });
      setMessage({ tone: "success", text: "Brand and company settings updated." });
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to save brand settings.") });
    },
  });

  if (brandQuery.isPending || companyQuery.isPending) {
    return <LoadingSpinner label="Loading brand settings..." />;
  }

  if (brandQuery.error || companyQuery.error) {
    return (
      <ErrorMessage
        title="Unable to load brand settings."
        detail="Check that the site settings endpoint is available."
      />
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>Brand & Company</h2>
          <p>Visual identity and company identity are grouped in one workspace.</p>
        </div>
      </div>
      <div className="admin-card__body">
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(null);
            saveMutation.mutate();
          }}
        >
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label htmlFor="brand-name">Display Name</label>
              <input
                id="brand-name"
                type="text"
                value={values.name}
                onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-short-name">Company Short Name</label>
              <input
                id="brand-short-name"
                type="text"
                value={values.companyShortName}
                onChange={(event) =>
                  setValues((current) => ({ ...current, companyShortName: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="brand-legal-name">Legal Company Name</label>
              <input
                id="brand-legal-name"
                type="text"
                value={values.legalCompanyName}
                onChange={(event) =>
                  setValues((current) => ({ ...current, legalCompanyName: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="brand-tagline">Tagline</label>
              <textarea
                id="brand-tagline"
                rows={4}
                value={values.tagline}
                onChange={(event) => setValues((current) => ({ ...current, tagline: event.target.value }))}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-light-logo">Light Logo URL</label>
              <input
                id="brand-light-logo"
                type="text"
                value={values.lightLogoSrc}
                onChange={(event) =>
                  setValues((current) => ({ ...current, lightLogoSrc: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-dark-logo">Dark Logo URL</label>
              <input
                id="brand-dark-logo"
                type="text"
                value={values.darkLogoSrc}
                onChange={(event) =>
                  setValues((current) => ({ ...current, darkLogoSrc: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-favicon">Favicon URL</label>
              <input
                id="brand-favicon"
                type="text"
                value={values.faviconUrl}
                onChange={(event) =>
                  setValues((current) => ({ ...current, faviconUrl: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-primary">Primary Brand Color</label>
              <input
                id="brand-primary"
                type="text"
                value={values.brandPrimary}
                onChange={(event) =>
                  setValues((current) => ({ ...current, brandPrimary: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="brand-secondary">Secondary Brand Color</label>
              <input
                id="brand-secondary"
                type="text"
                value={values.brandSecondary}
                onChange={(event) =>
                  setValues((current) => ({ ...current, brandSecondary: event.target.value }))
                }
              />
            </div>
          </div>

          {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

          <div className="admin-form__actions">
            <button className="admin-form__submit" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Brand Settings"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
