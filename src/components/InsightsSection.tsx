import type { RefObject } from "react";
import type { InsightPost } from "../types";

interface InsightsSectionProps {
  posts: InsightPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

const faqItems = [
  {
    question: "What do I need before starting company registration?",
    answer:
      "The exact list depends on the entity type, but we usually begin with ownership details, proposed names, identification documents, and the target business structure.",
  },
  {
    question: "Can Exxonim help if my filings are already overdue?",
    answer:
      "Yes. We can assess the backlog, identify the immediate statutory risk, and sequence the filings or registrations that need to be resolved first.",
  },
  {
    question: "Do you support regulated sectors and institutional registrations?",
    answer:
      "Yes. Exxonim supports licensing and registration processes that involve sector regulators, professional boards, and employer-side compliance bodies.",
  },
  {
    question: "How do I follow up after submitting documents?",
    answer:
      "Use the consultation channel provided by Exxonim or contact the office directly. We keep the workflow tied to a practical next step instead of leaving updates open-ended.",
  },
];

export function InsightsSection({
  posts,
  railRef,
  onPrev,
  onNext,
}: InsightsSectionProps) {
  return (
    <section className="resources-section light-section" id="resources">
      <span className="section-anchor" id="blogs" aria-hidden="true"></span>
      <div className="container">
        <div className="landing-section-heading" data-reveal>
          <p className="section-pill section-pill--light">
            <span></span>Insights
          </p>
          <h2>
            Resources for founders and operators preparing the next filing or
            approval.
          </h2>
          <p>
            Short reads, practical reminders, and planning prompts built around
            registration, compliance, and business readiness.
          </p>
        </div>

        <div className="resources-rail" ref={railRef}>
          {posts.map((post) => (
            <article key={post.title} className="resource-card" data-reveal>
              <div className="resource-card__copy">
                <div className="resource-card__tag">{post.tag}</div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
              <div className="resource-card__media">
                <span>{post.mediaLabel}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="resources-controls">
          <button className="landing-control" type="button" onClick={onPrev}>
            Prev
          </button>
          <button className="landing-control" type="button" onClick={onNext}>
            Next
          </button>
        </div>

        <div className="faq-shell" id="faq">
          <div className="faq-shell__header" data-reveal>
            <p className="section-pill section-pill--light">
              <span></span>FAQ
            </p>
            <h2>Common questions before you start.</h2>
          </div>

          <div className="faq-grid">
            {faqItems.map((item) => (
              <article key={item.question} className="faq-card" data-reveal>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
