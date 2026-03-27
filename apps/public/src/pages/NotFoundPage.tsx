import { useEffect } from "react";
import { applyResolvedSeo, createFallbackSeo } from "../seo";
import { normalizePathname, routes } from "../routes";

const notFoundPageStyles = String.raw`
  .ex404-page {
    --ex404-surface: rgba(248, 249, 246, 0.82);
    --ex404-surface-strong: rgba(247, 247, 244, 0.94);
    --ex404-border: var(--color-border-soft);
    --ex404-shadow: 0 30px 72px rgba(8, 31, 35, 0.14);
    --ex404-glow: rgba(127, 188, 193, 0.18);
    position: relative;
    padding: 2rem 0 5.5rem;
  }

  .ex404-page::before,
  .ex404-page::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }

  .ex404-page::before {
    background:
      radial-gradient(circle at 18% 18%, var(--ex404-glow) 0, transparent 26%),
      radial-gradient(circle at 82% 20%, rgba(15, 92, 99, 0.1) 0, transparent 30%);
  }

  .ex404-page::after {
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.18), transparent 56%);
  }

  .ex404-shell {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
    gap: 1.5rem;
    align-items: center;
    padding: clamp(1.4rem, 3vw, 2rem);
    border: 1px solid var(--ex404-border);
    border-radius: 2rem;
    background: var(--ex404-surface);
    box-shadow: var(--ex404-shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .ex404-copy {
    display: grid;
    gap: 1.2rem;
  }

  .ex404-brand {
    display: inline-flex;
    align-items: center;
  }

  .ex404-logo {
    display: block;
    height: 2.1rem;
    width: auto;
  }

  .ex404-logo--dark {
    display: none;
  }

  .ex404-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    width: fit-content;
    margin: 0;
    padding: 0.72rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--ex404-border);
    background: rgba(248, 242, 232, 0.78);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.78);
  }

  .ex404-pill span {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: linear-gradient(180deg, var(--color-accent-secondary), var(--color-accent));
  }

  .ex404-code {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(5rem, 13vw, 8.5rem);
    line-height: 0.9;
    letter-spacing: -0.08em;
    color: rgba(17, 35, 37, 0.16);
  }

  .ex404-copy h1 {
    margin: -0.4rem 0 0;
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 6vw, 4.6rem);
    font-weight: 500;
    line-height: 0.94;
    letter-spacing: -0.06em;
  }

  .ex404-lead,
  .ex404-path {
    margin: 0;
    max-width: 34rem;
    line-height: 1.72;
    color: var(--color-text-muted);
  }

  .ex404-path code {
    display: inline-block;
    margin-left: 0.4rem;
    padding: 0.28rem 0.5rem;
    border-radius: 0.65rem;
    border: 1px solid var(--ex404-border);
    background: var(--ex404-surface-strong);
    color: var(--color-text);
    font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", "Consolas", monospace;
    font-size: 0.84rem;
  }

  .ex404-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  .ex404-stage {
    position: relative;
    display: grid;
    gap: 1rem;
    min-height: 29rem;
    padding: 1.35rem;
    border-radius: 1.6rem;
    overflow: hidden;
    border: 1px solid var(--ex404-border);
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.2), transparent 36%),
      linear-gradient(180deg, rgba(249, 243, 234, 0.9), rgba(236, 227, 212, 0.76));
  }

  .ex404-stage::before {
    content: "404";
    position: absolute;
    top: 1.35rem;
    right: 1.2rem;
    font-family: var(--font-display);
    font-size: clamp(4rem, 8vw, 5.8rem);
    line-height: 1;
    letter-spacing: -0.08em;
    color: rgba(17, 35, 37, 0.08);
  }

  .ex404-glow {
    position: absolute;
    inset: auto auto 1.2rem 1rem;
    width: 14rem;
    height: 14rem;
    border-radius: 50%;
    background: rgba(44, 139, 145, 0.16);
    filter: blur(48px);
  }

  .ex404-tile {
    position: relative;
    display: grid;
    gap: 0.35rem;
    width: min(100%, 18rem);
    padding: 1rem 1.05rem;
    border-radius: 1.1rem;
    border: 1px solid var(--ex404-border);
    background: var(--ex404-surface-strong);
    box-shadow: 0 16px 36px rgba(8, 31, 35, 0.08);
  }

  .ex404-tile strong {
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .ex404-tile span {
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  .ex404-tile--primary {
    margin-top: auto;
  }

  .ex404-tile--secondary {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.82);
  }

  .ex404-tile--ghost {
    width: min(100%, 15rem);
    background: rgba(248, 249, 246, 0.68);
  }

  .ex404-ring {
    position: absolute;
    top: 3.2rem;
    right: 2rem;
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 50%;
    border: 1px dashed rgba(15, 92, 99, 0.26);
    background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 64%);
  }

  html[data-theme="dark"] .ex404-page {
    --ex404-surface: rgba(11, 31, 35, 0.88);
    --ex404-surface-strong: rgba(17, 43, 48, 0.9);
    --ex404-shadow: 0 30px 72px rgba(0, 0, 0, 0.28);
    --ex404-glow: rgba(127, 188, 193, 0.12);
  }

  html[data-theme="dark"] .ex404-logo--light {
    display: none;
  }

  html[data-theme="dark"] .ex404-logo--dark {
    display: block;
  }

  html[data-theme="dark"] .ex404-pill {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(237, 247, 247, 0.84);
  }

  html[data-theme="dark"] .ex404-code {
    color: rgba(237, 247, 247, 0.1);
  }

  html[data-theme="dark"] .ex404-lead,
  html[data-theme="dark"] .ex404-path,
  html[data-theme="dark"] .ex404-tile span {
    color: rgba(237, 242, 255, 0.76);
  }

  html[data-theme="dark"] .ex404-path code,
  html[data-theme="dark"] .ex404-tile {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(248, 251, 255, 0.94);
  }

  html[data-theme="dark"] .ex404-stage {
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.24), transparent 36%),
      linear-gradient(180deg, rgba(10, 28, 31, 0.98), rgba(8, 24, 27, 0.94));
  }

  html[data-theme="dark"] .ex404-stage::before {
    color: rgba(237, 247, 247, 0.08);
  }

  html[data-theme="dark"] .ex404-ring {
    border-color: rgba(127, 188, 193, 0.22);
    background: radial-gradient(circle, rgba(127, 188, 193, 0.12), transparent 64%);
  }

  @media (max-width: 960px) {
    .ex404-shell {
      grid-template-columns: 1fr;
    }

    .ex404-stage {
      min-height: 24rem;
    }
  }

  @media (max-width: 720px) {
    .ex404-page {
      padding: 1.5rem 0 4.5rem;
    }

    .ex404-shell {
      padding: 1.1rem;
      border-radius: 1.4rem;
    }

    .ex404-actions {
      flex-direction: column;
    }

    .ex404-actions .landing-cta {
      width: 100%;
    }

    .ex404-stage {
      min-height: auto;
      padding: 1rem;
    }
  }
`;

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
      <style>{notFoundPageStyles}</style>
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
