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
  height: string;
  src: string;
}

const providerLogos: ProviderLogo[] = [
  { alt: "BPO", src: bpoLogo, height: "86px" },
  { alt: "Djema Consult", src: djemaConsultLogo, height: "92px" },
  { alt: "Exxonim", src: exxonimLogo, height: "106px" },
  { alt: "FAMA", src: famaLogo, height: "80px" },
  { alt: "GET", src: getLogo, height: "82px" },
  { alt: "JKM", src: jkmLogo, height: "90px" },
  { alt: "Jotofa", src: jotofaLogo, height: "80px" },
  { alt: "Levo", src: levoLogo, height: "78px" },
  { alt: "TRCS", src: trcsLogo, height: "88px" },
  { alt: "UTEC", src: utecLogo, height: "72px" },
];

export function ProviderSection() {
  const repeatedLogos = [...providerLogos, ...providerLogos];

  return (
    <section className="provider-section dark-grid-section" id="industries">
      <div className="container" data-reveal>
        <p className="provider-copy">
          Trusted by Exxonim clients, collaborators, and operational partners:
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
                  style={{ height: logo.height }}
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
