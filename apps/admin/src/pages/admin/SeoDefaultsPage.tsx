import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getSeoDefaultsSetting,
  upsertSeoDefaultsSetting,
} from "../../services/adminStructuredSettingsService";
import { getAdminErrorMessage } from "../../utils/admin";

export function SeoDefaultsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [values, setValues] = useState({
    siteName: "",
    canonicalBaseUrl: "",
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultShareImageUrl: "",
    robotsIndex: true,
    robotsFollow: true,
  });

  const seoQuery = useQuery({
    queryKey: ["admin", "site-settings", "seo_defaults"],
    queryFn: getSeoDefaultsSetting,
  });

  useEffect(() => {
    if (!seoQuery.data?.value) {
      return;
    }

    setValues({
      siteName: seoQuery.data.value.siteName,
      canonicalBaseUrl: seoQuery.data.value.canonicalBaseUrl,
      defaultMetaTitle: seoQuery.data.value.defaultMetaTitle ?? "",
      defaultMetaDescription: seoQuery.data.value.defaultMetaDescription ?? "",
      defaultShareImageUrl: seoQuery.data.value.defaultShareImageUrl ?? "",
      robotsIndex: seoQuery.data.value.robotsIndex,
      robotsFollow: seoQuery.data.value.robotsFollow,
    });
  }, [seoQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertSeoDefaultsSetting({
        siteName: values.siteName,
        canonicalBaseUrl: values.canonicalBaseUrl,
        defaultMetaTitle: values.defaultMetaTitle || null,
        defaultMetaDescription: values.defaultMetaDescription || null,
        defaultShareImageUrl: values.defaultShareImageUrl || null,
        robotsIndex: values.robotsIndex,
        robotsFollow: values.robotsFollow,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "seo_defaults"] });
      setMessage({ tone: "success", text: "SEO defaults updated." });
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to save SEO defaults.") });
    },
  });

  if (seoQuery.isPending) {
    return <LoadingSpinner label="Loading SEO defaults..." />;
  }

  if (seoQuery.error) {
    return (
      <ErrorMessage
        title="Unable to load SEO defaults."
        detail="SEO defaults could not be loaded right now."
      />
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>SEO Defaults</h2>
          <p>These values are used only when a page or post does not supply its own metadata.</p>
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
              <label htmlFor="seo-site-name">Site Name</label>
              <input
                id="seo-site-name"
                type="text"
                value={values.siteName}
                onChange={(event) => setValues((current) => ({ ...current, siteName: event.target.value }))}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="seo-canonical-base">Canonical Base URL</label>
              <input
                id="seo-canonical-base"
                type="text"
                value={values.canonicalBaseUrl}
                onChange={(event) =>
                  setValues((current) => ({ ...current, canonicalBaseUrl: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="seo-default-title">Default Meta Title</label>
              <input
                id="seo-default-title"
                type="text"
                value={values.defaultMetaTitle}
                onChange={(event) =>
                  setValues((current) => ({ ...current, defaultMetaTitle: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="seo-default-description">Default Meta Description</label>
              <textarea
                id="seo-default-description"
                rows={4}
                value={values.defaultMetaDescription}
                onChange={(event) =>
                  setValues((current) => ({ ...current, defaultMetaDescription: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="seo-default-share">Default Share Image URL</label>
              <input
                id="seo-default-share"
                type="text"
                value={values.defaultShareImageUrl}
                onChange={(event) =>
                  setValues((current) => ({ ...current, defaultShareImageUrl: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="seo-robots-index">Robots Index</label>
              <select
                id="seo-robots-index"
                value={values.robotsIndex ? "true" : "false"}
                onChange={(event) =>
                  setValues((current) => ({ ...current, robotsIndex: event.target.value === "true" }))
                }
              >
                <option value="true">Index</option>
                <option value="false">No Index</option>
              </select>
            </div>
            <div className="admin-form__field">
              <label htmlFor="seo-robots-follow">Robots Follow</label>
              <select
                id="seo-robots-follow"
                value={values.robotsFollow ? "true" : "false"}
                onChange={(event) =>
                  setValues((current) => ({ ...current, robotsFollow: event.target.value === "true" }))
                }
              >
                <option value="true">Follow</option>
                <option value="false">No Follow</option>
              </select>
            </div>
          </div>

          {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

          <div className="admin-form__actions">
            <button className="admin-form__submit" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save SEO Defaults"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
