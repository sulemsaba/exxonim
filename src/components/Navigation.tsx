import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { normalizePathname, routes } from "../routes";
import type { Theme } from "../types";

interface NavigationProps {
  pathname: string;
  theme: Theme;
  onToggleTheme: () => void;
}

type MenuKey = "services" | "resources";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuColumn {
  title: string;
  items: MenuItem[];
  borderLeft?: boolean;
}

const desktopLinks = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Career", href: routes.career },
  { label: "Contact", href: routes.contact },
] as const;

const servicesColumns: MenuColumn[] = [
  {
    title: "Registration & Setup",
    items: [
      { label: "Company Registration", href: `${routes.services}#company` },
      { label: "Business Name Registration", href: `${routes.services}#business-name` },
      { label: "NGO / Organization Registration", href: `${routes.services}#ngo` },
      { label: "Trademark Registration", href: `${routes.services}#trademark` },
    ],
  },
  {
    title: "Tax, Licensing & BOT",
    borderLeft: true,
    items: [
      { label: "TIN Application", href: `${routes.services}#tin` },
      { label: "Annual Statutory Returns", href: `${routes.services}#returns` },
      { label: "Business License Applications", href: `${routes.services}#license` },
      { label: "BOT / Central Bank Licensing", href: `${routes.services}#bot` },
    ],
  },
  {
    title: "Institutional & Support",
    borderLeft: true,
    items: [
      { label: "CRB / ERB Registration", href: `${routes.services}#crb` },
      { label: "OSHA Registration", href: `${routes.services}#osha` },
      { label: "NSSF / WCF Registration", href: `${routes.services}#nssf` },
      { label: "Business Plan Preparation", href: `${routes.services}#plan` },
    ],
  },
];

const resourcesColumns: MenuColumn[] = [
  {
    title: "Insights",
    items: [
      { label: "Blog", href: `${routes.resources}#resources` },
      { label: "Case Examples", href: `${routes.tracking}#case-examples` },
    ],
  },
  {
    title: "Company",
    borderLeft: true,
    items: [
      { label: "Sectors", href: `${routes.home}#industries` },
      { label: "FAQ", href: routes.faq },
    ],
  },
];

const mobileServices = [
  { label: "Company Registration", href: `${routes.services}#company` },
  { label: "TIN Application", href: `${routes.services}#tin` },
  { label: "Business Licensing", href: `${routes.services}#license` },
] as const;

const mobileResources = [
  { label: "Blog", href: `${routes.resources}#resources` },
  { label: "FAQ", href: routes.faq },
] as const;

