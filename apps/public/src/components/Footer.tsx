import { useEffect, useRef } from "react";
import { routes } from "../routes";
import type { BrandAssets, CompanyInfo, Theme } from "../types";
import type { SiteSettingFooterValue, SiteSettingSocialLinkValue } from "../types/api";


function roundRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  let safeRadius = radius;

  if (width < safeRadius * 2) {
    safeRadius = width / 2;
  }

  if (height < safeRadius * 2) {
    safeRadius = height / 2;
  }

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

type FooterBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  value: number;
  thresholdOffset: number;
};

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
}

function getTileColor(value: number, theme: Theme) {
  if (theme === "dark") {
    if (value < 0.05) {
      return "#09181c";
    }

    if (value < 0.22) {
      return "#0e252a";
    }

    if (value < 0.5) {
      return "#17363d";
    }

    if (value < 0.82) {
      return "#2d6169";
    }

    return "#9dd7db";
  }

  if (value < 0.05) {
    return "#eef1ec";
  }

  if (value < 0.22) {
    return "#dfe7e3";
  }

  if (value < 0.5) {
    return "#cfddda";
  }

  if (value < 0.82) {
    return "#a7c8cb";
  }

  return "#5f9fa8";
}

function getBlockTarget(dx: number, dy: number, block: FooterBlock, cell: number) {
  const blockDistance = Math.max(
    Math.abs(dx) / (block.width * 0.58 + cell * 0.34),
    Math.abs(dy) / (block.height * 0.58 + cell * 0.34)
  );
  const adjustedDistance = blockDistance + block.thresholdOffset * 0.22;

  if (adjustedDistance <= 0.48) {
    return 1;
  }

  if (adjustedDistance <= 0.9) {
    return 0.74;
  }

  if (adjustedDistance <= 1.3) {
    return 0.44;
  }

  if (adjustedDistance <= 1.82) {
    return 0.18;
  }

  return 0;
}

function socialLabel(link: SiteSettingSocialLinkValue) {
  return link.label?.trim() || link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
}

const footerSocialPlatforms: SiteSettingSocialLinkValue["platform"][] = [
  "linkedin",
  "instagram",
  "x",
];

function renderSocialIcon(platform: SiteSettingSocialLinkValue["platform"]) {
  switch (platform) {
    case "facebook":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 21v-7.2h2.43l.37-2.8H13.5V9.2c0-.81.23-1.36 1.39-1.36H16.4V5.33c-.73-.08-1.47-.12-2.21-.11-2.18 0-3.67 1.33-3.67 3.78V11H8v2.8h2.52V21h2.98Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm8.37 1.73H7.88A4.15 4.15 0 0 0 3.73 7.88v8.24a4.15 4.15 0 0 0 4.15 4.15h8.24a4.15 4.15 0 0 0 4.15-4.15V7.88a4.15 4.15 0 0 0-4.15-4.15Zm-4.12 3.54A4.73 4.73 0 1 1 7.27 12 4.73 4.73 0 0 1 12 7.27Zm0 1.73A3 3 0 1 0 15 12a3 3 0 0 0-3-3Zm5.02-2.62a1.13 1.13 0 1 1-1.13 1.13 1.13 1.13 0 0 1 1.13-1.13Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.94 8.5A1.69 1.69 0 1 0 6.9 5.12a1.69 1.69 0 0 0 .04 3.38ZM5.47 18.88h2.86V9.72H5.47v9.16Zm4.46 0h2.85v-5.11c0-1.35.26-2.66 1.93-2.66 1.65 0 1.67 1.54 1.67 2.75v5.02h2.86v-5.61c0-2.76-.59-4.88-3.82-4.88-1.55 0-2.58.85-3.01 1.65h-.04V9.72H9.93c.04.73 0 9.16 0 9.16Z" />
        </svg>
      );
    case "x":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 4H21l-4.59 5.24L21.8 20h-4.78l-3.74-4.89L9 20H6.88l4.91-5.61L6.6 4h4.9l3.38 4.47L18.9 4Zm-.75 14.7h1.33L10.79 5.2H9.36l8.79 13.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.62 4.6 12 4.6 12 4.6s-5.62 0-7.48.49a2.98 2.98 0 0 0-2.1 2.1A31.3 31.3 0 0 0 2 12a31.3 31.3 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.1c1.86.49 7.48.49 7.48.49s5.62 0 7.48-.49a2.98 2.98 0 0 0 2.1-2.1A31.3 31.3 0 0 0 22 12a31.3 31.3 0 0 0-.42-4.81ZM10.2 15.02V8.98L15.4 12l-5.2 3.02Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.72 3c.18 1.51 1.03 2.99 2.37 3.86.87.57 1.88.88 2.91.91v2.84a8.03 8.03 0 0 1-2.98-.57 7.24 7.24 0 0 1-1.99-1.14v6.08c0 3.22-2.61 5.82-5.83 5.82s-5.82-2.6-5.82-5.82 2.6-5.83 5.82-5.83c.28 0 .56.02.83.06v2.88a2.9 2.9 0 0 0-.83-.12 2.99 2.99 0 1 0 2.99 2.99V3h2.53Z" />
        </svg>
      );
    default:
      return null;
  }
}

