import { routes } from "../routes";

const infoPageStyles = String.raw`
  .info-page {
    padding: 1.75rem 0 5.5rem;
  }

  .info-page__header {
    display: grid;
    gap: 1rem;
    max-width: 48rem;
    margin-bottom: 2rem;
  }

  .info-page__header h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4.8vw, 4.5rem);
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .info-page__header p:last-child {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.72;
    color: rgba(17, 35, 37, 0.74);
  }

  .info-page__grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-page__section {
    display: grid;
    gap: 0.9rem;
    min-height: 100%;
    padding: 1.45rem;
    border: 1px solid var(--cinematic-card-border);
    border-radius: 1.7rem;
    background: var(--cinematic-card-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .info-page__section h2 {
    margin: 0;
    font-size: 1.18rem;
    line-height: 1.35;
  }

  .info-page__section p {
    margin: 0;
    color: rgba(17, 35, 37, 0.74);
    line-height: 1.74;
  }

  .info-page__list {
    display: grid;
    gap: 0.7rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .info-page__list li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    align-items: start;
    color: rgba(17, 35, 37, 0.74);
    line-height: 1.7;
  }

  .info-page__list li::before {
    content: "+";
    color: var(--color-accent);
    font-weight: 800;
  }

  .info-page__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: auto;
  }

  html[data-theme="dark"] .info-page__header p:last-child,
  html[data-theme="dark"] .info-page__section p,
  html[data-theme="dark"] .info-page__list li {
    color: rgba(237, 242, 255, 0.76);
  }

  @media (max-width: 900px) {
    .info-page__grid {
      grid-template-columns: 1fr;
    }
  }
`;

interface ContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
}

function ContentPage({
  eyebrow,
  title,
  description,
  sections,
  primaryAction,
  secondaryAction,
}: ContentPageProps) {
  return (
    <>
      <style>{infoPageStyles}</style>
      <section className="info-page light-section">
        <div className="container">
          <header className="info-page__header">
            <p className="section-pill section-pill--light">
              <span></span>
              {eyebrow}
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          <div className="info-page__grid">
            {sections.map((section) => (
              <section key={section.title} className="info-page__section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="info-page__list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {primaryAction || secondaryAction ? (
              <section className="info-page__section">
                <h2>Next step</h2>
                <p>
                  If you need help with a live filing, a licensing question, or a
                  document handoff, use the contact options below and Exxonim will
                  guide the next practical step.
                </p>
                <div className="info-page__actions">
                  {primaryAction ? (
                    <a className="landing-cta landing-cta--primary" href={primaryAction.href}>
                      {primaryAction.label}
                    </a>
                  ) : null}
                  {secondaryAction ? (
                    <a
                      className="landing-cta landing-cta--secondary"
                      href={secondaryAction.href}
                    >
                      {secondaryAction.label}
                    </a>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

export function SupportPage() {
  return (
    <ContentPage
      eyebrow="Support"
      title="Support channels that keep follow-up clear."
      description="Use the right channel for the type of request so registration, filing, and licensing questions reach Exxonim with enough context to move forward."
      sections={[
        {
          title: "Best ways to reach Exxonim",
          paragraphs: [
            "For new work, the fastest route is usually a phone call or direct email with a short description of the service you need. For existing work, include the company name, filing type, and the last step already completed.",
          ],
          bullets: [
            "Phone: +255 794 689 099 or +255 685 525 224",
            "Email: info@exxonim.tz or md@exxonim.tz",
            "Office: Mbezi Beach B, Africana, Bagamoyo Road, Dar es Salaam",
          ],
        },
        {
          title: "What to include in a follow-up",
          paragraphs: [
            "Support requests move faster when Exxonim can immediately identify the matter. Include the client name, the regulator or filing type involved, any reference you were given, and the document or action you need clarified.",
          ],
          bullets: [
            "State whether the request is new work or an ongoing engagement",
            "Mention the authority, filing, or license involved",
            "Attach the latest notice, checklist, or submission evidence if relevant",
          ],
        },
        {
          title: "What Exxonim can help with",
          paragraphs: [
            "Support covers registration readiness, missing document review, filing sequence questions, licensing clarification, and practical follow-up on ongoing work. Matters that need a formal commercial scope may be moved into a new consultation.",
          ],
        },
      ]}
      primaryAction={{ href: routes.contact, label: "Contact Exxonim" }}
      secondaryAction={{ href: routes.faq, label: "Read the FAQ" }}
    />
  );
}

export function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms"
      title="Website terms of use."
      description="These terms govern how visitors use the Exxonim website and its published materials. They do not replace any separate client engagement terms agreed for paid services."
      sections={[
        {
          title: "Using this website",
          paragraphs: [
            "You may use the site to learn about Exxonim services, contact the company, and read published articles. You should not use the site in a way that interferes with its operation or misrepresents the source of its content.",
          ],
        },
        {
          title: "Informational content only",
          paragraphs: [
            "Articles and website copy are provided for general informational purposes. They are not a substitute for a scoped engagement, document review, or regulator-specific advice on your exact facts.",
          ],
        },
        {
          title: "Content ownership",
          paragraphs: [
            "Unless otherwise stated, the site design, branding, copy, and published materials belong to Exxonim. You may quote short excerpts with attribution, but you should not republish full materials as your own.",
          ],
        },
        {
          title: "External links and availability",
          paragraphs: [
            "The site may link to third-party services or references. Exxonim is not responsible for third-party content or availability. The website may be updated, changed, or temporarily unavailable without prior notice.",
          ],
        },
      ]}
      primaryAction={{ href: routes.contact, label: "Ask a question" }}
      secondaryAction={{ href: routes.privacy, label: "Privacy policy" }}
    />
  );
}

export function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="Website privacy policy."
      description="This page explains the basic information Exxonim may receive through the website and how it is used for contact, support, and business communication."
      sections={[
        {
          title: "Information you choose to share",
          paragraphs: [
            "If you contact Exxonim by phone, email, WhatsApp, or another linked channel, Exxonim may receive the information you provide, including your name, company details, contact information, and any documents or context you send.",
          ],
        },
        {
          title: "How the information is used",
          paragraphs: [
            "That information is used to respond to inquiries, understand the service requested, continue follow-up on ongoing work, and maintain normal business communication around Exxonim services.",
          ],
        },
        {
          title: "Sharing and retention",
          paragraphs: [
            "Exxonim does not publish private inquiry details on the website. Information may be retained in normal business records where needed to respond to requests, continue support, or maintain a history of communication.",
          ],
        },
        {
          title: "Questions about privacy",
          paragraphs: [
            "If you want to clarify what information you have shared through the site or how to contact Exxonim about privacy concerns, use the main support channels listed on the contact and support pages.",
          ],
        },
      ]}
      primaryAction={{ href: routes.support, label: "Support details" }}
      secondaryAction={{ href: routes.contact, label: "Contact Exxonim" }}
    />
  );
}

export function NotFoundPage() {
  return (
    <ContentPage
      eyebrow="404"
      title="That page is not available."
      description="The address you requested does not match an active Exxonim page. Use one of the main routes below to continue."
      sections={[
        {
          title: "Useful destinations",
          paragraphs: [
            "Return to the home page, browse services, or open the resources library to continue from a supported route.",
          ],
          bullets: [
            "Home page and company overview",
            "Services and registration support",
            "Resources and practical articles",
          ],
        },
      ]}
      primaryAction={{ href: routes.home, label: "Go home" }}
      secondaryAction={{ href: routes.resources, label: "Browse resources" }}
    />
  );
}
