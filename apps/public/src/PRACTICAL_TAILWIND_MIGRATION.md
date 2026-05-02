# Practical Tailwind Migration Plan

**Context:** 9,659 lines of custom CSS → Tailwind with minimal retained CSS  
**Timeline:** 3-5 days for one developer  
**Goal:** Better debugging, maintainability, without overengineering

---

## Current vs Target

| Aspect | Current | Target |
|--------|---------|--------|
| CSS file | 9,659 lines | ~400-600 lines |
| Class names | BEM (`.hero-section__title`) | Tailwind utilities + components |
| Debugging | Search 9k lines, grep for selectors | Go to component file, see classes inline |
| Dark mode | 380 lines of overrides | `dark:` modifiers in components |
| Icons | CSS-drawn (`.icon-bolt`) | Lucide React |

---

## CSS Strategy: What Stays vs What Goes

### What STAYS in CSS (and why)

| Component | Lines | Reason |
|-----------|-------|--------|
| Device mockup | ~80 | Complex gradients, pseudo-elements, layered shadows. Tailwind can't express this cleanly. |
| Cinematic background orbs | ~15 | Keyframe animations, blur filters. Keep as `.animate-drift-1`, `.animate-drift-2` |
| Keyframe definitions | ~30 | Marquee, drift, scroll reveal, hero slides. Referenced by Tailwind config. |
| Skeleton shimmer | ~20 | Animation for loading states. Utility class `animate-shimmer`. |
| Reduced motion support | ~10 | `@media (prefers-reduced-motion)` wrappers. Accessibility requirement. |

**Total retained:** ~150-200 lines

### What MOVES to Tailwind

- **Everything else.** Layouts, typography, colors, spacing, borders, shadows, buttons, cards, grids.

---

## Component Strategy

### Golden Rule

> **No className strings longer than 80 characters in page files.** If it's long, make it a component.

### Component Hierarchy

```
primitives/          # Reusable building blocks
  Button.tsx         # All button variants
  Card.tsx           # Glass/card styling
  Container.tsx      # Max-width wrapper
  Section.tsx        # Section padding + bg

ui/                  # Domain-specific
  ProviderLogo.tsx   # Logo with hover effect
  ServiceCard.tsx    # EngineSection cards
  MetricCard.tsx     # Stats display

complex/             # Keep CSS, add React wrapper
  DeviceMockup.tsx   # Uses .device-* CSS classes
  CinematicBg.tsx    # Uses .cinematic-bg CSS
```

### When to Create a Component

| Scenario | Action | Example |
|----------|--------|---------|
| Same pattern 3+ times | Component | `Button`, `Card` |
| Long className (>80 chars) | Component | `ProviderSection` header |
| Interactive (state, logic) | Component + TDD | `ThemeToggle` |
| Complex CSS (kept in CSS) | Wrapper component | `DeviceMockup` |
| One-off layout | Inline Tailwind | Page-specific grids |

---

## Phase 1: Setup (4 hours)

**Goal:** Prepare infrastructure, no component changes yet.

### 1.1 Install minimal dependencies

```bash
cd /home/msaba/Desktop/nim/exxonim/apps/public
npm install clsx tailwind-merge lucide-react
```

### 1.2 Create utility

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 1.3 Update Tailwind config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector', // uses html[data-theme="dark"]
  theme: {
    extend: {
      colors: {
        page: {
          DEFAULT: '#eef0ec',
          strong: '#e2e6e1',
          dark: '#071518',
        },
        surface: {
          DEFAULT: '#f7f7f4',
          soft: '#f2f4f1',
          dark: '#0d2226',
        },
        text: {
          DEFAULT: '#102529',
          muted: 'rgba(16, 37, 41, 0.72)',
          dark: '#edf4f2',
        },
        accent: {
          DEFAULT: '#0f5c63',
          hover: '#0b4b51',
          dark: '#7fbcc1',
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 60px rgba(8, 31, 35, 0.1)',
        card: '0 24px 60px rgba(8, 31, 35, 0.12)',
        button: '0 16px 40px rgba(15, 92, 99, 0.24)',
      },
      animation: {
        'drift-1': 'organic-drift-1 25s ease-in-out infinite',
        'drift-2': 'organic-drift-2 30s ease-in-out infinite',
        'marquee': 'provider-marquee 34s linear infinite',
        'reveal': 'reveal 620ms ease forwards',
      },
    },
  },
}

