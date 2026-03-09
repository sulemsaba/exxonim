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
import { providerLabels } from "../content";

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
      <div className="container">
        <div
          className="landing-section-heading landing-section-heading--center"
          data-reveal
        >
          <p className="section-pill section-pill--light">
            <span></span>Sectors and partners
          </p>
          <h2>
            Trusted by businesses, institutions, and operating partners that
            need reliable follow-through.
          </h2>
          <p>
            We support founders, compliance teams, project offices, and
            operators navigating setup and approvals across Tanzania.
          </p>
        </div>

        <div className="partner-band__chips" data-reveal>
          {providerLabels.map((label) => (
            <span key={label} className="partner-band__chip">
              {label}
            </span>
          ))}
        </div>

        <p className="provider-copy" data-reveal>
          Brands, collaborators, and client-side teams we have worked
          alongside.
        </p>

        <div className="provider-marquee" aria-label="Client and partner logos">
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
