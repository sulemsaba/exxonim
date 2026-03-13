import { useEffect, useState } from "react";
import { routes } from "../routes";

type PlanFeature = {
  label: string;
  included: boolean;
};

type Plan = {
  name: string;
  badge?: string;
  accent: "light" | "dark";
  description: string;
  features: PlanFeature[];
  cta: string;
};

type Review = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

type ServicePackagesSectionProps = {
  variant?: "home" | "page";
};

const sectionStyles = String.raw`
  .service-plans-section {
    --plans-bg: #aeb4bf;
    --plans-surface: #f7f4ea;
    --plans-surface-2: #f1ead4;
    --plans-surface-3: #ffffff;
    --plans-text: #232323;
    --plans-text-soft: rgba(35, 35, 35, 0.72);
    --plans-border: rgba(35, 35, 35, 0.12);
    --plans-green: #89c62f;
    --plans-green-dark: #0c4300;
    --plans-yellow: #f0cf50;
    --plans-card-dark: #252525;
    --plans-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
    background: var(--plans-bg);
    padding: 4rem 1rem;
  }

  .service-plans-section--page {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .service-plans-intro {
    max-width: 1380px;
    margin: 0 auto 2rem;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(280px, 420px);
    gap: 1.5rem;
    align-items: end;
  }

  .service-plans-intro__eyebrow {
    margin: 0 0 0.9rem;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(35, 35, 35, 0.62);
  }

  .service-plans-intro h2 {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    line-height: 0.98;
    letter-spacing: -0.05em;
    color: var(--plans-text);
  }

  .service-plans-intro p {
    margin: 1rem 0 0;
    max-width: 42rem;
    font-size: 1.02rem;
    line-height: 1.7;
    color: var(--plans-text-soft);
  }

  .service-plans-intro__meta {
    display: grid;
    gap: 0.8rem;
    padding: 1.1rem 1.2rem;
    border-radius: 1.6rem;
    border: 1px solid rgba(35, 35, 35, 0.1);
    background: rgba(255, 255, 255, 0.36);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  }

  .service-plans-intro__meta strong {
    font-size: 1rem;
    color: var(--plans-text);
  }

  .service-plans-intro__meta span {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--plans-text-soft);
  }

  .service-plans-shell {
    max-width: 1380px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 360px minmax(0, 1fr);
    gap: 2rem;
    align-items: center;
  }

  @media (max-width: 1180px) {
    .service-plans-intro {
      grid-template-columns: 1fr;
    }

    .service-plans-shell {
      grid-template-columns: 1fr;
    }
  }

  .review-slider-wrap {
    display: flex;
    justify-content: center;
  }

  .review-card {
    position: relative;
    width: 100%;
    max-width: 330px;
    min-height: 760px;
    background: linear-gradient(180deg, #b182ff 0%, #9f77ed 100%);
    border-radius: 28px;
    padding: 1.7rem;
    box-shadow: var(--plans-shadow);
    overflow: hidden;
    color: white;
  }

  .review-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 22%),
      linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 100%);
    pointer-events: none;
  }

  .review-brand {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    opacity: 0.98;
  }

  .review-brand__mark {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    background: rgba(255,255,255,0.92);
    position: relative;
  }

  .review-brand__mark::before,
  .review-brand__mark::after {
    content: "";
    position: absolute;
    top: 7px;
    width: 14px;
    height: 20px;
    border-radius: 999px;
    background: #a87cff;
  }

  .review-brand__mark::before {
    left: 6px;
  }

  .review-brand__mark::after {
    right: 6px;
  }

  .review-eyebrow {
    font-size: 1rem;
    line-height: 1.4;
    opacity: 0.94;
    margin: 0 0 0.8rem;
  }

  .review-title {
    margin: 0;
    font-size: clamp(2rem, 3vw, 2.6rem);
    line-height: 1.06;
    font-weight: 700;
    letter-spacing: -0.03em;
    max-width: 9ch;
  }

  .review-copy {
    margin: 1.4rem 0 0;
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(255,255,255,0.88);
    max-width: 16rem;
    min-height: 7.5rem;
  }

  .review-arrow {
    margin-top: 1.5rem;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1.5px solid rgba(255,255,255,0.55);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
  }

  .review-testimonial {
    position: absolute;
    left: 1.6rem;
    right: 1.6rem;
    bottom: 1.7rem;
    background: #c6f164;
    color: #233100;
    border-radius: 18px;
    padding: 1rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 3px solid rgba(255,255,255,0.62);
  }

  .review-quote {
    margin: 0;
    font-size: 0.98rem;
    line-height: 1.65;
    font-style: italic;
    font-weight: 600;
    min-height: 8.5rem;
  }

  .review-person {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .review-avatar {
    width: 46px;
    height: 46px;
    border-radius: 999px;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid rgba(35, 49, 0, 0.15);
  }

  .review-person__name {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .review-person__role {
    margin: 0.2rem 0 0;
    font-size: 0.88rem;
    line-height: 1.3;
    color: rgba(35,49,0,0.78);
  }

  .review-dots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .review-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: rgba(255,255,255,0.4);
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  .review-dot.is-active {
    background: rgba(255,255,255,0.95);
  }

  .plans-stage {
    width: 100%;
    min-height: 760px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plans-row {
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 1.5rem;
    perspective: 1400px;
  }

  @media (max-width: 1180px) {
    .plans-stage {
      min-height: auto;
    }

    .plans-row {
      flex-direction: column;
      align-items: center;
    }
  }

  .plan-card {
    position: relative;
    width: 310px;
    min-height: 680px;
    border-radius: 34px;
    padding: 1.25rem 1.2rem 1.4rem;
    box-shadow: var(--plans-shadow);
    border: 1px solid var(--plans-border);
    transition:
      transform 260ms ease,
      box-shadow 260ms ease,
      border-color 260ms ease;
    transform-origin: center center;
    overflow: hidden;
  }

  .plan-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.18);
  }

  .plan-card--light {
    background: linear-gradient(180deg, var(--plans-surface) 0%, var(--plans-surface-2) 100%);
    color: var(--plans-text);
  }

  .plan-card--dark {
    background: linear-gradient(180deg, #2d2d2d 0%, #1e1e1e 100%);
    color: white;
    border: 2px solid var(--plans-yellow);
  }

  .plan-card--mikumi {
    transform: rotate(-4deg) translateY(8px);
  }

  .plan-card--ngorongoro {
    transform: translateY(-18px);
  }

  .plan-card--serengeti {
    transform: rotate(4deg) translateY(10px);
  }

  .plan-card--mikumi:hover {
    transform: rotate(-2deg) translateY(-8px) scale(1.03);
  }

  .plan-card--ngorongoro:hover {
    transform: translateY(-24px) scale(1.03);
  }

  .plan-card--serengeti:hover {
    transform: rotate(2deg) translateY(-8px) scale(1.03);
  }

  @media (max-width: 1180px) {
    .plan-card,
    .plan-card--mikumi,
    .plan-card--ngorongoro,
    .plan-card--serengeti,
    .plan-card--mikumi:hover,
    .plan-card--ngorongoro:hover,
    .plan-card--serengeti:hover {
      transform: none;
      width: min(100%, 360px);
      min-height: auto;
    }
  }

  .plan-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }

  .plan-back {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.9);
    color: #444;
    font-size: 1rem;
    border: 1px solid rgba(17,17,17,0.08);
  }

  .plan-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(255,255,255,0.6);
    padding: 0.25rem;
    border-radius: 999px;
    border: 1px solid rgba(17,17,17,0.08);
  }

  .plan-toggle span {
    min-width: 58px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(17,17,17,0.7);
  }

  .plan-toggle .is-active {
    background: #2f2f2f;
    color: white;
  }

  .plan-card--dark .plan-toggle {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.12);
  }

  .plan-card--dark .plan-toggle span {
    color: rgba(255,255,255,0.72);
  }

  .plan-card--dark .plan-toggle .is-active {
    background: #ffffff;
    color: #1d1d1d;
  }

  .plan-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .plan-name {
    margin: 0;
    font-size: 2.1rem;
    line-height: 1;
    letter-spacing: -0.03em;
    font-weight: 500;
  }

  .plan-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 0 0.9rem;
    border-radius: 999px;
    background: rgba(137, 198, 47, 0.12);
    color: var(--plans-green-dark);
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .plan-card--dark .plan-badge {
    background: rgba(255, 218, 84, 0.22);
    color: #ffd54f;
  }

  .plan-meta {
    margin: 0.3rem 0 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--plans-text-soft);
  }

  .plan-card--dark .plan-meta {
    color: rgba(255,255,255,0.74);
  }

  .plan-illustration {
    margin-top: 1rem;
    margin-bottom: 1.2rem;
    padding: 1rem;
    border-radius: 24px;
    border: 1px solid rgba(17,17,17,0.08);
    background: rgba(255,255,255,0.4);
  }

  .plan-card--dark .plan-illustration {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.08);
  }

  .plan-illustration__title {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
    font-weight: 700;
  }

  .plan-illustration__copy {
    margin: 0.45rem 0 0;
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--plans-text-soft);
  }

  .plan-card--dark .plan-illustration__copy {
    color: rgba(255,255,255,0.72);
  }

  .plan-divider {
    width: 100%;
    height: 1px;
    background: rgba(17,17,17,0.12);
    margin: 1rem 0 1.1rem;
  }

  .plan-card--dark .plan-divider {
    background: rgba(255,255,255,0.12);
  }

  .plan-features {
    display: grid;
    gap: 0.92rem;
  }

  .plan-feature {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 0.8rem;
    align-items: start;
  }

  .plan-feature__icon {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    font-weight: 700;
    margin-top: 0.1rem;
  }

  .plan-feature__icon.is-included {
    background: var(--plans-green);
    color: #ffffff;
  }

  .plan-feature__icon.is-excluded {
    background: transparent;
    color: rgba(17,17,17,0.45);
    border: 1px solid rgba(17,17,17,0.18);
  }

  .plan-card--dark .plan-feature__icon.is-excluded {
    color: rgba(255,255,255,0.4);
    border-color: rgba(255,255,255,0.18);
  }

  .plan-feature__label {
    font-size: 0.96rem;
    line-height: 1.5;
    color: inherit;
  }

  .plan-feature.is-excluded .plan-feature__label {
    opacity: 0.54;
  }

  .plan-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .plan-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding: 0 1.3rem;
    border-radius: 999px;
    text-decoration: none;
    font-size: 0.96rem;
    font-weight: 600;
    transition: transform 180ms ease, background-color 180ms ease;
  }

  .plan-button--light {
    background: rgba(255,255,255,0.72);
    color: #2b2b2b;
    border: 1px solid rgba(17,17,17,0.08);
  }

  .plan-button--light:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.92);
  }

  .plan-button--dark {
    background: #ffffff;
    color: #232323;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .plan-button--dark:hover {
    transform: translateY(-2px);
    background: #f5f5f5;
  }
`;

