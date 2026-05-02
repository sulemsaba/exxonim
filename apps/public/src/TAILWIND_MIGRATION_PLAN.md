# Pure Tailwind Migration Plan

## Executive Summary

**Current State:** 9,659 lines of hybrid CSS (Tailwind v4 import + massive custom CSS)
**Target State:** Pure Tailwind utilities with minimal custom CSS for animations/complex patterns
**Estimated Effort:** 3-5 days
**Risk Level:** Medium (visual regression possible)

---

## Phase 1: Foundation (Day 1)

### 1.1 Audit Current CSS Inventory

```bash
# Count selectors by category
grep -c "^\.[a-z]" tailwind.css                    # Total class count
grep -c "^@keyframes" tailwind.css                # Animation count
grep -c "html\[data-theme" tailwind.css            # Dark mode overrides
grep -c "@media" tailwind.css                      # Media queries
```

**Inventory Results:**

| Category | Classes | Strategy |
|----------|---------|----------|
| Layout primitives (`.container`, `.section`) | ~15 | Tailwind equivalents exist |
| Button variants (`.button-*`) | 4 | Custom component classes via `@apply` |
| Card components (`.metric-card`, `.blog-card`) | ~12 | Extract to React components |
| Device mockup (`.device-*`) | 15 | Keep as custom CSS (complex gradients) |
| Icon system (`.icon-*`) | 4 | Convert to SVG or Lucide |
| Animations (`@keyframes`) | 8 | Keep in CSS, reference via `animate-*` |
| Dark mode overrides | ~200 lines | Move to `dark:` modifiers |
| Complex UI (`.cinematic-bg`, `.engine-flow`) | ~20 | Hybrid: Tailwind layout + CSS details |

### 1.2 Update `tailwind.config.ts`

```typescript
// apps/public/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'selector', // Uses html[data-theme="dark"]
  theme: {
    extend: {
      // Colors from current CSS variables
      colors: {
        page: {
          DEFAULT: '#eef0ec',
          strong: '#e2e6e1',
          dark: '#071518',
          'dark-strong': '#0b1f23',
        },
        surface: {
          DEFAULT: '#f7f7f4',
          soft: '#f2f4f1',
          elevated: 'rgba(248, 249, 246, 0.88)',
          dark: '#0d2226',
          'dark-soft': '#112b30',
        },
        text: {
          DEFAULT: '#102529',
          muted: 'rgba(16, 37, 41, 0.72)',
          soft: 'rgba(16, 37, 41, 0.56)',
          dark: '#edf4f2',
          'dark-muted': 'rgba(237, 244, 242, 0.76)',
        },
        accent: {
          DEFAULT: '#0f5c63',
          hover: '#0b4b51',
          secondary: '#7fbcc1',
          soft: 'rgba(15, 92, 99, 0.12)',
          'soft-strong': 'rgba(15, 92, 99, 0.22)',
          contrast: '#f7fbfb',
          dark: '#7fbcc1',
          'dark-hover': '#96cacf',
        },
        border: {
          soft: 'rgba(15, 92, 99, 0.12)',
          strong: 'rgba(15, 92, 99, 0.22)',
        },
        navy: {
          950: '#08181b',
          900: '#0b4b51',
          800: '#0f5c63',
          700: '#0f5c63',
          650: '#7fbcc1',
        },
      },
      // Typography
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      // Spacing (converting rem to Tailwind scale)
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      // Border radius (converting to Tailwind scale)
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      // Box shadows
      boxShadow: {
        'panel': '0 24px 60px rgba(8, 31, 35, 0.1)',
        'panel-strong': '0 30px 72px rgba(8, 31, 35, 0.14)',
        'hero': '0 38px 110px rgba(8, 31, 35, 0.14)',
        'button': '0 16px 40px rgba(15, 92, 99, 0.24)',
        'card': '0 24px 60px rgba(8, 31, 35, 0.12)',
        'card-dark': '0 24px 60px rgba(0, 0, 0, 0.34)',
      },
      // Animations
      animation: {
        'drift-1': 'organic-drift-1 25s ease-in-out infinite',
        'drift-2': 'organic-drift-2 30s ease-in-out infinite',
        'marquee': 'provider-marquee 34s linear infinite',
        'code-pan': 'code-pan 12s linear infinite alternate',
        'reveal': 'reveal 620ms ease forwards',
        'shimmer': 'content-skeleton-shimmer 1.8s ease-in-out infinite',
        'hero-slide-primary': 'reference-hero-slide-primary 14s ease-in-out infinite',
        'hero-slide-secondary': 'reference-hero-slide-secondary 14s ease-in-out infinite',
      },
      keyframes: {
        'organic-drift-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-80px, 60px) scale(1.1)' },
          '66%': { transform: 'translate(40px, -40px) scale(0.9)' },
        },
        'organic-drift-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(60px, -80px) scale(0.95)' },
          '66%': { transform: 'translate(-50px, 50px) scale(1.05)' },
        },
        'provider-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'code-pan': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-18%)' },
        },
        'reveal': {
          from: { opacity: '0', transform: 'translateY(26px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'content-skeleton-shimmer': {
          to: { transform: 'translateX(100%)' },
        },
        'reference-hero-slide-primary': {
          '0%, 44%': { opacity: '1', transform: 'scale(1)' },
          '50%, 94%': { opacity: '0', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'reference-hero-slide-secondary': {
          '0%, 44%': { opacity: '0', transform: 'scale(1.02)' },
          '50%, 94%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.02)' },
        },
      },
      // Backdrop blur for glassmorphism
      backdropBlur: {
        'glass': '110px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Phase 2: Component Extraction Strategy (Day 1-2)

### 2.1 Create Component Primitives

```tsx
// apps/public/src/components/ui/Button.tsx
import { cn } from '@/utils/cn' // clsx + tailwind-merge

