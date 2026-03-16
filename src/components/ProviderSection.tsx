import bpoLogo from "../../assets/clients/bpo.webp";
import djemaConsultLogo from "../../assets/clients/djema_consult.webp";
import exxonimLogo from "../../assets/clients/exxonim logo.webp";
import famaLogo from "../../assets/clients/fama.webp";
import getLogo from "../../assets/clients/get.webp";
import jkmLogo from "../../assets/clients/jkm.webp";
import jotofaLogo from "../../assets/clients/jotofa.webp";
import levoLogo from "../../assets/clients/levo.webp";
import trcsLogo from "../../assets/clients/trcs.webp";
import utecLogo from "../../assets/clients/utec.webp";

interface ProviderLogo {
  alt: string;
  src: string;
}

const providerLogos: ProviderLogo[] = [
  { alt: "BPO", src: bpoLogo },
  { alt: "Djema Consult", src: djemaConsultLogo },
  { alt: "Exxonim", src: exxonimLogo },
  { alt: "FAMA", src: famaLogo },
  { alt: "GET", src: getLogo },
  { alt: "JKM", src: jkmLogo },
  { alt: "Jotofa", src: jotofaLogo },
  { alt: "Levo", src: levoLogo },
  { alt: "TRCS", src: trcsLogo },
  { alt: "UTEC", src: utecLogo },
];

export function ProviderSection() {
  const repeatedLogos = [...providerLogos, ...providerLogos];

  return (
    <section className="provider-section" id="industries">
      <div className="container provider-section__inner">
        <div className="provider-heading" data-reveal>
          <span className="provider-kicker">Our Clients</span>
          <h2 className="provider-title">Trusted by Leading Companies</h2>
        </div>
        <div
          className="provider-marquee"
          aria-label="Client and partner logos"
          data-reveal
        >
          <div className="provider-track">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="provider-logo-card"
                aria-label={logo.alt}
                role="img"
              >
                <img
                  className="provider-logo-image"
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  loading={index < providerLogos.length ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