export default config
```

### 1.4 Reduce CSS to foundation

Keep only:
- CSS variables (for colors shared with retained CSS)
- Device mockup styles
- Cinematic background
- Keyframes
- Reset styles

**Target:** 9,659 → ~200 lines

### 1.5 Add minimal test setup

```bash
npm install -D vitest @testing-library/react jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

**Validation:** `npm run dev` still works, `npm run typecheck` passes.

---

## Phase 2: Primitives with TDD (Day 2)

**Goal:** Build 3-4 core components using TDD. These are your building blocks.

### 2.1 Button (TDD)

**Test first:**

```typescript
// src/components/primitives/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })

  it('handles click', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalled()
  })

  it('renders as link when href provided', () => {
    render(<Button href="/test">Link</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })
})
```

**Implementation:**

```typescript
// src/components/primitives/Button.tsx
import { cn } from '../../utils/cn'

interface ButtonProps {
  variant?: 'primary' | 'ghost'
  href?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', href, children, onClick }: ButtonProps) {
  const className = cn(
    'inline-flex items-center justify-center font-extrabold',
    'min-h-[3.65rem] px-6 py-4 rounded-full border transition-all',
    'hover:-translate-y-0.5 active:translate-y-0',
    variant === 'primary' && 'bg-accent text-white shadow-button',
    variant === 'ghost' && 'bg-surface/80 border-border-soft'
  )

  if (href) {
    return <a href={href} className={className}>{children}</a>
  }

  return <button onClick={onClick} className={className}>{children}</button>
}
```

### 2.2 Container

**Test:**

```typescript
it('renders children with max-width', () => {
  render(<Container>Content</Container>)
  const el = screen.getByText('Content')
  expect(el.parentElement).toHaveClass('mx-auto')
})
```

**Implementation:**

```typescript
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('w-[min(1240px,calc(100%-2rem))] mx-auto', className)}>{children}</div>
}
```

### 2.3 Card

**Test:**

```typescript
it('renders with glass styling', () => {
  render(<Card>Content</Card>)
  expect(screen.getByText('Content').parentElement).toHaveClass('rounded-[22px]')
})
```

**Implementation:**

```typescript
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'rounded-[22px] border border-border-soft bg-surface/88 shadow-card',
      'dark:bg-surface-dark dark:border-border-dark-soft',
      className
    )}>
      {children}
    </div>
  )
}
```

### 2.4 Section

**Implementation (no test - too simple):**

```typescript
export function Section({ 
  children, 
  className,
  id 
}: { 
  children: React.ReactNode; 
  className?: string;
  id?: string 
}) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </section>
  )
}
```

**Phase 2 done:** 4 primitives ready. Tests pass.

---

## Phase 3: Migrate One Section End-to-End (Day 3)

**Goal:** Pick one section, migrate completely as a proof of concept.

**Recommended:** `ProviderSection` (simple, self-contained, no complex CSS).

### 3.1 Write test for current behavior

```typescript
// src/components/ProviderSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProviderSection } from './ProviderSection'

const mockContent = {
  kicker: 'Trusted By',
  title: 'Industry Leaders',
  logos: [{ src: '/logo.svg', alt: 'Company' }],
}

describe('ProviderSection', () => {
  it('renders kicker and title', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getByText('Trusted By')).toBeInTheDocument()
    expect(screen.getByText('Industry Leaders')).toBeInTheDocument()
  })

  it('renders logos twice for marquee', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })
})
```

### 3.2 Migrate component

**Before (CSS classes):**
```tsx
<section className="provider-section" id="industries">
  <div className="container provider-section__inner">
    <div className="provider-heading" data-reveal>
      <span className="provider-kicker">{content.kicker}</span>
      <h2 className="provider-title">{content.title}</h2>
    </div>
    <div className="provider-marquee" data-reveal>
      <div className="provider-track">...</div>
    </div>
  </div>
</section>
```

