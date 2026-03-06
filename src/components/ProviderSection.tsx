interface ProviderSectionProps {
  labels: string[];
}

export function ProviderSection({ labels }: ProviderSectionProps) {
  const repeatedLabels = [...labels, ...labels];

  return (
    <section className="provider-section dark-grid-section" id="industries">
      <div className="container">
        <p className="provider-copy">
          Trusted in leadership teams, transformation offices, and growth
          programs where execution quality matters:
        </p>
        <div className="provider-marquee">
          <div className="provider-track">
            {repeatedLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
