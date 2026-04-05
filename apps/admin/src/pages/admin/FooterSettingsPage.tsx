import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getFooterSetting,
  upsertFooterSetting,
} from "../../services/adminStructuredSettingsService";
import type { SiteSettingSocialLinkValue } from "../../types/api";
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

function createFooterSocialLink(
  platform: SiteSettingSocialLinkValue["platform"]
): SiteSettingSocialLinkValue {
  return {
    platform,
    label: "",
    url: "",
    isActive: true,
  };
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
    socialLinks: [
      createFooterSocialLink("linkedin"),
      createFooterSocialLink("instagram"),
      createFooterSocialLink("x"),
    ] as SiteSettingSocialLinkValue[],
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
      socialLinks:
        footerQuery.data.value.social_links?.length
          ? footerQuery.data.value.social_links
          : [
              createFooterSocialLink("linkedin"),
              createFooterSocialLink("instagram"),
              createFooterSocialLink("x"),
            ],
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
        social_links: values.socialLinks
          .filter((item) => item.url.trim())
          .map((item) => ({
            ...item,
            label: item.label.trim(),
            url: item.url.trim(),
          })),
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
        detail="Footer settings could not be loaded right now."
      />
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>Footer Content</h2>
          <p>Edit the content visitors see in the footer, including the main call to action, support links, and legal copy.</p>
          <p style={{ marginTop: ".5rem" }}>
            Social accounts shown under the footer CTA are managed here and use the account name you enter.
          </p>
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
              <label>Footer Social Accounts</label>
              <div className="admin-list-grid">
                {values.socialLinks.map((link, index) => (
                  <article key={`${link.platform}-${index}`} className="admin-tree__item">
                    <div className="admin-toolbar">
                      <strong>
                        {link.platform === "linkedin"
                          ? "LinkedIn"
                          : link.platform === "instagram"
                            ? "Instagram"
                            : "X"}
                      </strong>
                    </div>
                    <div className="admin-form__grid">
                      <div className="admin-form__field">
                        <label>Account Name / Handle</label>
                        <input
                          type="text"
                          placeholder="@exxonim or Exxonim Tanzania"
                          value={link.label}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              socialLinks: current.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item
                              ),
                            }))
                          }
                        />
                        <small style={{ color: "var(--admin-text-soft)" }}>
                          This text is shown next to the icon in the public footer.
                        </small>
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>Profile URL</label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/company/exxonim"
                          value={link.url}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              socialLinks: current.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, url: event.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
