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

export function FaqPage() {
  return (
    <section className="page-shell light-section">
      <div className="container page-hero" id="faq" data-reveal>
        <div className="faq-shell">
          <div className="faq-shell__header">
            <p className="section-pill section-pill--light">
              <span></span>FAQ
            </p>
            <h2>Common questions before you start.</h2>
            <p>
              Practical answers around registration, filings, licenses, and the
              next step after you submit documents to Exxonim.
            </p>
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