**After (Tailwind):**
```tsx
import { Container } from './primitives/Container'

<section 
  id="industries"
  className="relative py-6 border-y border-border-soft bg-gradient-to-b from-surface/84 to-surface-soft/70"
>
  <Container className="grid gap-4">
    <div className="grid gap-1 justify-items-center text-center">
      <span className="inline-flex items-center px-3.5 py-2 rounded-full bg-surface-elevated text-accent text-xs font-extrabold uppercase tracking-wider">
        {content.kicker}
      </span>
      <h2 className="font-display text-2xl font-medium tracking-tight">
        {content.title}
      </h2>
    </div>
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
        {repeatedLogos.map((logo) => (
          <img key={logo.alt} src={logo.src} className="h-12 object-contain" alt={logo.alt} />
        ))}
      </div>
    </div>
  </Container>
</section>
```

### 3.3 Run tests

```bash
npm run test
# Should pass
```

### 3.4 Manual verification

- Open `/` in browser
- Scroll to "Trusted By" section
- Verify: layout correct, marquee animates, hover pauses
- Toggle dark mode: colors flip correctly

**Decision point:** If issues, fix. If good, proceed.

---

## Phase 4: Batch Migration (Day 4)

**Goal:** Migrate remaining sections in batches. No new tests for simple components.

### 4.1 TDD only for interactive components

**Interactive = TDD:**
- Navigation (state: open/closed)
- Theme toggle (state: light/dark)
- Mobile menu (focus trap, keyboard nav)

**Static = No TDD:**
- Hero section
- Service cards
- Footer
- About page

### 4.2 Migration order (easiest to hardest)

1. ✅ ProviderSection (done)
2. Footer (static, many links)
3. EngineSection (cards, grid)
4. Hero (device mockup kept as CSS)
5. Navigation (interactive - needs TDD)
6. StackSection (complex tabs/accordion)

### 4.3 Icon migration (parallel task)

**Before:**
```tsx
<span className="icon-bolt" />
```

**After:**
```tsx
import { Zap } from 'lucide-react'
<Zap className="w-6 h-6" />
```

Replace all CSS icons with Lucide in one pass.

---

## Phase 5: Cleanup & Validation (Day 5)

### 5.1 Clean up CSS file

Target structure:

```css
@import "tailwindcss";
@config "../tailwind.config.ts";

/* CSS Variables (for shared values) */
:root {
  --color-page: #eef0ec;
  /* ... keep for device mockup reference ... */
}

/* Device mockup (kept) */
.device-shell { /* ... */ }
.device-frame { /* ... */ }
/* ... 80 lines ... */

/* Cinematic background (kept) */
.cinematic-bg { /* ... */ }
.cinematic-bg__orb { /* ... */ }
/* ... 15 lines ... */

/* Keyframes (referenced by Tailwind) */
@keyframes organic-drift-1 { /* ... */ }
@keyframes provider-marquee { /* ... */ }
/* ... 30 lines ... */

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-drift-1, .animate-drift-2 { animation: none; }
}
```

**Target achieved:** ~400 lines

### 5.2 Validation checklist

```bash
# 1. Type check
npm run typecheck

# 2. Build
npm run build

# 3. Tests
npm run test

# 4. Manual spot-check
npm run dev
# - Check homepage
# - Check dark mode toggle
# - Check mobile (< 768px)
# - Check /services, /about, /contact
```

### 5.3 Optional: One visual regression test

Only for homepage (most important):

```bash
npm install -D @playwright/test
npx playwright test homepage.spec.ts
```

Not required, but nice to have.

---

## Debugging: Before vs After

### Before (Current)

**Problem:** Button looks wrong

1. Open DevTools → Elements
2. See class `button-primary`
3. Search `grep -n "button-primary" tailwind.css` 
4. Find it at line 4,247
5. Look for `.button-primary:hover` at line 4,258
6. Oh, it's overridden by `.hero-actions .button` at line 2,891
7. 15 minutes later: found the issue

### After (Tailwind)

**Problem:** Button looks wrong

1. Open DevTools → Elements
2. See classes: `bg-accent text-white shadow-button`
3. Click React component in DevTools
4. Go to `Button.tsx`
5. See: `variant === 'primary' && 'bg-accent text-white shadow-button'`
6. Fix directly in component
7. 2 minutes: issue fixed

**Key improvement:** Styles live where they're used. No hunting through 9k lines.

---

## Testing Strategy Recap

### What gets TDD

| Component | Why TDD? |
|-----------|----------|
| Button | Click handlers, link vs button logic |
| ThemeToggle | State management, accessibility |
| Navigation | Keyboard nav, focus trap, mobile toggle |
| Form inputs | Validation, error states |