interface ButtonProps {
  variant?: 'primary' | 'light' | 'ghost' | 'rail'
  children: React.ReactNode
  className?: string
}

export function Button({ variant = 'primary', children, className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-extrabold transition-all duration-180 ease-out',
        'min-h-[3.65rem] px-6 py-4 rounded-full border',
        'hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
        
        // Variants
        variant === 'primary' && [
          'bg-accent text-accent-contrast border-transparent',
          'shadow-button hover:bg-accent-hover',
        ],
        variant === 'light' && [
          'bg-surface/94 text-text border-border-soft',
        ],
        variant === 'ghost' && [
          'bg-surface-soft/78 text-text border-border-strong',
        ],
        variant === 'rail' && [
          'bg-surface/90 text-text border-border-soft',
          'min-h-[3.1rem] px-5 py-3',
        ],
        
        className
      )}
    >
      {children}
    </button>
  )
}
```

```tsx
// apps/public/src/components/ui/Card.tsx
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[22px] border border-cinematic-card-border',
        'bg-cinematic-card-bg shadow-card',
        'dark:border-dark dark:bg-dark dark:shadow-card-dark',
        hover && 'transition-all duration-300 ease-out hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  )
}
```

### 2.2 Container Component

```tsx
// apps/public/src/components/ui/Container.tsx
import { cn } from '@/utils/cn'

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('w-[min(1240px,calc(100%-2rem))] mx-auto', className)}>
      {children}
    </div>
  )
}
```

---

## Phase 3: Migration by Component (Day 2-4)

### 3.1 Hero Section Migration

**Current (CSS-heavy):**
```html
<div class="hero-section">
  <div class="hero-grid">
    <div class="hero-copy">
      <p class="hero-eyebrow">...</p>
      <h1>...</h1>
      <p class="hero-text">...</p>
      <div class="hero-actions">...</div>
    </div>
    <div class="hero-visual">...</div>
  </div>
