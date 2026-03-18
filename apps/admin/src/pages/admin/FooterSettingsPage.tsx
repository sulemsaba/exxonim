import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getFooterSetting,
  upsertFooterSetting,
} from "../../services/adminStructuredSettingsService";
import { getAdminErrorMessage } from "../../utils/admin";

function stringifyLinks(value: Array<{ label: string; href: string }>) {
  return value.map((item) => `${item.label} | ${item.href}`).join("\n");
}

function parseLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((part) => part.trim());
      return {
        label: label ?? "",
        href: href ?? "",
      };
    })
    .filter((item) => item.label && item.href);
}

export function FooterSettingsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [values, setValues] = useState({
    tagline: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    quickLinks: "",
    otherResources: "",
    copyright: "",
  });

  const footerQuery = useQuery({
    queryKey: ["admin", "site-settings", "footer"],
    queryFn: getFooterSetting,
  });

  useEffect(() => {
    if (!footerQuery.data?.value) {
      return;
    }

    setValues({
      tagline: footerQuery.data.value.tagline,
      primaryCtaLabel: footerQuery.data.value.primary_cta.label,
      primaryCtaHref: footerQuery.data.value.primary_cta.href,
      quickLinks: stringifyLinks(footerQuery.data.value.quick_links),
      otherResources: stringifyLinks(footerQuery.data.value.other_resources),
      copyright: footerQuery.data.value.copyright,
    });
  }, [footerQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertFooterSetting({
        tagline: values.tagline,
        primary_cta: {
          label: values.primaryCtaLabel,
          href: values.primaryCtaHref,
        },
        quick_links: parseLinks(values.quickLinks),
        other_resources: parseLinks(values.otherResources),
        copyright: values.copyright,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "footer"] });
      setMessage({ tone: "success", text: "Footer content updated." });
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to save footer content.") });
    },
  });

  if (footerQuery.isPending) {
    return <LoadingSpinner label="Loading footer content..." />;
  }

  if (footerQuery.error) {
    return (
      <ErrorMessage
        title="Unable to load footer content."
        detail="Check that the site settings endpoint is available."
      />
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>Footer Content</h2>
          <p>Keep the public footer shape intact while editing it from a structured screen.</p>
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
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="footer-tagline">Tagline</label>
              <textarea
                id="footer-tagline"
                rows={4}
                value={values.tagline}
                onChange={(event) => setValues((current) => ({ ...current, tagline: event.target.value }))}
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="footer-cta-label">Primary CTA Label</label>
              <input
                id="footer-cta-label"
                type="text"
                value={values.primaryCtaLabel}
                onChange={(event) =>
                  setValues((current) => ({ ...current, primaryCtaLabel: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field">
              <label htmlFor="footer-cta-href">Primary CTA Link</label>
              <input
                id="footer-cta-href"
                type="text"
                value={values.primaryCtaHref}
                onChange={(event) =>
                  setValues((current) => ({ ...current, primaryCtaHref: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="footer-quick-links">Quick Links</label>
              <textarea
                id="footer-quick-links"
                rows={6}
                value={values.quickLinks}
                onChange={(event) => setValues((current) => ({ ...current, quickLinks: event.target.value }))}
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="footer-resources">Other Resources</label>
              <textarea
                id="footer-resources"
                rows={6}
                value={values.otherResources}
                onChange={(event) =>
                  setValues((current) => ({ ...current, otherResources: event.target.value }))
                }
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="footer-copyright">Copyright</label>
              <input
                id="footer-copyright"
                type="text"
                value={values.copyright}
                onChange={(event) =>
                  setValues((current) => ({ ...current, copyright: event.target.value }))
                }
              />
            </div>
          </div>

          {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

          <div className="admin-form__actions">
            <button className="admin-form__submit" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Footer Content"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