### What doesn't get TDD

| Component | Why not? |
|-----------|----------|
| ProviderSection | Static, tests add no value |
| Hero | Static layout |
| Footer | Static links |
| Cards in grids | Visual, test via manual check |

### Test example (the right size)

```typescript
// Good: tests behavior
describe('ThemeToggle', () => {
  it('toggles theme on click', async () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="light" onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalled()
  })

  it('shows correct icon for theme', () => {
    const { rerender } = render(<ThemeToggle theme="light" onToggle={vi.fn()} />)
    expect(screen.getByLabelText(/sun/i)).toBeInTheDocument()
    
    rerender(<ThemeToggle theme="dark" onToggle={vi.fn()} />)
    expect(screen.getByLabelText(/moon/i)).toBeInTheDocument()
  })
})

// Bad: tests implementation details
describe('Button', () => {
  it('has correct classes', () => {  // ❌ Don't do this
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-accent')  // ❌ Brittle
  })
})
```

---

## Risks & Tradeoffs (Honest)

### What improves

| Area | Improvement |
|------|-------------|
| Debugging | 10x faster. Styles in component files. |
| Consistency | No drift. One Button component used everywhere. |
| Dark mode | `dark:` modifiers inline, no 380-line override file. |
| Onboarding | New devs learn Tailwind once, apply everywhere. |
| Refactoring | Change Button in one place, applies everywhere. |

### What becomes worse

| Area | Degradation |
|------|-------------|
| JSX readability | `className="..."` strings can get long. Mitigation: extract to components early. |
| HTML bloat | More classes in DOM. Acceptable tradeoff. |
| Build time | Tailwind generates more CSS. Mitigation: purge works well. |
| Learning curve | Team must learn Tailwind utilities. One-time cost. |

### Where Tailwind can become messy

**Anti-pattern (don't do this):**

```tsx
// ❌ 200 character className
<div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
```

**Fix (extract to component):**

```tsx
// ✅ Clean
<Card variant="elevated">Content</Card>
```

### Where TDD slows you down

- Testing that a `div` renders with `className="p-4"` — pointless
- Testing static marketing copy — pointless
- Snapshot testing every component — slows CI, brittle

**Rule:** If a test hasn't caught a bug in 3 months, delete it.

---

## Execution Checklist

```markdown
## Day 1: Setup
- [ ] Install clsx, tailwind-merge, lucide-react
- [ ] Update tailwind.config.ts with colors/shadows
- [ ] Reduce tailwind.css to ~200 lines (keep device, animations)
- [ ] Add vitest + @testing-library/react
- [ ] Create cn.ts utility
- [ ] Verify: `npm run dev` works, `npm run typecheck` passes

## Day 2: Primitives with TDD
- [ ] Button component + test
- [ ] Container component
- [ ] Card component
- [ ] Section component
- [ ] Verify: `npm run test` passes

## Day 3: Proof of Concept
- [ ] ProviderSection test (current behavior)
- [ ] Migrate ProviderSection to Tailwind
- [ ] Replace CSS icons with Lucide
- [ ] Verify: Test passes, manual check looks correct

## Day 4: Batch Migration
- [ ] Footer (no test)
- [ ] EngineSection (no test)
- [ ] Hero (keep device CSS, rest Tailwind)
- [ ] Navigation (with TDD - interactive)
- [ ] StackSection
- [ ] About, Contact, Services pages

## Day 5: Cleanup
- [ ] Final CSS cleanup (~400 lines)
- [ ] Remove unused CSS classes
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run test`
- [ ] Manual check all pages (desktop + mobile)
- [ ] Dark mode toggle on each page
- [ ] (Optional) Playwright screenshot of homepage
```

---

## Final Target State

```
src/
├── components/
│   ├── primitives/          # 4 components
│   │   ├── Button.tsx       # + test
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   ├── ui/                  # Domain components
│   │   ├── ProviderSection.tsx  # + test
│   │   ├── EngineSection.tsx
│   │   ├── Navigation.tsx       # + test
│   │   └── ...
│   └── complex/             # CSS-wrapped
│       ├── DeviceMockup.tsx
│       └── CinematicBg.tsx
├── tailwind.css             # ~400 lines
└── tailwind.config.ts       # Extended theme
```

**Result:** Debuggable, maintainable, pragmatic.
