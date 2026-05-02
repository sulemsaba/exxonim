import { Container } from './primitives/Container'
import type { ProviderSectionContent } from '../types'

interface ProviderSectionProps {
  content: ProviderSectionContent;
}

export function ProviderSection({ content }: ProviderSectionProps) {
  const repeatedLogos = [...content.logos, ...content.logos]

  return (
    <section
      id="industries"
      className="relative py-6 border-y border-border-soft bg-gradient-to-b from-surface/84 to-surface-soft/70 dark:from-[rgba(11,31,35,0.9)] dark:to-[rgba(13,34,38,0.76)] dark:border-border-dark-soft"
    >
      <Container className="grid gap-4">
        <div className="grid gap-1 justify-items-center text-center">
          <span className="inline-flex items-center min-h-8 px-3.5 border border-border-soft rounded-full bg-surface-elevated text-accent text-xs font-extrabold tracking-[0.14em] uppercase dark:bg-accent-dark-soft dark:border-border-dark-soft">
            {content.kicker}
          </span>
          <h2 className="m-0 font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight dark:text-text-dark">
            {content.title}
          </h2>
        </div>

        <div
          className="overflow-hidden whitespace-nowrap relative w-screen -ml-[50vw] left-1/2 py-2.5 px-[clamp(22px,4vw,48px)] bg-surface/58 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] dark:bg-surface-dark/58"
          aria-label="Client and partner logos"
        >
          <div className="inline-flex items-center gap-[clamp(1.6rem,3vw,2.6rem)] w-max animate-provider-marquee hover:[animation-play-state:paused]">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="inline-flex items-center justify-center flex-none min-w-[clamp(112px,9.5vw,144px)] min-h-[60px]"
                aria-label={logo.alt}
                role="img"
              >
                <img
                  className="block max-w-full h-[clamp(31px,3.6vw,48px)] w-auto object-contain transition-all duration-300 saturate-[0.92] contrast-[1.02] hover:scale-105 hover:saturate-100"
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  loading={index < content.logos.length ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