interface FooterProps {
  brand: BrandAssets;
  company: CompanyInfo;
  footer: SiteSettingFooterValue;
  theme: Theme;
}

export function Footer({ brand, company, footer, theme }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const blocksRef = useRef<FooterBlock[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;

    if (!footer || !canvas) {
      return;
    }

    const context =
      canvas.getContext("2d", { alpha: false }) ??
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const cell = 54;

    const syncPointerVisuals = (x: string, y: string, active: boolean) => {
      footer.style.setProperty("--footer-pointer-x", x);
      footer.style.setProperty("--footer-pointer-y", y);
      footer.style.setProperty("--footer-spotlight-opacity", active ? "1" : "0");
    };

    const resetPointer = () => {
      pointerRef.current = { x: -1000, y: -1000, active: false };
      syncPointerVisuals("-20%", "-20%", false);
    };

    const initializeCanvas = () => {
      const bounds = footer.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const dpr = window.devicePixelRatio || 1;

      context.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(dpr, dpr);

      sizeRef.current = { width, height };
      const columns = Math.ceil(width / cell) + 2;
      const rows = Math.ceil(height / cell) + 2;
      const blocks: FooterBlock[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const seed = row * 1009 + column * 917;

          const centerX = column * cell + cell / 2;
          const centerY = row * cell + cell / 2;
          const blockSize = cell * 0.78;
          const radius = 5;

          blocks.push({
            x: centerX - blockSize / 2,
            y: centerY - blockSize / 2,
            width: blockSize,
            height: blockSize,
            radius,
            value: 0,
            thresholdOffset: pseudoRandom(seed + 9) - 0.5,
          });
        }
      }

      blocksRef.current = blocks;
    };

    const renderFrame = () => {
      animationFrameRef.current = null;

      const { width, height } = sizeRef.current;
      const blocks = blocksRef.current;
      const pointer = pointerRef.current;
      const computedFooterStyles = getComputedStyle(footer);
      const gridLineColor = computedFooterStyles.getPropertyValue("--footer-grid-line").trim();
      const gridGlowColor = computedFooterStyles.getPropertyValue("--footer-grid-glow").trim();
      let hasEnergy = false;

      context.fillStyle = theme === "dark" ? "#071518" : "#eef0ec";
      context.fillRect(0, 0, width, height);

      for (const block of blocks) {
        let target = 0;

        if (pointer.active) {
          const dx = pointer.x - (block.x + block.width / 2);
          const dy = pointer.y - (block.y + block.height / 2);
          target = getBlockTarget(dx, dy, block, cell);
        }

        const easing = target > block.value ? 0.3 : 0.1;
        block.value += (target - block.value) * easing;

        if (block.value < 0.01) {
          block.value = 0;
        }

        hasEnergy = hasEnergy || block.value > 0;

        context.fillStyle = getTileColor(block.value, theme);
        roundRectPath(context, block.x, block.y, block.width, block.height, block.radius);
        context.fill();

        context.strokeStyle = gridLineColor;
        context.lineWidth = 1;
        roundRectPath(context, block.x, block.y, block.width, block.height, block.radius);
        context.stroke();

        if (block.value > 0.16) {
          context.save();
          context.globalAlpha = Math.min(0.28, block.value * 0.22);
          context.fillStyle = gridGlowColor;
          roundRectPath(
            context,
            block.x - 1.5,
            block.y - 1.5,
            block.width + 3,
            block.height + 3,
            block.radius + 1.5
          );
          context.fill();
          context.restore();
        }
      }

      if (pointer.active || hasEnergy) {
        startLoop();
      }
    };

    const startLoop = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(renderFrame);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = footer.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;

      pointerRef.current = {
        x,
        y,
        active: true,
      };
      syncPointerVisuals(
        `${(x / Math.max(bounds.width, 1)) * 100}%`,
        `${(y / Math.max(bounds.height, 1)) * 100}%`,
        true
      );

      startLoop();
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        return;
      }

      updatePointer(event.touches[0].clientX, event.touches[0].clientY);
    };

    const handlePointerLeave = () => {
      resetPointer();
      renderFrame();
    };

    initializeCanvas();
    renderFrame();

    footer.addEventListener("pointermove", handlePointerMove, { passive: true });
    footer.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    footer.addEventListener("mousemove", handleMouseMove, { passive: true });
    footer.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    footer.addEventListener("touchmove", handleTouchMove, { passive: true });
    footer.addEventListener("touchend", handlePointerLeave, { passive: true });
    footer.addEventListener("touchcancel", handlePointerLeave, { passive: true });

    const handleResize = () => {
      initializeCanvas();
      renderFrame();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(footer);
    } else {
      window.addEventListener("resize", handleResize, { passive: true });
    }

    return () => {
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseleave", handlePointerLeave);
      footer.removeEventListener("touchmove", handleTouchMove);
      footer.removeEventListener("touchend", handlePointerLeave);
      footer.removeEventListener("touchcancel", handlePointerLeave);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      resetPointer();
    };
  }, [theme]);

  const socialLinks = footerSocialPlatforms
    .map((platform) =>
      (footer.social_links ?? []).find(
        (link) => link.platform === platform && link.isActive && link.url.trim()
      )
    )
    .filter((link): link is SiteSettingSocialLinkValue => Boolean(link));

  return (
    <>
<footer
        ref={footerRef}
        className="footer-shell"
        data-theme={theme}
        id="site-footer"
      >
        <div className="footer-shell__content">
          <div className="footer-shell__grid">
            <section className="footer-shell__brand-panel">
              <a
                className="footer-shell__brand-link"
                href={routes.home}
                aria-label={`${brand.name} home`}
              >
                <img
                  className="footer-shell__brand-logo"
                  src={theme === "dark" ? brand.darkLogoSrc : brand.lightLogoSrc}
                  alt={brand.name}
                  loading="lazy"
                />
              </a>

              <p className="footer-shell__tagline">
                {footer.tagline}
              </p>

              <a className="footer-shell__cta" href={footer.primary_cta.href}>
                {footer.primary_cta.label}
              </a>

            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Quick Links</h4>
              <nav aria-label="Footer navigation">
                <ul className="footer-shell__list">
                  {footer.quick_links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Other Resources</h4>
              <ul className="footer-shell__list">
                {footer.other_resources.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Contact Us</h4>
              <ul className="footer-shell__list footer-shell__list--contact">
                <li className="footer-shell__contact-item">
                  <svg
                    className="footer-shell__contact-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <span>{company.address || "Use the contact page for location details."}</span>
                </li>

                <li className="footer-shell__contact-item">
                  <svg
                    className="footer-shell__contact-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 8 7.89 5.26a2 2 0 0 0 2.22 0L21 8"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                    />
                  </svg>

                  <div className="footer-shell__contact-copy--stacked">
                    {company.emails.length ? (
                      company.emails.map((email) => (
                        <a key={email} href={`mailto:${email}`}>
                          {email}
                        </a>
                      ))
                    ) : (
                      <a href={routes.contact}>Use the Exxonim contact page</a>
                    )}
                  </div>
                </li>

                <li className="footer-shell__contact-item">
                  <svg
                    className="footer-shell__contact-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z"
                    />
                  </svg>

                  <div className="footer-shell__contact-copy--stacked">
                    {company.phones.length ? (
                      company.phones.map((phone) => (
                        <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`}>
                          {phone}
                        </a>
                      ))
                    ) : (
                      <a href={routes.contact}>Use the Exxonim contact page</a>
                    )}
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <div className="footer-shell__bottom">
            <p>{footer.copyright}</p>
            <div className="footer-shell__bottom-tools">
              {socialLinks.length ? (
                <div className="footer-shell__bottom-social" aria-label="Social media links">
                  {socialLinks.map((link, index) => (
                    <a
                      key={`${link.platform}-${link.url}-${index}`}
                      className="footer-shell__social-link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={socialLabel(link)}
                      title={socialLabel(link)}
                    >
                      {renderSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              ) : null}
              <button
                className="footer-shell__top-button"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                title="Back to top"
              >
                Top
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