</div>
```

**Target (Tailwind):**
```tsx
// HeroSection.tsx
export function HeroSection() {
  return (
    <section className="py-11 pb-10 overflow-hidden">
      <Container>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-7 items-center lg:grid-cols-1">
          {/* Copy */}
          <div className="space-y-5">
            <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-text-muted mb-3.5">
              Eyebrow Text
            </p>
            <h1 className="font-display font-medium tracking-tight text-[clamp(3.25rem,6vw,5.85rem)] leading-[0.93] max-w-[11ch]">
              Main Headline
            </h1>
            <p className="text-[clamp(1rem,1.45vw,1.22rem)] leading-relaxed text-text/78 max-w-[38rem] mt-5">
              Description text...
            </p>
            <div className="flex items-center gap-4 mt-9">
              <Button variant="primary">Get Started</Button>
              <Button variant="ghost">Learn More</Button>
            </div>
          </div>
          
          {/* Visual - Keep device mockup as custom CSS */}
          <div className="relative min-h-[39rem] lg:min-h-[30rem]">
            <DeviceMockup />
          </div>
        </div>
      </Container>
    </section>
  )
}
```

### 3.2 Cinematic Background Migration

**Keep as custom CSS** (too complex for Tailwind), but reduce footprint:

```css
/* Reduced to ~50 lines in tailwind.css */
.cinematic-bg {
  @apply fixed inset-0 -z-10 pointer-events-none overflow-hidden;
  contain: layout style paint;
  background: linear-gradient(180deg, var(--cinematic-bg-end) 0%, theme('colors.page.strong') 100%);
}

.cinematic-bg__orb {
  @apply absolute rounded-full pointer-events-none blur-[110px] opacity-[0.22];
}

.cinematic-bg__orb--one {
  @apply top-[10%] right-[10%] w-[31rem] h-[31rem] animate-drift-1;
  background: var(--cinematic-orb-one);
}

.cinematic-bg__orb--two {
  @apply bottom-[20%] left-[5%] w-[37rem] h-[37rem] animate-drift-2;
  background: var(--cinematic-orb-two);
}
```

### 3.3 Metric Cards Migration

**Current:**
```html
<div class="metric-row">
  <div class="metric-card">
    <div class="metric-icon"><span class="icon-bars"></span></div>
    <div>
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

**Target:**
```tsx
// MetricCard.tsx
import { cn } from '@/utils/cn'
import { Card } from './ui/Card'

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function MetricCard({ icon, title, description }: MetricCardProps) {
  return (
    <Card className="flex items-center gap-4 p-6">
      <div className="flex-shrink-0 w-[4.2rem] h-[4.2rem] rounded-full grid place-items-center bg-gradient-to-b from-[#2f9aa1] to-[#0d666a]">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-medium tracking-tight text-lg">{title}</h3>
        <p className="text-text-muted mt-1">{description}</p>
      </div>
    </Card>
  )
}
```

### 3.4 Dark Mode Strategy

**Current:** 380 lines of `html[data-theme="dark"] .class` overrides

**Target:** Use Tailwind's `dark:` modifier

```tsx
// Example component with dark mode
<div className="
  bg-page text-text
  dark:bg-page-dark dark:text-text-dark
">
  <p className="text-text-muted dark:text-text-dark-muted">
    Content
  </p>
</div>
```

**Update config:**
```typescript
// tailwind.config.ts
darkMode: 'selector', // Uses html[data-theme="dark"]
```

---

## Phase 4: Icon System Migration (Day 3)

### 4.1 Replace CSS Icons with Lucide

```bash
npm install lucide-react
```

**Current:**
```html
<span class="icon-bars"></span>
<span class="icon-bolt"></span>
<span class="icon-eye"></span>
<span class="icon-people"></span>
```

**Target:**
```tsx
import { BarChart3, Zap, Eye, Users } from 'lucide-react'

// In component:
<BarChart3 className="w-6 h-6 text-white" />
<Zap className="w-6 h-6 text-white" />
<Eye className="w-6 h-6 text-white" />
<Users className="w-6 h-6 text-white" />
```

**Engine icons** (complex CSS shapes):
```tsx
// Keep as SVG components or styled divs
function LayersIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-12 h-12", className)}>
      <div className="absolute left-1/2 -translate-x-1/2 top-1 w-[1.8rem] h-[0.7rem] border-[3px] border-current rounded" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[1.2rem] w-[1.8rem] h-[0.7rem] border-[3px] border-current rounded" />
    </div>
  )
}
```

---

## Phase 5: Animation Migration (Day 4)

### 5.1 Scroll Reveal Animation

