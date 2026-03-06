import type { CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
}

export function StackSection({ items }: StackSectionProps) {
  return (
    <section
      className="stack-section dark-grid-section"
      id="stacked-scroll"
      data-stack-container
    >
      <div className="stack-section__inner">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="stack-card"
            data-stack-card
            style={{ "--stack-index": index } as CSSProperties}
          >
            <div className="stack-card__inner">
              <div className="container stack-card__content">
                <div className="stack-copy">
                  <p className="section-pill section-pill--dark">
                    <span></span>What We Solve
                  </p>
                  <h2>{item.title}</h2>
                  <p className="stack-subtitle">{item.subtitle}</p>
                  <div className="stack-note">{item.description}</div>
                  <a className="button button-light" href={item.ctaHref}>
                    {item.ctaLabel}
                  </a>
                </div>

                <div className="stack-visual">
                  <div className="code-window">
                    <div className="code-window__top">
                      <div className="window-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span>{item.windowTitle}</span>
                      <span className="window-tag">{item.windowTag}</span>
                    </div>
                    <div className="code-window__body code-window__body--media">
                      <video
                        className="stack-video"
                        src={item.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
