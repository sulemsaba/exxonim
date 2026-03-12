import type { RefObject } from "react";
import type { InsightPost } from "../types";
import { routes } from "../routes";

interface InsightsSectionProps {
  posts: InsightPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

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
        <div
          className="landing-section-heading landing-section-heading--center"
          data-reveal
        >
          <h2>Insights and news</h2>
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

        <div className="resources-more" data-reveal>
          <a className="landing-cta landing-cta--primary" href={routes.resources}>
            See more
          </a>
        </div>
      </div>
    </section>
  );
}
