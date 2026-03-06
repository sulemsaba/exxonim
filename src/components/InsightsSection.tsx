import type { RefObject } from "react";
import type { InsightPost } from "../types";

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
    <section className="blog-section dark-grid-section" id="resources">
      <div className="container">
        <div className="blog-heading" data-reveal>
          <p className="section-pill section-pill--dark">
            <span></span>Insights
          </p>
          <h2 className="section-title section-title--light">
            Perspectives for Leaders Building Through Complexity
          </h2>
        </div>

        <div className="blog-rail" ref={railRef}>
          {posts.map((post) => (
            <article key={post.title} className="blog-card">
              <div className="blog-card__copy">
                <div className="blog-tag">{post.tag}</div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
              <div className="blog-card__media">
                <span>{post.mediaLabel}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-controls">
          <button className="rail-button" type="button" onClick={onPrev}>
            Prev
          </button>
          <button className="rail-button" type="button" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