const navigationStyles = String.raw`
.nav-shell,
.nav-shell__mobile{
  --nav-mono:ui-monospace,"SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;
  --nav-sans:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --nav-ease:cubic-bezier(.25,1,.25,1);
  --nav-pill-bg:rgba(0,0,0,.06);
  --nav-pill-border:rgba(0,0,0,.05);
  --nav-pill-text:#112325;
  --nav-pill-active-bg:#fff;
  --nav-pill-active-text:#041214;
  --nav-glass-bg:rgba(252,254,255,.95);
  --nav-glass-border:rgba(9,68,73,.1);
  --nav-glass-shadow:0 28px 60px rgba(9,68,73,.14);
  --nav-muted-text:#6b7280;
  --nav-primary-text:#1f2937;
  --nav-divider:rgba(0,0,0,.05);
  --nav-hover-surface:rgba(0,0,0,.05);
  --nav-secondary-border:rgba(0,0,0,.1);
  --nav-secondary-text:#111827;
  --nav-secondary-hover:rgba(0,0,0,.05);
  --nav-primary-cta-bg:#041214;
  --nav-primary-cta-text:#fff;
  --nav-primary-cta-hover:#094449;
  --nav-utility-bg:rgba(255,255,255,.6);
  --nav-utility-bg-hover:#fff;
  --nav-utility-border:rgba(0,0,0,.08);
  --nav-utility-text:#111827;
  --nav-mobile-card-bg:rgba(255,255,255,.4);
  --nav-mobile-card-border:rgba(0,0,0,.05);
  --nav-mobile-overlay:rgba(4,18,20,.24);
}

html[data-theme="dark"] .nav-shell,
html[data-theme="dark"] .nav-shell__mobile,
.nav-shell[data-theme="dark"],
.nav-shell__mobile[data-theme="dark"]{
  --nav-pill-bg:rgba(255,255,255,.1);
  --nav-pill-border:rgba(255,255,255,.1);
  --nav-pill-text:rgba(255,255,255,.8);
  --nav-pill-active-bg:#000;
  --nav-pill-active-text:#fff;
  --nav-glass-bg:rgba(17,22,24,.95);
  --nav-glass-border:rgba(255,255,255,.12);
  --nav-glass-shadow:0 24px 60px rgba(0,0,0,.5);
  --nav-muted-text:#9ca3af;
  --nav-primary-text:#e5e7eb;
  --nav-divider:rgba(255,255,255,.1);
  --nav-hover-surface:rgba(255,255,255,.1);
  --nav-secondary-border:rgba(255,255,255,.1);
  --nav-secondary-text:#fff;
  --nav-secondary-hover:rgba(255,255,255,.1);
  --nav-primary-cta-bg:#fff;
  --nav-primary-cta-text:#041214;
  --nav-primary-cta-hover:#e5e7eb;
  --nav-utility-bg:rgba(0,0,0,.3);
  --nav-utility-bg-hover:rgba(255,255,255,.1);
  --nav-utility-border:rgba(255,255,255,.1);
  --nav-utility-text:#fff;
  --nav-mobile-card-bg:rgba(255,255,255,.05);
  --nav-mobile-card-border:rgba(255,255,255,.1);
  --nav-mobile-overlay:rgba(0,0,0,.45);
}

.nav-shell{
  position:fixed;
  inset:0 0 auto 0;
  z-index:50;
  padding:15px 16px;
  font-family:var(--nav-sans);
}

.nav-shell__mobile{
  font-family:var(--nav-sans);
}

.nav-shell *,
.nav-shell__mobile *{
  box-sizing:border-box;
}

.nav-shell button,
.nav-shell__mobile button{
  font:inherit;
  border:0;
  padding:0;
  background:none;
}

.nav-shell__bar{
  width:min(1600px,100%);
  margin:0 auto;
  display:grid;
  grid-template-columns:auto minmax(0,1fr) auto;
  align-items:center;
  gap:12px;
}

.nav-shell__brand{
  display:inline-flex;
  align-items:center;
  flex-shrink:0;
  padding-left:8px;
  text-decoration:none;
}

.nav-shell__logo{
  display:block;
  height:36px;
  width:auto;
}

.nav-shell__logo--dark{
  display:none;
}

html[data-theme="dark"] .nav-shell__logo--light{
  display:none;
}

html[data-theme="dark"] .nav-shell__logo--dark{
  display:block;
}

.nav-shell__desktop{
  display:none;
  min-width:0;
  justify-content:center;
  justify-self:center;
  padding-inline:12px;
}

.nav-shell__pill{
  display:inline-flex;
  align-items:center;
  height:44px;
  padding:3.2px;
  border-radius:11.2px;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  background:var(--nav-pill-bg);
  border:1px solid var(--nav-pill-border);
}

.nav-shell__pill,
.nav-shell__tab,
.nav-shell__link,
.nav-shell__trigger,
.nav-shell__chevron,
.nav-shell__menu,
.nav-shell__menu-card,
.nav-shell__menu-column,
.nav-shell__menu-link,
.nav-shell__menu-footer,
.nav-shell__cta-primary,
.nav-shell__cta-secondary,
.tutorial-toggle,
.tutorial-toggle__orb,
.tutorial-toggle__icon,
.nav-shell__call-button,
.nav-shell__call-label,
.nav-shell__call-number,
.nav-shell__toggle,
.nav-shell__mobile,
.nav-shell__mobile-backdrop,
.nav-shell__mobile-panel,
.nav-shell__mobile-quick-link,
.nav-shell__mobile-card,
.nav-shell__mobile-card-title,
.nav-shell__mobile-card-link,
.nav-shell__mobile-card-primary,
.nav-shell__mobile-card-secondary,
.nav-shell__mobile-bottom-link,
.nav-shell__mobile-bottom-label,
.nav-shell__mobile-bottom-number{
  transition:
    background-color .3s ease,
    border-color .3s ease,
    color .3s ease,
    box-shadow .3s ease,
  opacity .3s ease,
  transform .3s var(--nav-ease);
}

.nav-shell__tab,
a.nav-shell__tab.nav-shell__link,
.nav-shell__tab.nav-shell__trigger{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex:0 0 auto;
  gap:6px;
  height:36px;
  padding:0 14.4px;
  border-radius:7.2px;
  background:transparent;
  font-family:var(--nav-mono);
  font-size:11.52px;
  font-weight:700;
  letter-spacing:.045em;
  text-transform:uppercase;
  text-decoration:none;
  white-space:nowrap;
  line-height:1;
  color:var(--nav-pill-text);
  cursor:pointer;
  appearance:none;
  -webkit-appearance:none;
}

.nav-shell__trigger{
  border:0;
  background:transparent;
}

.nav-shell__tab:hover,
.nav-shell__tab:focus-visible,
.nav-shell__tab[data-active="true"]{
  background:var(--nav-pill-active-bg);
  color:var(--nav-pill-active-text);
  box-shadow:0 1px 3px rgba(0,0,0,.1);
  outline:none;
}

.nav-shell__dropdown{
  position:relative;
  display:flex;
  align-items:center;
  flex:0 0 auto;
  height:100%;
}

.nav-shell__chevron{
  width:12px;
  height:12px;
  opacity:.6;
}

.nav-shell__tab:hover .nav-shell__chevron,
.nav-shell__tab:focus-visible .nav-shell__chevron,
.nav-shell__tab[data-active="true"] .nav-shell__chevron{
  opacity:1;
}

.nav-shell__trigger[aria-expanded="true"] .nav-shell__chevron,
.nav-shell__trigger[data-open="true"] .nav-shell__chevron{
  transform:rotate(-180deg);
}

.nav-shell__menu{
  position:absolute;
  top:100%;
  left:50%;
  transform:translateX(-50%) translateY(8px);
  width:520px;
  padding-top:13.6px;
  visibility:hidden;
  opacity:0;
  pointer-events:none;
  z-index:100;
}

.nav-shell__menu[data-open="true"]{
  visibility:visible;
  opacity:1;
  pointer-events:auto;
  transform:translateX(-50%) translateY(0);
}

.nav-shell__menu--services{
  width:780px;
}

.nav-shell__menu-card,
.nav-shell__mobile-panel{
  font-family:var(--nav-sans);
  text-transform:none;
  letter-spacing:normal;
  backdrop-filter:blur(30px) saturate(155%);
  -webkit-backdrop-filter:blur(30px) saturate(155%);
  background:var(--nav-glass-bg);
  border:1px solid var(--nav-glass-border);
  box-shadow:var(--nav-glass-shadow);
}

.nav-shell__menu-card{
  padding:20px;
  border-radius:22px;
}

.nav-shell__menu-grid{
  display:grid;
  gap:24px;
}

.nav-shell__menu-grid--services{
  grid-template-columns:repeat(3,minmax(0,1fr));
}

.nav-shell__menu-grid--resources{
  grid-template-columns:repeat(2,minmax(0,1fr));
}

.nav-shell__menu-column{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.nav-shell__menu-column[data-border="true"]{
  padding-left:24px;
  border-left:1px solid var(--nav-divider);
}

.nav-shell__menu-title{
  margin:0;
  font-family:var(--nav-sans);
  font-size:12px;
  font-weight:700;
  letter-spacing:.05em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__menu-list{
  display:flex;
  flex-direction:column;
  gap:4px;
  margin:0;
  padding:0;
  list-style:none;
}

.nav-shell__menu-link{
  display:block;
  margin:0 -12px;
  padding:6px 12px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:14px;
  font-weight:600;
  line-height:1.45;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__menu-link:hover,
.nav-shell__menu-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__menu-footer{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:20px;
  padding-top:16px;
  border-top:1px solid var(--nav-divider);
}

.nav-shell__cta-primary,
.nav-shell__cta-secondary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 16px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:12px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
  text-decoration:none;
}

.nav-shell__cta-primary{
  background:var(--nav-primary-cta-bg);
  color:var(--nav-primary-cta-text);
}

.nav-shell__cta-primary:hover,
.nav-shell__cta-primary:focus-visible{
  background:var(--nav-primary-cta-hover);
  outline:none;
}

.nav-shell__cta-secondary{
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
}

.nav-shell__cta-secondary:hover,
.nav-shell__cta-secondary:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  flex-wrap:nowrap;
  gap:8px;
  flex-shrink:0;
  min-width:max-content;
  padding-right:8px;
}

.tutorial-toggle.nav-shell__theme-desktop{
  display:none;
}

.tutorial-toggle.nav-shell__theme-mobile{
  display:flex;
}

.tutorial-toggle{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:48px;
  height:48px;
  border-radius:14px;
  background:rgba(255,255,255,.58);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 10px 24px rgba(9,68,73,.08), inset 0 1px 0 rgba(255,255,255,.55);
  cursor:pointer;
  font-family:var(--nav-sans);
  color:#0c6069;
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
}

.tutorial-toggle--mobile{
  width:44px;
  height:44px;
  border-radius:12px;
}

html[data-theme="dark"] .tutorial-toggle,
.tutorial-toggle[data-theme="dark"]{
  background:linear-gradient(180deg, rgba(5,25,28,.96), rgba(1,14,17,.98));
  border-color:rgba(87,184,196,.18);
  box-shadow:0 12px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
  color:#e9feff;
}

.tutorial-toggle:hover,
.tutorial-toggle:focus-visible{
  transform:translateY(-1px);
  border-color:rgba(9,68,73,.18);
  outline:none;
}

html[data-theme="dark"] .tutorial-toggle:hover,
html[data-theme="dark"] .tutorial-toggle:focus-visible,
.tutorial-toggle[data-theme="dark"]:hover,
.tutorial-toggle[data-theme="dark"]:focus-visible{
  border-color:rgba(111,232,245,.28);
}

.tutorial-toggle__orb{
  display:flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border-radius:12px;
  background:rgba(9,68,73,.08);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.48);
}

.tutorial-toggle--mobile .tutorial-toggle__orb{
  width:30px;
  height:30px;
  border-radius:10px;
}

html[data-theme="dark"] .tutorial-toggle__orb,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__orb{
  background:rgba(71,185,197,.1);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
}

.tutorial-toggle__icon{
  position:absolute;
  width:18px;
  height:18px;
  transition:opacity .24s ease, transform .24s var(--nav-ease);
}

.tutorial-toggle__icon--sun{
  opacity:1;
  transform:scale(1) rotate(0deg);
}

.tutorial-toggle__icon--moon{
  opacity:0;
  transform:scale(.72) rotate(-18deg);
}

html[data-theme="dark"] .tutorial-toggle__icon--sun,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__icon--sun{
  opacity:0;
  transform:scale(.72) rotate(18deg);
}

html[data-theme="dark"] .tutorial-toggle__icon--moon,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__icon--moon{
  opacity:1;
  transform:scale(1) rotate(0deg);
}

.nav-shell__call-button{
  display:none;
  align-items:center;
  flex:0 0 auto;
  gap:12px;
  height:44px;
  padding:4px 18px 4px 8px;
  border-radius:16px;
  position:relative;
  overflow:hidden;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  background:rgba(255,255,255,.72);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 14px 30px rgba(9,68,73,.12), inset 0 1px 0 rgba(255,255,255,.58);
  text-decoration:none;
  white-space:nowrap;
}

.nav-shell__call-button::after{
  content:"";
  position:absolute;
  top:-40%;
  bottom:-40%;
  left:-58%;
  width:42%;
  background:linear-gradient(90deg, transparent, rgba(111,232,245,.18), transparent);
  transform:skewX(-22deg);
  animation:call-shimmer 4.5s linear infinite;
}

.nav-shell__call-button:hover,
.nav-shell__call-button:focus-visible{
  transform:translateY(-1px);
  border-color:rgba(12,96,105,.16);
  box-shadow:0 18px 36px rgba(9,68,73,.16), inset 0 1px 0 rgba(255,255,255,.64);
  outline:none;
}

.nav-shell__call-icon{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  border-radius:999px;
  background:linear-gradient(180deg, #1eb2bd, #0e8d97);
  color:#fff;
  box-shadow:0 10px 18px rgba(18,166,179,.28);
  z-index:1;
}

.nav-shell__call-icon::after{
  content:"";
  position:absolute;
  inset:-5px;
  border-radius:inherit;
  border:1px solid rgba(69,203,215,.44);
  opacity:0;
  animation:call-ping 1.85s ease-out infinite;
}

.nav-shell__call-icon svg{
  width:14px;
  height:14px;
}

.nav-shell__call-copy{
  display:flex;
  flex-direction:column;
  min-width:max-content;
  text-align:left;
  white-space:nowrap;
  position:relative;
  z-index:1;
}

.nav-shell__call-label{
  margin-bottom:2px;
  font-family:var(--nav-mono);
  font-size:8.8px;
  font-weight:700;
  line-height:1;
  letter-spacing:.05em;
  text-transform:uppercase;
  color:rgba(17,35,37,.56);
}

.nav-shell__call-number{
  display:block;
  font-family:var(--nav-sans);
  font-size:12.8px;
  font-weight:800;
  line-height:1.05;
  letter-spacing:.01em;
  white-space:nowrap;
  color:#112325;
}

html[data-theme="dark"] .nav-shell__call-button,
.nav-shell[data-theme="dark"] .nav-shell__call-button{
  background:rgba(255,255,255,.72);
  border-color:rgba(0,0,0,.08);
  box-shadow:0 14px 30px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.58);
}

html[data-theme="dark"] .nav-shell__call-button:hover,
html[data-theme="dark"] .nav-shell__call-button:focus-visible,
.nav-shell[data-theme="dark"] .nav-shell__call-button:hover,
.nav-shell[data-theme="dark"] .nav-shell__call-button:focus-visible{
  border-color:rgba(12,96,105,.16);
  box-shadow:0 18px 36px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.64);
}

html[data-theme="dark"] .nav-shell__call-label,
.nav-shell[data-theme="dark"] .nav-shell__call-label{
  color:rgba(17,35,37,.56);
}

html[data-theme="dark"] .nav-shell__call-number,
.nav-shell[data-theme="dark"] .nav-shell__call-number{
  color:#112325;
}

.nav-shell__toggle{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:44px;
  height:44px;
  border-radius:12px;
  border:1px solid rgba(0,0,0,.1);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
  background:rgba(255,255,255,.55);
  color:#111827;
  box-shadow:0 1px 2px rgba(0,0,0,.05);
  cursor:pointer;
}

.nav-shell__toggle:hover,
.nav-shell__toggle:focus-visible{
  background:rgba(255,255,255,.75);
  outline:none;
}

.nav-shell__toggle.is-open{
  background:#041214;
  color:#fff;
  border-color:rgba(255,255,255,.1);
  box-shadow:0 10px 25px rgba(4,18,20,.24);
}

html[data-theme="dark"] .nav-shell__toggle{
  border-color:rgba(255,255,255,.1);
  background:rgba(255,255,255,.1);
  color:#fff;
}

html[data-theme="dark"] .nav-shell__toggle:hover,
html[data-theme="dark"] .nav-shell__toggle:focus-visible{
  background:rgba(255,255,255,.15);
}

.nav-shell__toggle svg{
  width:24px;
  height:24px;
}

.nav-shell__toggle-icon--close{
  display:none;
}

.nav-shell__toggle.is-open .nav-shell__toggle-icon--menu{
  display:none;
}

.nav-shell__toggle.is-open .nav-shell__toggle-icon--close{
  display:block;
}

.nav-shell__mobile{
  position:fixed;
  inset:0;
  z-index:60;
  visibility:hidden;
  opacity:0;
  pointer-events:none;
}

.nav-shell__mobile[data-open="true"]{
  visibility:visible;
  opacity:1;
  pointer-events:auto;
}

.nav-shell__mobile-backdrop{
  position:absolute;
  inset:0;
  background:var(--nav-mobile-overlay);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
  opacity:0;
}

.nav-shell__mobile[data-open="true"] .nav-shell__mobile-backdrop{
  opacity:1;
}

.nav-shell__mobile-wrap{
  position:relative;
  display:flex;
  min-height:100%;
  align-items:flex-start;
  justify-content:flex-end;
  padding:84px 16px 16px;
  pointer-events:none;
}

.nav-shell__mobile-panel{
  position:relative;
  width:100%;
  max-width:24rem;
  max-height:calc(100dvh - 6.25rem);
  overflow-y:auto;
  border-radius:24px;
  padding:16px;
  pointer-events:auto;
  box-shadow:var(--nav-glass-shadow);
  transform:translateX(28px) scale(.985);
  opacity:0;
}

.nav-shell__mobile[data-open="true"] .nav-shell__mobile-panel{
  transform:translateX(0) scale(1);
  opacity:1;
}

.nav-shell__mobile-grid{
  display:grid;
  gap:20px;
}

.nav-shell__mobile-quick-links{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:8px;
}

.nav-shell__mobile-quick-link{
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:12px;
  padding:12px 8px;
  font-family:var(--nav-sans);
  font-size:12.48px;
  font-weight:700;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__mobile-quick-link:hover,
.nav-shell__mobile-quick-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__mobile-card{
  border-radius:16px;
  border:1px solid var(--nav-mobile-card-border);
  background:var(--nav-mobile-card-bg);
  padding:16px;
}

.nav-shell__mobile-card-title{
  margin:0;
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.16em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__mobile-card-links{
  display:grid;
  gap:8px;
  margin-top:12px;
}

.nav-shell__mobile-card-link{
  display:block;
  padding:8px 12px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:14px;
  font-weight:600;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__mobile-card-link:hover,
.nav-shell__mobile-card-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__mobile-card-actions{
  display:grid;
  gap:8px;
  margin-top:16px;
}

.nav-shell__mobile-card-primary,
.nav-shell__mobile-card-secondary,
.nav-shell__mobile-bottom-link{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}

.nav-shell__mobile-card-primary{
  padding:8px 16px;
  border-radius:12px;
  background:var(--nav-primary-cta-bg);
  color:var(--nav-primary-cta-text);
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.nav-shell__mobile-card-primary:hover,
.nav-shell__mobile-card-primary:focus-visible{
  background:var(--nav-primary-cta-hover);
  outline:none;
}

.nav-shell__mobile-card-secondary{
  padding:8px 16px;
  border-radius:12px;
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.nav-shell__mobile-card-secondary:hover,
.nav-shell__mobile-card-secondary:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__mobile-bottom{
  display:grid;
  gap:12px;
}

.nav-shell__mobile-bottom-link{
  flex-direction:column;
  padding:12px 16px;
  border-radius:12px;
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
}

.nav-shell__mobile-bottom-link:hover,
.nav-shell__mobile-bottom-link:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__mobile-bottom-label{
  font-family:var(--nav-mono);
  font-size:10.88px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__mobile-bottom-number{
  margin-top:4px;
  font-family:var(--nav-sans);
  font-size:16px;
  font-weight:800;
  color:var(--nav-secondary-text);
}

.nav-shell__sr-only{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}

@keyframes phone-ring{
  0%,100%{transform:rotate(0)}
  10%{transform:rotate(15deg)}
  20%{transform:rotate(-10deg)}
  30%{transform:rotate(15deg)}
  40%{transform:rotate(-10deg)}
  50%{transform:rotate(0)}
}

@keyframes call-ping{
  0%{transform:scale(.92);opacity:0}
  30%{opacity:.7}
  100%{transform:scale(1.42);opacity:0}
}

@keyframes call-shimmer{
  0%{transform:translateX(0) skewX(-22deg)}
  100%{transform:translateX(420%) skewX(-22deg)}
}

.animate-ring{
  animation:phone-ring 2s ease-in-out infinite;
  transform-origin:center;
}

@media (min-width:640px){
  .nav-shell__actions{gap:12px}
  .nav-shell__mobile-wrap{padding:88px 20px 16px}
  .nav-shell__mobile-card-actions{grid-template-columns:repeat(2,minmax(0,1fr))}
  .nav-shell__mobile-panel{max-width:25rem;padding:20px}
}

@media (min-width:768px){
  .tutorial-toggle.nav-shell__theme-desktop{display:flex}
  .tutorial-toggle.nav-shell__theme-mobile{display:none}
  .nav-shell__mobile-panel{max-width:27rem;max-height:calc(100dvh - 6.75rem)}
}

@media (min-width:1280px){
  .nav-shell{padding:15px 16px}
  .nav-shell__desktop{display:flex}
  .nav-shell__toggle{display:none}
  .nav-shell__mobile{display:none!important}
}

@media (min-width:1280px) and (max-width:1399px){
  .nav-shell__bar{grid-template-columns:auto minmax(0,1fr) auto;gap:8px}
  .nav-shell__desktop{justify-self:stretch;padding-inline:8px}
  .nav-shell__pill{max-width:100%}
  .nav-shell__tab{padding:0 12px}
  .nav-shell__actions{justify-self:end;gap:8px;padding-right:0}
  .nav-shell__call-button{display:none}
}

@media (min-width:1400px){
  .nav-shell__bar{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}
  .nav-shell__brand{justify-self:start}
  .nav-shell__desktop{justify-self:center;padding-inline:0}
  .nav-shell__actions{justify-self:end}
  .nav-shell__call-button{display:flex}
}
`;

