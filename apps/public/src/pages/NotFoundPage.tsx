import { useEffect } from "react";
import { applyResolvedSeo, createFallbackSeo } from "../seo";
import { normalizePathname, routes } from "../routes";


interface NotFoundPageProps {
  pathname?: string;
}

export function NotFoundPage({ pathname }: NotFoundPageProps) {
  const normalizedPathname = normalizePathname(pathname);
  const showRequestedPath =
    Boolean(normalizedPathname) &&
    normalizedPathname !== normalizePathname(routes.home) &&
    normalizedPathname !== normalizePathname(routes.notFound);

  useEffect(() => {
    applyResolvedSeo(
      createFallbackSeo(routes.notFound, {
        title: "Page not found | Exxonim",
        description: "The Exxonim page you requested could not be found.",
        robots: "noindex,follow",
      })
    );
  }, []);

  return (
    <>
<section className="ex404-page">
        <div className="container">
          <div className="ex404-shell">
            <div className="ex404-copy">
              <div className="ex404-brand">
                <img
                  className="ex404-logo ex404-logo--light"
                  src="/assets/exxonim-logo.webp"
                  alt="Exxonim"
                />
                <img
                  className="ex404-logo ex404-logo--dark"
                  src="/assets/logo-dark.png"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <p className="ex404-pill">
                <span></span>
                Page not found
              </p>

              <p className="ex404-code">404</p>

              <h1>We lost this route.</h1>

              <p className="ex404-lead">
                The Exxonim page you requested is not available. Start from the main site or jump
                straight to the next useful section.
              </p>

              {showRequestedPath ? (
                <p className="ex404-path">
                  Requested path
                  <code>{pathname}</code>
                </p>
              ) : null}

              <div className="ex404-actions">
                <a className="landing-cta landing-cta--primary" href={routes.home}>
                  Go home
                </a>
                <a className="landing-cta landing-cta--secondary" href={routes.services}>
                  See services
                </a>
                <a className="landing-cta landing-cta--secondary" href={routes.contact}>
                  Contact Exxonim
                </a>
              </div>
            </div>

            <div className="ex404-stage" aria-hidden="true">
              <div className="ex404-glow"></div>
              <div className="ex404-ring"></div>

              <div className="ex404-tile ex404-tile--ghost">
                <strong>Contact</strong>
                <span>Use the direct Exxonim contact route instead.</span>
              </div>

              <div className="ex404-tile ex404-tile--secondary">
                <strong>Services</strong>
                <span>Company setup, tax support, licensing, and filings.</span>
              </div>

              <div className="ex404-tile ex404-tile--primary">
                <strong>Home</strong>
                <span>Start again from the main Exxonim front page.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