const reviews: Review[] = [
  {
    quote:
      "Exxonim made our registration work much easier to follow. We stopped guessing what comes next and started moving with clear documents and proper follow-up.",
    name: "Brooklyn Simmons",
    role: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "The team helped us organize licensing and compliance work in a way that reduced delays and unnecessary back-and-forth with authorities.",
    name: "Marvin McKinney",
    role: "Operations Lead",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "What stood out most was the structure. Exxonim helped us prepare documents properly before submission, which saved us time and stress.",
    name: "Savannah Nguyen",
    role: "Business Founder",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
];

const plans: Plan[] = [
  {
    name: "Mikumi",
    accent: "light",
    description:
      "The easy plan for founders and small teams who want clean, practical support to start correctly and handle core business requirements with less friction.",
    features: [
      { label: "Company registration support", included: true },
      { label: "Business name registration", included: true },
      { label: "Basic filing guidance", included: true },
      { label: "Document requirement checklist", included: true },
      { label: "Trademark registration support", included: false },
      { label: "Business plan preparation", included: false },
      { label: "Priority authority follow-up", included: false },
      { label: "Advanced compliance coordination", included: false },
    ],
    cta: "Request Consultation",
  },
  {
    name: "Ngorongoro",
    badge: "Best Plan",
    accent: "dark",
    description:
      "Our strongest plan for businesses that want deeper support across registration, compliance, licensing, and readiness with better coordination from start to finish.",
    features: [
      { label: "Company registration support", included: true },
      { label: "Business name registration", included: true },
      { label: "Trademark registration support", included: true },
      { label: "TIN and statutory filing support", included: true },
      { label: "Business license application support", included: true },
      { label: "OSHA / NSSF / WCF guidance", included: true },
      { label: "Priority authority follow-up", included: true },
      { label: "Business plan preparation", included: false },
    ],
    cta: "Request Consultation",
  },
  {
    name: "Serengeti",
    badge: "All Plan",
    accent: "light",
    description:
      "A broad support plan for growing businesses that want coverage across registration, filing, approvals, workforce registrations, and operational readiness.",
    features: [
      { label: "Company registration support", included: true },
      { label: "Business name registration", included: true },
      { label: "Trademark registration support", included: true },
      { label: "TIN and statutory filing support", included: true },
      { label: "Business license application support", included: true },
      { label: "CRB / ERB registration support", included: true },
      { label: "OSHA / NSSF / WCF guidance", included: true },
      { label: "Business plan preparation", included: true },
    ],
    cta: "Request Consultation",
  },
];

function ReviewSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, []);

  const active = reviews[current];

  return (
    <div className="review-slider-wrap">
      <div>
        <div className="review-card">
          <div className="review-brand">
            <span className="review-brand__mark" />
          </div>

          <p className="review-eyebrow">Save More</p>
          <h2 className="review-title">Start Saving Your Money</h2>
          <p className="review-copy">
            Practical consultation support that helps businesses reduce delays,
            organize documents, and move each service request toward a clearer
            next step.
          </p>

          <div className="review-arrow">{"\u2192"}</div>

          <div className="review-testimonial">
            <p className="review-quote">"{active.quote}"</p>

            <div className="review-person">
              <img
                className="review-avatar"
                src={active.avatar}
                alt={active.name}
              />
              <div>
                <p className="review-person__name">{active.name}</p>
                <p className="review-person__role">{active.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="review-dots">
          {reviews.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`review-dot ${index === current ? "is-active" : ""}`}
              onClick={() => setCurrent(index)}
              aria-label={`Show review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const cardClass =
    index === 0
      ? "plan-card--mikumi"
      : index === 1
        ? "plan-card--ngorongoro"
        : "plan-card--serengeti";

  return (
    <article
      className={`plan-card ${cardClass} ${
        plan.accent === "dark" ? "plan-card--dark" : "plan-card--light"
      }`}
    >
      <div className="plan-topbar">
        <span className="plan-back">{"\u2190"}</span>

        <div className="plan-toggle">
          <span className="is-active">Package</span>
          <span>Service</span>
        </div>
      </div>

      <div className="plan-header">
        <div>
          <h3 className="plan-name">{plan.name}</h3>
          <p className="plan-meta">{plan.description}</p>
        </div>

        {plan.badge ? <span className="plan-badge">{plan.badge}</span> : null}
      </div>

      <div className="plan-illustration">
        <p className="plan-illustration__title">What this package supports</p>
        <p className="plan-illustration__copy">
          Structured help across registration, filing, approvals, and business
          readiness according to the depth of support your business needs.
        </p>
      </div>

      <div className="plan-divider" />

      <div className="plan-features">
        {plan.features.map((feature) => (
          <div
            key={feature.label}
            className={`plan-feature ${feature.included ? "" : "is-excluded"}`}
          >
            <span
              className={`plan-feature__icon ${
                feature.included ? "is-included" : "is-excluded"
              }`}
            >
              {feature.included ? "\u2713" : "\u00D7"}
            </span>

            <span className="plan-feature__label">{feature.label}</span>
          </div>
        ))}
      </div>

      <div className="plan-actions">
        <a
          href={routes.contact}
          className={`plan-button ${
            plan.accent === "dark" ? "plan-button--dark" : "plan-button--light"
          }`}
        >
          {plan.cta}
        </a>
      </div>
    </article>
  );
}

export function ServicePackagesSection({
  variant = "home",
}: ServicePackagesSectionProps) {
  const isPage = variant === "page";

  return (
    <>
      <style>{sectionStyles}</style>

      <section
        className={`service-plans-section ${
          isPage ? "service-plans-section--page" : ""
        }`}
        id={isPage ? "packages" : undefined}
      >
        {isPage ? (
          <div className="service-plans-intro">
            <div>
              <p className="service-plans-intro__eyebrow">Service packages</p>
              <h2>Choose the level of support that matches your filing load.</h2>
              <p>
                These packages are built for businesses that need different
                levels of help across registrations, licenses, compliance work,
                and follow-up. Start with a lighter package or move into deeper
                coordination when the work is broader.
              </p>
            </div>

            <div className="service-plans-intro__meta">
              <strong>Built for real submission work</strong>
              <span>
                Start-up setup, recurring compliance, regulated approvals, and
                operational readiness all need different levels of support.
              </span>
            </div>
          </div>
        ) : null}

        <div className="service-plans-shell">
          <ReviewSlider />

          <div className="plans-stage">
            <div className="plans-row">
              {plans.map((plan, index) => (
                <PlanCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const ServicePlansSection = ServicePackagesSection;