function renderThemeToggle(className: string, theme: Theme, onToggleTheme: () => void) {
  return (
    <button
      className={className}
      type="button"
      data-theme={theme}
      aria-pressed={theme === "dark"}
      onClick={onToggleTheme}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <span className="tutorial-toggle__orb" aria-hidden="true">
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--sun" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.22 3.22a1 1 0 0 1 1.415 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM18 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm-3.78 5.364a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM10 18a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-4.22-3.22a1 1 0 0 1-1.415 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM2 10a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1.78-4.586a1 1 0 0 1 0-1.414l.707-.707A1 1 0 0 1 5.903 4.72l-.707.707a1 1 0 0 1-1.414 0ZM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            clipRule="evenodd"
          />
        </svg>
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--moon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8 8 0 1 0 10.586 10.586Z" />
        </svg>
      </span>
    </button>
  );
}

function renderMenuColumns(columns: MenuColumn[], onNavigate: () => void) {
  return columns.map((column) => (
    <div
      key={column.title}
      className="nav-shell__menu-column"
      data-border={column.borderLeft ? "true" : undefined}
    >
      <h3 className="nav-shell__menu-title">{column.title}</h3>
      <ul className="nav-shell__menu-list">
        {column.items.map((item) => (
          <li key={item.href}>
            <a className="nav-shell__menu-link" href={item.href} onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ));
}

function getHrefPath(href: string) {
  return normalizePathname(href.split("#")[0]);
}

export function Navigation({ pathname, theme, onToggleTheme }: NavigationProps) {
  const headerRef = useRef<HTMLElement>(null);
  const servicesMenuId = useId();
  const resourcesMenuId = useId();
  const mobileMenuId = useId();

  const currentPath = normalizePathname(pathname);
  const [desktopMenu, setDesktopMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(syncHeaderHeight);
      observer.observe(header);

      return () => {
        observer.disconnect();
        document.documentElement.style.setProperty("--header-height", "0px");
      };
    }

    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      window.removeEventListener("resize", syncHeaderHeight);
      document.documentElement.style.setProperty("--header-height", "0px");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
      setDesktopMenu(null);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopMenu(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => getHrefPath(href) === currentPath;
  const servicesActive = currentPath === normalizePathname(routes.services);
  const resourcesActive = currentPath === normalizePathname(routes.resources);

  const closeAllMenus = () => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  };

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setDesktopMenu(null);
  };

  return (
    <>
      <style>{navigationStyles}</style>

      <header ref={headerRef} className="nav-shell" data-theme={theme}>
        <div className="nav-shell__bar">
          <a className="nav-shell__brand" href={routes.home} onClick={closeAllMenus}>
            <img className="nav-shell__logo nav-shell__logo--light" src="/exxonim-logo.webp" alt="Exxonim" />
            <img className="nav-shell__logo nav-shell__logo--dark" src="/logo-dark.png" alt="" aria-hidden="true" />
          </a>

          <div className="nav-shell__desktop">
            <nav className="nav-shell__pill" aria-label="Primary navigation">
              {desktopLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("services")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("services")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.services}
                  data-active={servicesActive}
                  data-open={desktopMenu === "services" ? "true" : undefined}
                  aria-current={servicesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Services
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={servicesMenuId}
                  className="nav-shell__menu nav-shell__menu--services"
                  data-open={desktopMenu === "services"}
                  aria-hidden={desktopMenu !== "services"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--services">
                      {renderMenuColumns(servicesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.services} onClick={closeAllMenus}>
                        See More Services
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.tracking} onClick={closeAllMenus}>
                        Track Your Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("resources")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("resources")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.resources}
                  data-active={resourcesActive}
                  data-open={desktopMenu === "resources" ? "true" : undefined}
                  aria-current={resourcesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Resources
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={resourcesMenuId}
                  className="nav-shell__menu"
                  data-open={desktopMenu === "resources"}
                  aria-hidden={desktopMenu !== "resources"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--resources">
                      {renderMenuColumns(resourcesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.resources} onClick={closeAllMenus}>
                        See More
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.contact} onClick={closeAllMenus}>
                        Ask a Question
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {desktopLinks.slice(2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="nav-shell__actions">
            {renderThemeToggle("tutorial-toggle nav-shell__theme-desktop", theme, onToggleTheme)}
            {renderThemeToggle("tutorial-toggle tutorial-toggle--mobile nav-shell__theme-mobile", theme, onToggleTheme)}

            <a className="nav-shell__call-button" href="tel:+255794689099">
              <div className="nav-shell__call-icon">
                <svg className="animate-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="nav-shell__call-copy">
                <span className="nav-shell__call-label">Call Now</span>
                <span className="nav-shell__call-number">+255 794 689 099</span>
              </div>
            </a>

            <button
              className={`nav-shell__toggle${mobileMenuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => {
                setDesktopMenu(null);
                setMobileMenuOpen((open) => !open);
              }}
            >
              <span className="nav-shell__sr-only">Toggle navigation</span>

              <svg
                className="nav-shell__toggle-icon--menu"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 7 10 h 18 M 7 16 h 18 M 7 22 h 18" />
              </svg>

              <svg
                className="nav-shell__toggle-icon--close"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 10 10 L 22 22 M 22 10 L 10 22" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className="nav-shell__mobile"
        data-theme={theme}
        data-open={mobileMenuOpen}
        id={mobileMenuId}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          className="nav-shell__mobile-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="nav-shell__mobile-wrap">
          <div className="nav-shell__mobile-panel">
            <div className="nav-shell__mobile-grid">
              <div className="nav-shell__mobile-quick-links">
                {desktopLinks.map((link) => (
                  <a
                    key={link.href}
                    className="nav-shell__mobile-quick-link"
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Services</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileServices.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="nav-shell__mobile-card-actions">
                  <a
                    className="nav-shell__mobile-card-primary"
                    href={routes.services}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See More Services
                  </a>
                  <a
                    className="nav-shell__mobile-card-secondary"
                    href={routes.tracking}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track Your Consultation
                  </a>
                </div>
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Resources</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileResources.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="nav-shell__mobile-bottom">
                <a
                  className="nav-shell__mobile-bottom-link"
                  href="tel:+255794689099"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-shell__mobile-bottom-label">Call Now</span>
                  <span className="nav-shell__mobile-bottom-number">+255 794 689 099</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