**Current:**
```css
.js [data-reveal] {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 620ms ease, transform 620ms ease;
}
.js [data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Target:**
```tsx
// hooks/useReveal.ts
import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Usage:
function RevealSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[620ms] ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[26px]'
      )}
    >
      {children}
    </div>
  )
}
```

### 5.2 Marquee Animation

**Current:**
```css
.provider-track {
  animation: provider-marquee 34s linear infinite;
}
```

**Target:** Keep keyframes in CSS, use Tailwind class:

```css
/* tailwind.css - Reduced animations only */
@keyframes provider-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

```tsx
<div className="animate-marquee hover:[animation-play-state:paused]">
  {/* Content */}
</div>
```

---

## Phase 6: Final Cleanup (Day 5)

### 6.1 New `tailwind.css` Structure

```css
/* apps/public/src/tailwind.css */
@import "tailwindcss";
@config "../tailwind.config.ts";

/* === CUSTOM CSS (Keep Minimal) === */

/* Cinematic background orbs */
.cinematic-bg { /* ~20 lines */ }
.cinematic-bg__orb--one { animation: organic-drift-1 25s ease-in-out infinite; }
.cinematic-bg__orb--two { animation: organic-drift-2 30s ease-in-out infinite; }

/* Device mockup (complex gradients) */
.device-shell { /* ~100 lines */ }
.device-frame { /* ... */ }

/* Utility animations not in Tailwind */
@keyframes organic-drift-1 { /* ... */ }
@keyframes organic-drift-2 { /* ... */ }
@keyframes provider-marquee { /* ... */ }

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .cinematic-bg__orb { animation: none; }
}

/* === TARGET: < 200 lines === */
```

### 6.2 Verification Checklist

```bash
# 1. Build succeeds
npm run build:public

# 2. No CSS syntax errors
npm run typecheck

# 3. Visual regression testing
# - Compare screenshots of all pages
# - Check dark mode toggle
# - Verify all animations work

# 4. Performance audit
# - Lighthouse score >= current
# - CSS bundle size < 50KB
# - No render-blocking issues
```

---

## Migration Priority Matrix

| Component | Effort | Impact | Priority |
|-----------|--------|--------|----------|
| Buttons | Low | High | 1 |
| Cards | Low | High | 1 |
| Typography | Low | Medium | 2 |
| Layout containers | Low | High | 1 |
| Dark mode | Medium | High | 1 |
| Hero section | Medium | High | 2 |
| Metric cards | Low | Medium | 2 |
| Blog cards | Low | Medium | 2 |
| Provider marquee | Low | Medium | 3 |
| Engine section | Medium | Medium | 3 |
| Device mockup | High | Medium | 4 (keep CSS) |
| Cinematic bg | Low | Low | 3 |
| Icon system | Medium | Medium | 2 |
| Animations | Medium | Low | 3 |
| Code windows | Medium | Low | 4 |
| ROI panels | Medium | Low | 4 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Visual regression | Screenshot comparison with Playwright |
| Dark mode bugs | Automated test: toggle theme, verify contrast |
| Animation failures | Check `prefers-reduced-motion` still works |
| Bundle size increase | Tailwind purges unused styles automatically |
| Maintainability | Document all custom components in Storybook |

---

## Success Criteria

1. **File size:** `tailwind.css` < 200 lines (from 9,659)
2. **Component count:** Extract 15+ reusable components
3. **No visual regression:** Pixel-perfect match
4. **Dark mode:** Works identically
5. **Build time:** Faster (less CSS to parse)
6. **Dev experience:** Easier to modify styles

---

## Post-Migration Architecture

```
apps/public/src/
├── components/
│   └── ui/                    # Primitive components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Container.tsx
│       └── ...
├── features/
│   └── home/
│       ├── HeroSection.tsx    # Composed with ui components
│       ├── EngineSection.tsx
│       └── ...
├── hooks/
│   └── useReveal.ts           # Animation hooks
├── utils/
│   └── cn.ts                  # clsx + tailwind-merge
├── tailwind.css               # ~150 lines (animations + complex patterns)
└── tailwind.config.ts         # Extended theme
```

**Result:** Utility-first Tailwind with component abstractions. Easy to debug (go to component file), easy to theme (config + `dark:` modifiers), maintainable (colocated styles).
