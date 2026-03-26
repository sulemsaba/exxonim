import { useEffect, useRef } from "react";
import { useSiteSetting } from "../hooks/useSiteSetting";
import { routes } from "../routes";
import type { BrandAssets, CompanyInfo, Theme } from "../types";
import type { SiteSettingFooterValue, SiteSettingSocialLinkValue } from "../types/api";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";

const footerStyles = String.raw`
.footer-shell{
  --footer-border:var(--color-border-soft);
  --footer-surface:var(--color-page-strong);
  --footer-text:var(--color-text);
  --footer-muted:var(--color-text-muted);
  --footer-subtle:var(--color-text-soft);
  --footer-eyebrow:rgba(16,37,41,.56);
  --footer-link-hover:var(--color-accent);
  --footer-cta-bg:var(--color-accent);
  --footer-cta-text:var(--color-accent-contrast);
  --footer-cta-shadow:0 12px 32px rgba(15,92,99,.18);
  --footer-cta-shadow-hover:0 16px 38px rgba(15,92,99,.24);
  --footer-veil:rgba(238,240,236,.18);
  --footer-logo-shadow:drop-shadow(0 10px 22px rgba(8,24,27,.08));
  --footer-tagline-accent:rgba(15,92,99,.52);
  --footer-grid-opacity:.9;
  --footer-grid-line:rgba(16,37,41,.07);
  --footer-grid-glow:rgba(15,92,99,.14);
  --footer-pointer-x:50%;
  --footer-pointer-y:50%;
  --footer-spotlight-opacity:0;
  position:relative;
  isolation:isolate;
  overflow:hidden;
  z-index:10;
  margin-top:4.5rem;
  border-top:1px solid var(--footer-border);
  background:var(--footer-surface);
  color:var(--footer-text);
}

.footer-shell[data-theme="dark"]{
  --footer-border:var(--color-border-soft);
  --footer-surface:var(--color-page-strong);
  --footer-text:var(--color-text);
  --footer-muted:var(--color-text-muted);
  --footer-subtle:var(--color-text-soft);
  --footer-eyebrow:rgba(237,244,242,.54);
  --footer-link-hover:var(--color-accent-secondary);
  --footer-cta-bg:var(--color-accent);
  --footer-cta-text:var(--color-accent-contrast);
  --footer-cta-shadow:0 12px 32px rgba(127,188,193,.16);
  --footer-cta-shadow-hover:0 16px 38px rgba(127,188,193,.2);
  --footer-veil:rgba(7,21,24,.18);
  --footer-logo-shadow:drop-shadow(0 10px 22px rgba(0,0,0,.24));
  --footer-tagline-accent:rgba(127,188,193,.52);
  --footer-grid-opacity:.88;
  --footer-grid-line:rgba(237,244,242,.06);
  --footer-grid-glow:rgba(127,188,193,.14);
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
.footer-shell__spotlight,
.footer-shell__veil{
  position:absolute;
  inset:0;
}

.footer-shell__canvas{
  z-index:0;
  width:100%;
  height:100%;
  pointer-events:none;
  opacity:var(--footer-grid-opacity);
  filter:blur(.2px) saturate(1.08) contrast(1.08);
}

.footer-shell__spotlight{
  display:none;
}

.footer-shell__veil{
  z-index:1;
  background:var(--footer-veil);
  backdrop-filter:blur(4px) saturate(1.02);
  -webkit-backdrop-filter:blur(4px) saturate(1.02);
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
  color:var(--footer-text);
  text-decoration:none;
}

  .footer-shell__brand-logo{
    display:block;
    width:min(14rem, 100%);
    height:auto;
    object-fit:contain;
    filter:var(--footer-logo-shadow);
  }

.footer-shell__tagline{
  margin:0;
  max-width:15rem;
  position:relative;
  display:inline-block;
  font-family:var(--font-display);
  font-size:.95rem;
  font-weight:500;
  font-style:italic;
  line-height:1.7;
  color:var(--footer-subtle);
  animation:footer-tagline-float 5.8s ease-in-out infinite;
}

.footer-shell__tagline::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-.18rem;
  width:100%;
  height:1px;
  background:linear-gradient(90deg, transparent 0%, var(--footer-tagline-accent) 20%, transparent 100%);
  transform-origin:left center;
  animation:footer-tagline-line 4.8s ease-in-out infinite;
  opacity:.35;
  pointer-events:none;
}

@keyframes footer-tagline-float{
  0%,100%{
    transform:translateY(0);
    opacity:1;
  }

  50%{
    transform:translateY(-2px);
    opacity:.92;
  }
}

@keyframes footer-tagline-line{
  0%,100%{
    transform:scaleX(.45);
    opacity:.14;
  }

  50%{
    transform:scaleX(1);
    opacity:.5;
  }
}

@media (prefers-reduced-motion: reduce){
  .footer-shell__tagline,
  .footer-shell__tagline::after{
    animation:none;
  }
}

.footer-shell__cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:2.9rem;
  padding:.85rem 1.35rem;
  border-radius:.85rem;
  background:var(--footer-cta-bg);
  color:var(--footer-cta-text);
  text-decoration:none;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.95rem;
  font-weight:800;
  transition:transform 220ms ease, box-shadow 220ms ease;
  box-shadow:var(--footer-cta-shadow);
}

.footer-shell__cta:hover,
.footer-shell__cta:focus-visible{
  transform:translateY(-2px);
  box-shadow:var(--footer-cta-shadow-hover);
  outline:none;
}

.footer-shell__social{
  display:grid;
  gap:.85rem;
  margin-top:.45rem;
  width:100%;
}

  .footer-shell__social-row{
    display:flex;
    flex-wrap:wrap;
    gap:.6rem;
    align-items:center;
  }

  .footer-shell__social-link{
    display:flex;
    align-items:center;
    justify-content:center;
    width:2rem;
    height:2rem;
    color:var(--footer-text);
    text-decoration:none;
    transition:color 180ms ease;
  }

  .footer-shell__social-link svg{
    width:1.25rem;
    height:1.25rem;
    flex-shrink:0;
    fill:currentColor;
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
  color:var(--footer-eyebrow);
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
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.95rem;
  font-weight:500;
  line-height:1.65;
  color:var(--footer-muted);
  text-decoration:none;
  transition:color 180ms ease;
}

.footer-shell__list a:hover,
.footer-shell__list a:focus-visible{
  color:var(--footer-link-hover);
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
  color:var(--footer-link-hover);
}

.footer-shell__contact-copy--stacked{
  display:grid;
  gap:.2rem;
}

.footer-shell__bottom{
  margin-top:4rem;
  padding-top:1.5rem;
  border-top:1px solid var(--footer-border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
  pointer-events:auto;
}

.footer-shell__bottom p{
  margin:0;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.88rem;
  font-weight:500;
  letter-spacing:.04em;
  color:var(--footer-muted);
}

.footer-shell__bottom-tools{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:1rem;
  margin-left:auto;
}

.footer-shell__bottom-social{
  display:flex;
  align-items:center;
  gap:.75rem;
}

.footer-shell__top-button{
  width:2.9rem;
  height:2.9rem;
  border-radius:999px;
  border:none;
  background:rgba(255,255,255,0.6);
  color:var(--footer-text);
  font-size:0.7rem;
  letter-spacing:0.25em;
  text-transform:uppercase;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 12px 28px rgba(0,0,0,.15);
  cursor:pointer;
  transition:transform 180ms ease, background 180ms ease;
}

.footer-shell__top-button:hover,
.footer-shell__top-button:focus-visible{
  transform:translateY(-2px);
  background:var(--footer-border);
  color:var(--footer-cta-text);
  outline:none;
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

  .footer-shell__bottom-tools{
    width:100%;
    justify-content:space-between;
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

export function Footer({ theme }: { theme: Theme }) {
  const {
    data: brandSetting,
    isPending: brandPending,
    error: brandError,
  } = useSiteSetting<BrandAssets>("brand");
  const {
    data: footerSetting,
    isPending: footerPending,
    error: footerError,
  } = useSiteSetting<SiteSettingFooterValue>("footer");
  const {
    data: companySetting,
    isPending: companyPending,
    error: companyError,
  } = useSiteSetting<CompanyInfo>("company_info");
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

  if (brandPending || footerPending || companyPending) {
    return <LoadingSpinner compact label="Loading footer..." />;
  }

  if (brandError || footerError || companyError || !brandSetting || !footerSetting || !companySetting) {
    return (
      <ErrorMessage
        compact={true}
        title="Unable to load the footer."
        detail="Check that the site settings API is available."
      />
    );
  }

  const brand = brandSetting.value;
  const footer = footerSetting.value;
  const company = companySetting.value;
  const socialLinks = footerSocialPlatforms
    .map((platform) =>
      (footer.social_links ?? []).find(
        (link) => link.platform === platform && link.isActive && link.url.trim()
      )
    )
    .filter((link): link is SiteSettingSocialLinkValue => Boolean(link));

  return (
    <>
      <style>{footerStyles}</style>

      <footer
        ref={footerRef}
        className="footer-shell"
        data-theme={theme}
        id="site-footer"
      >
        <canvas
          ref={canvasRef}
          className="footer-shell__canvas"
          aria-hidden="true"
        ></canvas>
        <div className="footer-shell__spotlight" aria-hidden="true"></div>
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

                  <span>
                    {company.address}
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
                    {company.emails.map((email) => (
                      <a key={email} href={`mailto:${email}`}>
                        {email}
                      </a>
                    ))}
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
                    {company.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`}>
                        {phone}
                      </a>
                    ))}
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
