import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getCompanyInfoSetting,
  getContactMapSetting,
  upsertCompanyInfoSetting,
  upsertContactMapSetting,
} from "../../services/adminStructuredSettingsService";
import type {
  SiteSettingContactMapValue,
  SiteSettingOfficeHourValue,
  SiteSettingOfficeValue,
  SiteSettingSocialLinkValue,
} from "../../types/api";
import { getAdminErrorMessage } from "../../utils/admin";

const dayOrder: SiteSettingOfficeHourValue["day"][] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function defaultOfficeHours(): SiteSettingOfficeHourValue[] {
  return dayOrder.map((day) => ({
    day,
    open: "08:00",
    close: "17:00",
    closed: day === "saturday" || day === "sunday",
  }));
}

function createOffice(index: number): SiteSettingOfficeValue {
  return {
    id: `office-${Date.now()}-${index}`,
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "Tanzania",
    mapLabel: "",
    googleMapsUrl: "",
    embedUrl: "",
    latitude: null,
    longitude: null,
    isPrimary: index === 0,
  };
}

function createSocialLink(): SiteSettingSocialLinkValue {
  return {
    platform: "linkedin",
    label: "",
    url: "",
    isActive: true,
  };
}

export function ContactMapSettingsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [phonesText, setPhonesText] = useState("");
  const [emailsText, setEmailsText] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [officeHours, setOfficeHours] = useState<SiteSettingOfficeHourValue[]>(defaultOfficeHours());
  const [offices, setOffices] = useState<SiteSettingOfficeValue[]>([createOffice(0)]);
  const [socialLinks, setSocialLinks] = useState<SiteSettingSocialLinkValue[]>([createSocialLink()]);

  const companyQuery = useQuery({
    queryKey: ["admin", "site-settings", "company_info"],
    queryFn: getCompanyInfoSetting,
  });
  const contactMapQuery = useQuery({
    queryKey: ["admin", "site-settings", "contact_map"],
    queryFn: getContactMapSetting,
  });

  useEffect(() => {
    if (companyQuery.data?.value) {
      setPhonesText(companyQuery.data.value.phones.join("\n"));
      setEmailsText(companyQuery.data.value.emails.join("\n"));
      setAddress(companyQuery.data.value.address);
      setWhatsapp(companyQuery.data.value.whatsapp);
    }
  }, [companyQuery.data]);

  useEffect(() => {
    if (contactMapQuery.data?.value) {
      setOfficeHours(contactMapQuery.data.value.officeHours.length ? contactMapQuery.data.value.officeHours : defaultOfficeHours());
      setOffices(contactMapQuery.data.value.offices.length ? contactMapQuery.data.value.offices : [createOffice(0)]);
      setSocialLinks(
        contactMapQuery.data.value.socialLinks.length
          ? contactMapQuery.data.value.socialLinks
          : [createSocialLink()]
      );
    }
  }, [contactMapQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        upsertCompanyInfoSetting({
          name: companyQuery.data?.value.name ?? "",
          legalCompanyName: companyQuery.data?.value.legalCompanyName ?? "",
          companyShortName: companyQuery.data?.value.companyShortName ?? "",
          phones: phonesText.split("\n").map((item) => item.trim()).filter(Boolean),
          emails: emailsText.split("\n").map((item) => item.trim()).filter(Boolean),
          address,
          whatsapp,
        }),
        upsertContactMapSetting({
          officeHours,
          offices,
          socialLinks,
        } satisfies SiteSettingContactMapValue),
      ]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "company_info"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", "contact_map"] });
      setMessage({ tone: "success", text: "Contact and map settings updated." });
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to save contact settings.") });
    },
  });

  if (companyQuery.isPending || contactMapQuery.isPending) {
    return <LoadingSpinner label="Loading contact settings..." />;
  }

  if (companyQuery.error || contactMapQuery.error) {
    return (
      <ErrorMessage
        title="Unable to load contact settings."
        detail="Check that the site settings endpoint is available."
      />
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h2>Contact & Map</h2>
          <p>Global phones, emails, WhatsApp, office hours, offices, and social links.</p>
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
              <label htmlFor="contact-phones">Phone Numbers</label>
              <textarea
                id="contact-phones"
                rows={4}
                value={phonesText}
                onChange={(event) => setPhonesText(event.target.value)}
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="contact-emails">Email Addresses</label>
              <textarea
                id="contact-emails"
                rows={4}
                value={emailsText}
                onChange={(event) => setEmailsText(event.target.value)}
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="contact-address">Primary Address</label>
              <textarea
                id="contact-address"
                rows={4}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor="contact-whatsapp">WhatsApp</label>
              <input
                id="contact-whatsapp"
                type="text"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
              />
            </div>
          </div>

          <section className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Office Hours</h3>
                <p>Structured weekly schedule used across contact views.</p>
              </div>
            </div>
            <div className="admin-card__body">
              <div className="admin-form__grid">
                {officeHours.map((hour, index) => (
                  <div key={hour.day} className="admin-form__field">
                    <label>{hour.day}</label>
                    <div className="admin-form__checkbox">
                      <input
                        type="checkbox"
                        checked={hour.closed}
                        onChange={(event) =>
                          setOfficeHours((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, closed: event.target.checked } : item
                            )
                          )
                        }
                      />
                      Closed
                    </div>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(event) =>
                        setOfficeHours((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, open: event.target.value } : item
                          )
                        )
                      }
                    />
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(event) =>
                        setOfficeHours((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, close: event.target.value } : item
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Offices</h3>
                <p>Each office can carry its own map and address details.</p>
              </div>
            </div>
            <div className="admin-card__body">
              <div className="admin-list-grid">
                {offices.map((office, index) => (
                  <article key={office.id} className="admin-tree__item">
                    <div className="admin-toolbar">
                      <strong>Office {index + 1}</strong>
                      <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={() =>
                          setOffices((current) => current.filter((item) => item.id !== office.id))
                        }
                      >
                        Remove
                      </button>
                    </div>
                    <div className="admin-form__grid">
                      <div className="admin-form__field">
                        <label>Name</label>
                        <input
                          type="text"
                          value={office.name}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field">
                        <label>Map Label</label>
                        <input
                          type="text"
                          value={office.mapLabel}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, mapLabel: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>Address Line 1</label>
                        <input
                          type="text"
                          value={office.addressLine1}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, addressLine1: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>Address Line 2</label>
                        <input
                          type="text"
                          value={office.addressLine2 ?? ""}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, addressLine2: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field">
                        <label>City</label>
                        <input
                          type="text"
                          value={office.city}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, city: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field">
                        <label>Country</label>
                        <input
                          type="text"
                          value={office.country}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, country: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>Google Maps URL</label>
                        <input
                          type="text"
                          value={office.googleMapsUrl}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, googleMapsUrl: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>Embed URL</label>
                        <input
                          type="text"
                          value={office.embedUrl ?? ""}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, embedUrl: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => setOffices((current) => [...current, createOffice(current.length)])}
              >
                Add Office
              </button>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card__header">
              <div>
                <h3>Social Links</h3>
                <p>Structured social link list used by the contact experience.</p>
              </div>
            </div>
            <div className="admin-card__body">
              <div className="admin-list-grid">
                {socialLinks.map((link, index) => (
                  <article key={`${link.platform}-${index}`} className="admin-tree__item">
                    <div className="admin-toolbar">
                      <strong>Social Link {index + 1}</strong>
                      <button
                        className="admin-secondary-button"
                        type="button"
                        onClick={() =>
                          setSocialLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))
                        }
                      >
                        Remove
                      </button>
                    </div>
                    <div className="admin-form__grid">
                      <div className="admin-form__field">
                        <label>Platform</label>
                        <select
                          value={link.platform}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      platform: event.target.value as SiteSettingSocialLinkValue["platform"],
                                    }
                                  : item
                              )
                            )
                          }
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="x">X</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                      </div>
                      <div className="admin-form__field">
                        <label>Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                      <div className="admin-form__field admin-form__field--full">
                        <label>URL</label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, url: event.target.value } : item
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => setSocialLinks((current) => [...current, createSocialLink()])}
              >
                Add Social Link
              </button>
            </div>
          </section>

          {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

          <div className="admin-form__actions">
            <button className="admin-form__submit" type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Contact Settings"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
