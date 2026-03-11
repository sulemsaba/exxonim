import { useEffect, useRef } from "react";
import type { BrandAssets } from "../types";
import { routes } from "../routes";

interface FooterProps {
  brand: BrandAssets;
}

const footerAnchorIds = [
  "support",
  "terms",
  "privacy",
] as const;

const quickLinks = [
  { label: "About", href: routes.about },
  { label: "Services", href: routes.services },
  { label: "Track Your Consultation", href: routes.tracking },
  { label: "Help (FAQ)", href: `${routes.resources}#faq` },
  { label: "Blogs", href: routes.resources },
  { label: "Contact", href: routes.contact },
];

const otherResources = [
  { label: "Career", href: routes.career },
  { label: "Support", href: "#support" },
  { label: "Terms of Use", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
];

const footerStyles = String.raw`
.footer-shell{
  position:relative;
  isolation:isolate;
  overflow:hidden;
  z-index:10;
  margin-top:4.5rem;
  border-top:1px solid rgba(255,255,255,.10);
  background:#041214;
  color:#ffffff;
}

.footer-shell,
.footer-shell *{
  box-sizing:border-box;
}

.footer-shell__anchor{
  display:block;
  height:0;
}

.footer-shell__canvas,
.footer-shell__veil{
  position:absolute;
  inset:0;
}

.footer-shell__canvas{
  z-index:0;
  width:100%;
  height:100%;
  pointer-events:none;
}

.footer-shell__veil{
  z-index:1;
  background:rgba(4,18,20,.80);
  backdrop-filter:blur(32px);
  -webkit-backdrop-filter:blur(32px);
  pointer-events:none;
}

.footer-shell__content{
  position:relative;
  z-index:2;
  width:min(1440px, calc(100% - 3rem));
  margin:0 auto;
  padding:5rem 0 3rem;
  pointer-events:none;
}

.footer-shell__grid{
  display:grid;
  grid-template-columns:minmax(0,1.25fr) repeat(3, minmax(0,1fr));
  gap:3rem 2rem;
  pointer-events:auto;
}

.footer-shell__brand-panel{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:1rem;
  max-width:20rem;
}

.footer-shell__brand-link{
  display:inline-flex;
  align-items:center;
  color:#ffffff;
  text-decoration:none;
}

.footer-shell__brand-logo{
  display:block;
  width:min(12rem, 100%);
  height:auto;
  object-fit:contain;
  filter:drop-shadow(0 12px 28px rgba(0,0,0,.28));
}

.footer-shell__tagline{
  margin:0;
  max-width:15rem;
  font-family:"Manrope", sans-serif;
  font-size:.95rem;
  font-weight:500;
  line-height:1.7;
  color:rgba(197,212,214,.78);
}

.footer-shell__cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:2.9rem;
  padding:.85rem 1.35rem;
  border-radius:.85rem;
  background:linear-gradient(90deg, #2c8b91, #86cfd3);
  color:#052326;
  text-decoration:none;
  font-family:"Manrope", sans-serif;
  font-size:.95rem;
  font-weight:800;
  transition:transform 220ms ease, box-shadow 220ms ease;
  box-shadow:0 12px 32px rgba(12,82,88,.28);
}

.footer-shell__cta:hover,
.footer-shell__cta:focus-visible{
  transform:translateY(-2px);
  box-shadow:0 16px 38px rgba(12,82,88,.32);
  outline:none;
}

.footer-shell__column{
  display:grid;
  align-content:start;
  gap:1rem;
}

.footer-shell__eyebrow{
  margin:0;
  font-family:ui-monospace,"SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;
  font-size:.76rem;
  font-weight:800;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(196,222,225,.56);
}

.footer-shell__list{
  margin:0;
  padding:0;
  list-style:none;
  display:grid;
  gap:.8rem;
}

.footer-shell__list a,
.footer-shell__list span{
  display:block;
  font-family:"Manrope", sans-serif;
  font-size:.95rem;
  font-weight:500;
  line-height:1.65;
  color:rgba(188,204,207,.80);
  text-decoration:none;
  transition:color 180ms ease;
}

.footer-shell__list a:hover,
.footer-shell__list a:focus-visible{
  color:#86cfd3;
  outline:none;
}

.footer-shell__list--contact{
  gap:1rem;
}

.footer-shell__contact-item{
  display:grid;
  grid-template-columns:1.1rem minmax(0,1fr);
  gap:.8rem;
  align-items:start;
}

.footer-shell__contact-icon{
  width:1.1rem;
  height:1.1rem;
  margin-top:.2rem;
  color:#86cfd3;
}

.footer-shell__contact-copy--stacked{
  display:grid;
  gap:.2rem;
}

.footer-shell__bottom{
  margin-top:4rem;
  padding-top:1.5rem;
  border-top:1px solid rgba(255,255,255,.10);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
  pointer-events:auto;
}

.footer-shell__bottom p{
  margin:0;
  font-family:"Manrope", sans-serif;
  font-size:.88rem;
  font-weight:500;
  letter-spacing:.04em;
  color:rgba(146,163,166,.78);
}

@media (max-width: 1023px){
  .footer-shell__grid{
    grid-template-columns:repeat(2, minmax(0,1fr));
  }

  .footer-shell__brand-panel{
    max-width:none;
  }
}

@media (max-width: 767px){
  .footer-shell{
    margin-top:4rem;
  }

  .footer-shell__content{
    width:min(1440px, calc(100% - 1.5rem));
    padding:4rem 0 2.5rem;
  }

  .footer-shell__grid{
    grid-template-columns:1fr;
    gap:2.5rem;
  }

  .footer-shell__cta{
    width:100%;
    max-width:20rem;
  }

  .footer-shell__bottom{
    margin-top:3rem;
    flex-direction:column;
    align-items:flex-start;
  }
}
`;

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

function getTileColor(value: number) {
  if (value < 0.05) {
    return "#000000";
  }

  if (value < 0.3) {
    return "#0a2a2e";
  }

  if (value < 0.6) {
    return "#2c8b91";
  }

  return "#86cfd3";
}

export function Footer({ brand }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const gridRef = useRef<number[][]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const columnsRef = useRef(0);
  const rowsRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;

    if (!footer || !canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      return;
    }

    const tileSize = 40;
    const gap = 10;
    const cornerRadius = 8;
    const cell = tileSize + gap;

    const resetPointer = () => {
      pointerRef.current = { x: -1000, y: -1000, active: false };
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
      columnsRef.current = Math.ceil(width / cell) + 1;
      rowsRef.current = Math.ceil(height / cell) + 1;
      gridRef.current = Array.from({ length: columnsRef.current }, () =>
        Array.from({ length: rowsRef.current }, () => 0)
      );
    };

    const startLoop = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(renderFrame);
    };

    const renderFrame = () => {
      animationFrameRef.current = null;

      const { width, height } = sizeRef.current;
      const columns = columnsRef.current;
      const rows = rowsRef.current;
      const grid = gridRef.current;
      const pointer = pointerRef.current;
      let hasEnergy = false;

      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);

      for (let row = 0; row < rows; row += 1) {
        const offsetX = row % 2 === 0 ? 0 : cell / 2;

        for (let column = 0; column < columns; column += 1) {
          const tileX = column * cell + gap / 2 + offsetX;
          const tileY = row * cell + gap / 2;
          let value = grid[column]?.[row] ?? 0;

          if (pointer.active) {
            const dx = pointer.x - (tileX + tileSize / 2);
            const dy = pointer.y - (tileY + tileSize / 2);
            const distance = Math.hypot(dx, dy);

            if (distance < cell * 1.5) {
              value = 1;
            }
          }

          value *= 0.88;

          if (value < 0.005) {
            value = 0;
          }

          grid[column][row] = value;
          hasEnergy = hasEnergy || value > 0;

          context.fillStyle = getTileColor(value);
          roundRectPath(context, tileX, tileY, tileSize, tileSize, cornerRadius);
          context.fill();
        }
      }

      if (pointer.active || hasEnergy) {
        startLoop();
      }
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = footer.getBoundingClientRect();

      pointerRef.current = {
        x: clientX - bounds.left,
        y: clientY - bounds.top,
        active: true,
      };

      startLoop();
    };

    const handlePointerMove = (event: PointerEvent) => {
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
      startLoop();
    };

    initializeCanvas();
    startLoop();

    footer.addEventListener("pointermove", handlePointerMove, { passive: true });
    footer.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    footer.addEventListener("touchmove", handleTouchMove, { passive: true });
    footer.addEventListener("touchend", handlePointerLeave, { passive: true });
    footer.addEventListener("touchcancel", handlePointerLeave, { passive: true });

    const handleResize = () => {
      initializeCanvas();
      startLoop();
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
      }
    };
  }, []);

  return (
    <>
      <style>{footerStyles}</style>

      <footer ref={footerRef} className="footer-shell" id="site-footer">
        {footerAnchorIds.map((anchorId) => (
          <span
            key={anchorId}
            className="footer-shell__anchor"
            id={anchorId}
            aria-hidden="true"
          ></span>
        ))}

        <canvas
          ref={canvasRef}
          className="footer-shell__canvas"
          aria-hidden="true"
        ></canvas>
        <div className="footer-shell__veil" aria-hidden="true"></div>

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
                  src={brand.lightLogoSrc}
                  alt={brand.name}
                  loading="lazy"
                />
              </a>

              <p className="footer-shell__tagline">
                Where Innovation Meets Efficiency.
              </p>

              <a className="footer-shell__cta" href={routes.tracking}>
                Track Your Consultation
              </a>
            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Quick Links</h4>
              <nav aria-label="Footer navigation">
                <ul className="footer-shell__list">
                  {quickLinks.map((link) => (
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
                {otherResources.map((link) => (
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

                  <span>
                    Mbezi Beach B, Africana, Bagamoyo Road, Block no H, House
                    number 9, Dar es Salaam
                  </span>
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
                    <a href="mailto:info@exxonim.tz">info@exxonim.tz</a>
                    <a href="mailto:md@exxonim.tz">md@exxonim.tz</a>
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
                    <a href="tel:+255794689099">+255 794 689 099</a>
                    <a href="tel:+255685525224">+255 685 525 224</a>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <div className="footer-shell__bottom">
            <p>&copy; 2026 Exxonim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
