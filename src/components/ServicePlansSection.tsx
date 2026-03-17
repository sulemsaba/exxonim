import {
  memo,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";
import { usePricingPlans } from "../hooks/usePricingPlans";
import { useTestimonials } from "../hooks/useTestimonials";
import { routes } from "../routes";
import type { PricingPlan, Testimonial } from "../types";
import "./ServicePackagesSection.css";

type ServicePackagesSectionProps = {
  variant?: "home" | "page";
};

function useInView<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = "0px",
  threshold = 0.15
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return inView;
}

function useDocumentVisible() {
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden
  );

  useEffect(() => {
    const onVisibilityChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return visible;
}

const TestimonialCard = memo(function TestimonialCard({
  testimonials,
  activeIndex,
  onSelect,
  onUserInteract,
  mobile = false,
}: {
  testimonials: Testimonial[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onUserInteract: () => void;
  mobile?: boolean;
}) {
  const review = testimonials[activeIndex];
  const reviewPanelId = `sp-testimonial-panel-${mobile ? "mobile" : "desktop"}`;

  if (!review) {
    return null;
  }

  return (
    <div className={`sp-testimonial ${mobile ? "sp-testimonial--mobile" : ""}`}>
      <div className="sp-testimonial__brand" aria-hidden="true">
        <span className="sp-testimonial__mark" />
      </div>

      <div key={activeIndex} className="sp-testimonial__body" id={reviewPanelId}>
        <div className="sp-testimonial__content">
          <p className="sp-testimonial__eyebrow">{review.eyebrow}</p>
          <h2 className="sp-testimonial__headline">{review.headline}</h2>
          <p className="sp-testimonial__support">{review.support}</p>
          <div className="sp-testimonial__arrow" aria-hidden="true">
            &rarr;
          </div>
        </div>

        <div className="sp-testimonial__quoteCard">
          <p className="sp-testimonial__quote">
            &ldquo;
            {review.quote}
            &rdquo;
          </p>

          <div className="sp-testimonial__person">
            <div className="sp-testimonial__avatar">{review.initials}</div>
            <div>
              <p className="sp-testimonial__name">{review.name}</p>
              <p className="sp-testimonial__role">{review.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sp-testimonial__dots" role="group" aria-label="Reviews">
        {testimonials.map((testimonial, index) => (
          <button
            key={index}
            type="button"
            className={`sp-testimonial__dot ${
              index === activeIndex ? "is-active" : ""
            }`}
            onClick={() => {
              onUserInteract();
              onSelect(index);
            }}
            aria-controls={reviewPanelId}
            aria-label={`Show review from ${testimonial.name}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
});

function PlanCardContent({
  plan,
  isDark,
}: {
  plan: PricingPlan;
  isDark: boolean;
}) {
  return (
    <>
      <div className="sp-planCard__top">
        <span className="sp-planCard__back" aria-hidden="true">
          &larr;
        </span>

        <div className="sp-planCard__toggle" aria-hidden="true">
          <span className="is-active">Package</span>
          <span>Service</span>
        </div>
      </div>

      <div className="sp-planCard__body">
        <div className="sp-planCard__header">
          <h3 className="sp-planCard__title">{plan.name}</h3>
          {plan.badge ? (
            <span className="sp-planCard__badge">{plan.badge}</span>
          ) : null}
        </div>

        <p className="sp-planCard__description">{plan.description}</p>
        <div className="sp-planCard__note">{plan.notes}</div>

        <div className="sp-planCard__divider" />

        <div className="sp-planCard__features">
          {plan.features.map((feature) => (
            <div
              key={feature.label}
              className={`sp-planCard__feature ${
                feature.included ? "" : "is-excluded"
              }`}
            >
              <span
                className={`sp-planCard__featureIcon ${
                  feature.included ? "is-included" : "is-excluded"
                }`}
              >
                {feature.included ? "\u2713" : "\u00d7"}
              </span>
              <span className="sp-planCard__featureLabel">
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        <div className="sp-planCard__actions">
          <a
            href={routes.contact}
            className={`sp-planCard__button ${isDark ? "is-dark" : "is-light"}`}
          >
            Request Consultation
          </a>
        </div>
      </div>
    </>
  );
}

const PlanCardDesktop = memo(function PlanCardDesktop({
  plan,
  slot,
  isDark,
  isActive,
  isHovered,
  isLowered,
  onHoverChange,
}: {
  plan: PricingPlan;
  slot: "left" | "center" | "right";
  isDark: boolean;
  isActive: boolean;
  isHovered: boolean;
  isLowered: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  return (
    <article
      className={`sp-planCard sp-planCard--desktop sp-planCard--${slot} ${
        isDark ? "sp-planCard--dark" : "sp-planCard--light"
      }${isActive ? " is-active" : ""}${isHovered ? " is-hovered" : ""}${
        isLowered ? " is-lowered" : ""
      }`}
      aria-label={`${plan.name} service package`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <PlanCardContent plan={plan} isDark={isDark} />
    </article>
  );
});

const PlanCardMobile = memo(function PlanCardMobile({
  plan,
}: {
  plan: PricingPlan;
}) {
  const isDark = Boolean(plan.recommended);

  return (
    <article
      className={[
        "sp-planCard",
        "sp-planCard--mobile",
        isDark ? "sp-planCard--dark" : "sp-planCard--light",
      ].join(" ")}
      aria-label={`${plan.name} service package`}
    >
      <PlanCardContent plan={plan} isDark={isDark} />
    </article>
  );
});

function DesktopLayout({ plans }: { plans: PricingPlan[] }) {
  const defaultActiveIndex = Math.max(
    plans.findIndex((plan) => plan.recommended),
    0
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? defaultActiveIndex;

  return (
    <div className="sp-desktopLayout">
      <div className="sp-desktopLayout__stage">
        {plans.map((plan, index) => (
          <PlanCardDesktop
            key={plan.name}
            plan={plan}
            slot={index === 0 ? "left" : index === 1 ? "center" : "right"}
            isDark={index === activeIndex}
            isActive={index === defaultActiveIndex && hoveredIndex === null}
            isHovered={index === hoveredIndex}
            isLowered={
              index === defaultActiveIndex &&
              hoveredIndex !== null &&
              hoveredIndex !== defaultActiveIndex
            }
            onHoverChange={(hovered) => {
              setHoveredIndex(hovered ? index : null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MobilePlanStack({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className="sp-mobilePlans">
      {plans.map((plan) => (
        <PlanCardMobile key={plan.name} plan={plan} />
      ))}
    </div>
  );
}

export function ServicePackagesSection({
  variant = "home",
}: ServicePackagesSectionProps) {
  const {
    data: testimonials = [],
    isPending: testimonialsPending,
    error: testimonialsError,
  } = useTestimonials();
  const {
    data: plans = [],
    isPending: plansPending,
    error: plansError,
  } = usePricingPlans();
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionInView = useInView(sectionRef, "0px", 0.18);
  const documentVisible = useDocumentVisible();

  const [activeReview, setActiveReview] = useState(0);
  const [pauseNonce, setPauseNonce] = useState(0);
  const manualPauseUntilRef = useRef(0);

  const pauseTestimonials = () => {
    manualPauseUntilRef.current = Date.now() + 12000;
    setPauseNonce((value) => value + 1);
  };

  useEffect(() => {
    if (!sectionInView || !documentVisible || testimonials.length === 0) return;

    const now = Date.now();
    const pauseRemaining = Math.max(0, manualPauseUntilRef.current - now);
    const delay = pauseRemaining > 0 ? pauseRemaining : 4800;

    const id = window.setTimeout(() => {
      setActiveReview((prev) => (prev + 1) % testimonials.length);
    }, delay);

    return () => window.clearTimeout(id);
  }, [activeReview, documentVisible, pauseNonce, sectionInView, testimonials.length]);

  if (testimonialsPending || plansPending) {
    return <LoadingSpinner label="Loading package plans..." />;
  }

  if (testimonialsError || plansError || testimonials.length === 0 || plans.length === 0) {
    return (
      <ErrorMessage
        title="Unable to load plans."
        detail="Make sure the pricing and testimonial endpoints are available."
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`sp-section ${variant === "page" ? "sp-section--page" : ""}`}
      id={variant === "page" ? "packages" : undefined}
    >
      <div className="sp-section__desktop">
        <div className="sp-shell">
          <div className="sp-shell__left">
            <TestimonialCard
              testimonials={testimonials}
              activeIndex={activeReview}
              onSelect={setActiveReview}
              onUserInteract={pauseTestimonials}
            />
          </div>

          <div className="sp-shell__right">
            <DesktopLayout plans={plans} />
          </div>
        </div>
      </div>

      <div className="sp-section__mobile">
        <div className="sp-mobileShell">
          <TestimonialCard
            testimonials={testimonials}
            activeIndex={activeReview}
            onSelect={setActiveReview}
            onUserInteract={pauseTestimonials}
            mobile={true}
          />

          <MobilePlanStack plans={plans} />
        </div>
      </div>
    </section>
  );
}

export const ServicePlansSection = ServicePackagesSection;
