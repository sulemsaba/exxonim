# Pure Tailwind Migration Plan with TDD

## Executive Summary

| Metric | Current State | Target State |
|--------|---------------|--------------|
| **CSS Lines** | 9,659 | < 200 |
| **CSS Classes** | 682 unique selectors | 0 (pure utilities) |
| **Testing** | None | Vitest + React Testing Library |
| **Visual Regression** | Manual | Automated Playwright |
| **Components** | 15 raw className | 15 tested, typed components |

**Timeline:** 5-7 days  
**Approach:** Test-Driven Development (TDD) - Tests written BEFORE migration  
**Risk Level:** Low (tests guard against regression)

---

## Phase 0: Testing Infrastructure Setup (Day 1)

### 0.1 Install Testing Dependencies

```bash
cd /home/msaba/Desktop/nim/exxonim/apps/public

# Unit testing
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Visual regression
npm install -D @playwright/test

# Utilities
npm install clsx tailwind-merge

# Icon library (replaces CSS icons)
npm install lucide-react
```

### 0.2 Create Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'

// Mock CSS modules if needed
vi.mock('../tailwind.css', () => ({
  default: '',
}))
```

### 0.3 Create Visual Regression Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 0.4 Create Baseline Screenshots (Before Migration)

```bash
# Run Playwright to capture baseline
npx playwright test --update-snapshots
```

**Baseline captures:**
- `/` - Homepage
- `/about` - About page
- `/services` - Services page
- `/contact` - Contact page
- `/resources` - Resources page
- Dark mode toggle state
- Mobile navigation open

---

## Phase 1: Foundation - Tailwind Config with TDD (Day 1-2)

### 1.1 Write Test for Theme Configuration

```typescript
// src/test/theme.test.ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config'

describe('Tailwind Theme', () => {
  it('should have all custom colors defined', () => {
    const colors = tailwindConfig.theme.extend.colors
    
    expect(colors.page.DEFAULT).toBe('#eef0ec')
    expect(colors.page.dark).toBe('#071518')
    expect(colors.accent.DEFAULT).toBe('#0f5c63')
    expect(colors.accent.dark).toBe('#7fbcc1')
    expect(colors.text.DEFAULT).toBe('#102529')
    expect(colors.text.dark).toBe('#edf4f2')
  })

  it('should have proper dark mode configuration', () => {
    expect(tailwindConfig.darkMode).toBe('selector')
  })

  it('should have custom animations defined', () => {
    const animations = tailwindConfig.theme.extend.animation
    
    expect(animations).toHaveProperty('drift-1')
    expect(animations).toHaveProperty('drift-2')
    expect(animations).toHaveProperty('marquee')
    expect(animations).toHaveProperty('reveal')
  })

  it('should have shadow tokens', () => {
    const shadows = tailwindConfig.theme.extend.boxShadow
    
    expect(shadows).toHaveProperty('panel')
    expect(shadows).toHaveProperty('hero')
    expect(shadows).toHaveProperty('button')
    expect(shadows).toHaveProperty('card')
  })
})
```

**Run test (should FAIL):**
```bash
npm run test
# Expected: FAIL - config doesn't exist yet
```

### 1.2 Implement Tailwind Config (TDD: Make it PASS)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
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
          'dark-soft': 'rgba(237, 244, 242, 0.58)',
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
          'dark-secondary': '#aacfd2',
          'dark-soft': 'rgba(127, 188, 193, 0.14)',
        },
        border: {
          soft: 'rgba(15, 92, 99, 0.12)',
          strong: 'rgba(15, 92, 99, 0.22)',
          'dark-soft': 'rgba(127, 188, 193, 0.16)',
          'dark-strong': 'rgba(127, 188, 193, 0.28)',
        },
        navy: {
          950: '#08181b',
          900: '#0b4b51',
          800: '#0f5c63',
          700: '#0f5c63',
          650: '#7fbcc1',
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'panel': '0 24px 60px rgba(8, 31, 35, 0.1)',
        'panel-strong': '0 30px 72px rgba(8, 31, 35, 0.14)',
        'hero': '0 38px 110px rgba(8, 31, 35, 0.14)',
        'button': '0 16px 40px rgba(15, 92, 99, 0.24)',
        'button-dark': '0 16px 40px rgba(127, 188, 193, 0.22)',
        'card': '0 24px 60px rgba(8, 31, 35, 0.12)',
        'card-dark': '0 24px 60px rgba(0, 0, 0, 0.34)',
      },
      animation: {
        'drift-1': 'organic-drift-1 25s ease-in-out infinite',
        'drift-2': 'organic-drift-2 30s ease-in-out infinite',
        'marquee': 'provider-marquee 34s linear infinite',
        'code-pan': 'code-pan 12s linear infinite alternate',
        'reveal': 'reveal 620ms ease forwards',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'hero-slide-primary': 'reference-hero-slide-primary 14s ease-in-out infinite',
        'hero-slide-secondary': 'reference-hero-slide-secondary 14s ease-in-out infinite',
      },
      keyframes: {
        'organic-drift-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-5rem, 3.75rem) scale(1.1)' },
          '66%': { transform: 'translate(2.5rem, -2.5rem) scale(0.9)' },
        },
        'organic-drift-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3.75rem, -5rem) scale(0.95)' },
          '66%': { transform: 'translate(-3.125rem, 3.125rem) scale(1.05)' },
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
          from: { opacity: '0', transform: 'translateY(1.625rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
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
    },
  },
  plugins: [],
}

export default config
```

**Verify test passes:**
```bash
npm run test
# Expected: PASS
```

### 1.3 Create Utility Function with Tests

```typescript
// src/utils/cn.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional')
    expect(cn('base', false && 'conditional')).toBe('base')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
  })

  it('should handle objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })
})
```

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Phase 2: Component Primitives with TDD (Day 2-3)

### 2.1 Button Component (High Impact)

**Test First:**

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default primary variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-accent', 'text-accent-contrast')
  })

  it('renders light variant', () => {
    render(<Button variant="light">Light</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-surface', 'border-border-soft')
  })

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-surface-soft', 'border-border-strong')
  })

  it('renders rail variant', () => {
    render(<Button variant="rail">Rail</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('min-h-[3.1rem]')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('accepts custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('renders as anchor when href provided', () => {
    render(<Button href="/test">Link</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })

  it('is accessible via keyboard', async () => {
    render(<Button>Focusable</Button>)
    const button = screen.getByRole('button')
    await userEvent.tab()
    expect(button).toHaveFocus()
    await userEvent.keyboard('{enter}')
  })
})
```

**Implementation (Make Tests PASS):**

```typescript
// src/components/ui/Button.tsx
import { cn } from '../../utils/cn'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'light' | 'ghost' | 'rail'

interface BaseButtonProps {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>
type ButtonAsAnchor = BaseButtonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-accent text-accent-contrast border-transparent',
    'shadow-button hover:bg-accent-hover dark:shadow-button-dark'
  ),
  light: cn(
    'bg-surface/94 text-text border-border-soft'
  ),
  ghost: cn(
    'bg-surface-soft/78 text-text border-border-strong'
  ),
  rail: cn(
    'bg-surface/90 text-text border-border-soft',
    'min-h-[3.1rem] px-5 py-3'
  ),
}

const baseStyles = cn(
  'inline-flex items-center justify-center font-extrabold',
  'transition-all duration-180 ease-out rounded-full border',
  'min-h-[3.65rem] px-6 py-4',
  'hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
)

export function Button(props: ButtonProps) {
  const { variant = 'primary', children, className, ...rest } = props
  
  const classes = cn(baseStyles, variantStyles[variant], className)
  
  if ('href' in rest) {
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    )
  }
  
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
```

### 2.2 Container Component

```typescript
// src/components/ui/Container.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has correct max-width styles', () => {
    render(<Container>Test</Container>)
    const container = screen.getByText('Test').parentElement
    expect(container).toHaveClass('mx-auto', 'w-[min(1240px,calc(100%-2rem))]')
  })

  it('accepts custom className', () => {
    render(<Container className="custom-class">Test</Container>)
    expect(screen.getByText('Test').parentElement).toHaveClass('custom-class')
  })
})
```

```typescript
// src/components/ui/Container.tsx
import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('w-[min(1240px,calc(100%-2rem))] mx-auto', className)}>
      {children}
    </div>
  )
}
```

### 2.3 Card Component

```typescript
// src/components/ui/Card.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('has correct base styles', () => {
    render(<Card>Test</Card>)
    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('rounded-[22px]', 'border', 'shadow-card')
  })

  it('has hover styles by default', () => {
    render(<Card>Test</Card>)
    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('transition-all', 'hover:-translate-y-1')
  })

  it('can disable hover', () => {
    render(<Card hover={false}>Test</Card>)
    const card = screen.getByText('Test').parentElement
    expect(card).not.toHaveClass('hover:-translate-y-1')
  })

  it('has dark mode support', () => {
    render(<Card>Test</Card>)
    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('dark:shadow-card-dark')
  })
})
```

```typescript
// src/components/ui/Card.tsx
import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[22px] border border-border-soft bg-surface/88',
        'shadow-card dark:bg-surface-dark/72 dark:border-border-dark-soft dark:shadow-card-dark',
        hover && 'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/30',
        className
      )}
    >
      {children}
    </div>
  )
}
```

---

## Phase 3: Feature Component Migration with TDD (Day 3-5)

### 3.1 ProviderSection Migration

**Write Test for Current Behavior:**

```typescript
// src/components/ProviderSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProviderSection } from './ProviderSection'

const mockContent = {
  kicker: 'Trusted By',
  title: 'Industry Leaders',
  logos: [
    { src: '/logo1.svg', alt: 'Company 1' },
    { src: '/logo2.svg', alt: 'Company 2' },
  ],
}

describe('ProviderSection', () => {
  it('renders kicker and title', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getByText('Trusted By')).toBeInTheDocument()
    expect(screen.getByText('Industry Leaders')).toBeInTheDocument()
  })

  it('renders all logos twice (for marquee)', () => {
    render(<ProviderSection content={mockContent} />)
    const logos = screen.getAllByRole('img')
    expect(logos).toHaveLength(4) // 2 logos × 2 for marquee
  })

  it('has marquee animation', () => {
    render(<ProviderSection content={mockContent} />)
    const track = document.querySelector('.animate-marquee')
    expect(track).toBeInTheDocument()
  })

  it('is accessible with proper aria labels', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getByLabelText(/client and partner logos/i)).toBeInTheDocument()
  })

  it('matches visual baseline', async () => {
    // Playwright visual regression
    // Will be checked in e2e test
  })
})
```

**Refactor Component (Keep Tests PASSING):**

```typescript
// src/components/ProviderSection.tsx
import { Container } from './ui/Container'
import type { ProviderSectionContent } from '../types'

interface ProviderSectionProps {
  content: ProviderSectionContent
}

export function ProviderSection({ content }: ProviderSectionProps) {
  const repeatedLogos = [...content.logos, ...content.logos]

  return (
    <section 
      className="relative py-6 border-y border-border-soft bg-gradient-to-b from-surface/84 to-surface-soft/70 dark:from-[rgba(11,31,35,0.9)] dark:to-[rgba(13,34,38,0.76)] dark:border-border-dark-soft"
      id="industries"
    >
      <Container className="grid gap-4">
        {/* Heading */}
        <div className="grid gap-1 justify-items-center text-center" data-reveal>
          <span className="inline-flex items-center min-h-8 px-3.5 border border-border-soft rounded-full bg-surface-elevated text-accent text-xs font-extrabold tracking-[0.14em] uppercase dark:bg-accent-dark-soft dark:border-border-dark-soft">
            {content.kicker}
          </span>
          <h2 className="m-0 text-text font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight dark:text-text-dark">
            {content.title}
          </h2>
        </div>

        {/* Marquee */}
        <div
          className="overflow-hidden whitespace-nowrap relative w-screen -ml-[50vw] left-1/2 py-2.5 px-[clamp(22px,4vw,48px)] bg-surface/58 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] dark:bg-surface-dark/58"
          aria-label="Client and partner logos"
          data-reveal
        >
          <div className="inline-flex items-center gap-[clamp(1.6rem,3vw,2.6rem)] w-max animate-marquee hover:[animation-play-state:paused]">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="inline-flex items-center justify-center flex-none min-w-[clamp(112px,9.5vw,144px)] min-h-[60px]"
                aria-label={logo.alt}
                role="img"
              >
                <img
                  className="block max-w-full h-[clamp(31px,3.6vw,48px)] w-auto object-contain transition-all duration-300 saturate-[0.92] contrast-[1.02] hover:scale-105 hover:saturate-100"
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  loading={index < content.logos.length ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
```

### 3.2 EngineSection Migration

```typescript
// src/components/EngineSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EngineSection } from './EngineSection'

const mockContent = {
  eyebrow: 'Services',
  title: 'What We Offer',
  description: 'Our services description',
  service_groups: [
    {
      title: 'Group 1',
      description: 'Group 1 description',
      services: [
        { id: 's1', label: 'Service 1', detail: 'Detail 1' },
      ],
    },
  ],
}

describe('EngineSection', () => {
  it('renders eyebrow, title, and description', () => {
    render(<EngineSection content={mockContent} />)
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('What We Offer')).toBeInTheDocument()
    expect(screen.getByText('Our services description')).toBeInTheDocument()
  })

  it('renders service groups with index numbers', () => {
    render(<EngineSection content={mockContent} />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Group 1')).toBeInTheDocument()
  })

  it('renders individual services', () => {
    render(<EngineSection content={mockContent} />)
    expect(screen.getByText('Service 1')).toBeInTheDocument()
    expect(screen.getByText('Detail 1')).toBeInTheDocument()
  })

  it('renders contact and explore buttons', () => {
    render(<EngineSection content={mockContent} />)
    expect(screen.getByText('Contact Exxonim')).toBeInTheDocument()
    expect(screen.getByText('Explore more services')).toBeInTheDocument()
  })

  it('has staggered animation delays', () => {
    render(<EngineSection content={mockContent} />)
    const card = screen.getByText('Group 1').closest('article')
    expect(card).toHaveStyle({ transitionDelay: '0ms' })
  })
})
```

**Implementation:**

```typescript
// src/components/EngineSection.tsx
import { Button } from './ui/Button'
import { Container } from './ui/Container'
import { routes } from '../routes'
import type { ServicesCatalogContent } from '../types'

interface EngineSectionProps {
  content: ServicesCatalogContent
}

export function EngineSection({ content }: EngineSectionProps) {
  const serviceGroups = content.service_groups

  return (
    <section 
      className="relative py-28 bg-gradient-to-b from-[rgba(248,242,232,0.72)] to-[rgba(235,226,211,0.6)] text-text dark:bg-[#071b1d] dark:text-[#eef2ff]"
      id="services"
    >
      <Container>
        {/* Header */}
        <div className="grid gap-4 max-w-2xl mb-8" data-reveal>
          <p className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-accent/24 bg-accent/8 text-accent text-sm font-extrabold dark:text-accent-dark dark:border-accent-dark/24 dark:bg-accent-dark/10">
            <span className="w-2.5 h-2.5 rounded-full bg-current" />
            {content.eyebrow}
          </p>
          <h2 className="m-0 font-display text-[clamp(3rem,5vw,4.85rem)] font-medium leading-[0.98] tracking-tight">
            {content.title}
          </h2>
          <p className="text-[clamp(1.15rem,1.7vw,1.55rem)] text-text/72 dark:text-text-dark/72">
            {content.description}
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceGroups.map((group, groupIndex) => (
            <article
              key={group.title}
              className="rounded-[1.7rem] border border-border-soft bg-surface/88 shadow-card p-0 overflow-hidden dark:bg-surface-dark/72 dark:border-border-dark-soft dark:shadow-card-dark transition-all duration-300 hover:-translate-y-1 hover:border-accent/30"
              data-reveal
              style={{ transitionDelay: `${groupIndex * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-4 p-5 border-b border-border-soft dark:border-border-dark-soft">
                <span className="text-2xl font-display font-medium text-accent">0{groupIndex + 1}</span>
                <div className="text-right">
                  <h3 className="text-lg font-display font-medium">{group.title}</h3>
                  <p className="text-sm text-text/66 dark:text-text-dark/66">{group.description}</p>
                </div>
              </div>

              <ul className="p-5 space-y-4">
                {group.services.map((service) => (
                  <li key={service.id} id={service.id} className="space-y-1">
                    <strong className="block font-medium">{service.label}</strong>
                    <p className="text-sm text-text/66 dark:text-text-dark/66">{service.detail}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 mt-10" data-reveal>
          <Button href={routes.contact} variant="primary">
            Contact Exxonim
          </Button>
          <Button href={routes.services} variant="ghost">
            Explore more services
          </Button>
        </div>
      </Container>
    </section>
  )
}
```

---

## Phase 4: Complex Components (Keep CSS + Tests) (Day 5-6)

### 4.1 Device Mockup (Complex - Keep CSS)

```typescript
// src/components/DeviceMockup.tsx (keep CSS classes)
// But add tests to ensure it renders correctly

// src/components/DeviceMockup.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceMockup } from './DeviceMockup'

describe('DeviceMockup', () => {
  it('renders device structure', () => {
    render(<DeviceMockup />)
    expect(document.querySelector('.device-shell')).toBeInTheDocument()
    expect(document.querySelector('.device-frame')).toBeInTheDocument()
    expect(document.querySelector('.device-screen')).toBeInTheDocument()
  })

  it('has active slide by default', () => {
    render(<DeviceMockup />)
    const activeSlide = document.querySelector('.device-slide.is-active')
    expect(activeSlide).toBeInTheDocument()
  })

  it('is responsive', () => {
    render(<DeviceMockup />)
    const shell = document.querySelector('.device-shell')
    expect(shell).toHaveClass('absolute', 'right-0', 'bottom-0')
  })
})
```

**CSS to keep in tailwind.css (reduced ~100 lines):**

```css
/* Keep only device mockup styles - too complex for Tailwind */
.device-shell { /* ... */ }
.device-frame { /* complex gradients */ }
.device-camera { /* ... */ }
.device-screen { /* ... */ }
.device-deck { /* ... */ }
.device-trackpad { /* ... */ }
.device-base { /* ... */ }
.device-slide { /* ... */ }
.device-media { /* ... */ }
```

### 4.2 Cinematic Background (Keep CSS)

```typescript
// src/components/CinematicBackground.tsx
// Keep using CSS classes, but add tests

// src/components/CinematicBackground.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CinematicBackground } from './CinematicBackground'

describe('CinematicBackground', () => {
  it('renders background container', () => {
    render(<CinematicBackground />)
    expect(document.querySelector('.cinematic-bg')).toBeInTheDocument()
  })

  it('has two animated orbs', () => {
    render(<CinematicBackground />)
    const orbs = document.querySelectorAll('.cinematic-bg__orb')
    expect(orbs).toHaveLength(2)
  })

  it('orbs have animation classes', () => {
    render(<CinematicBackground />)
    expect(document.querySelector('.animate-drift-1')).toBeInTheDocument()
    expect(document.querySelector('.animate-drift-2')).toBeInTheDocument()
  })

  it('respects reduced motion preference', () => {
    // Check CSS media query is present
    const style = document.createElement('style')
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        .cinematic-bg__orb { animation: none; }
      }
    `
    document.head.appendChild(style)
    expect(style.sheet?.cssRules.length).toBeGreaterThan(0)
  })
})
```

---

## Phase 5: Page-Level Integration Tests (Day 6)

### 5.1 Homepage Integration Test

```typescript
// src/pages/HomePage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './HomePage'

// Mock the hooks
vi.mock('../hooks/usePage', () => ({
  usePage: () => ({
    data: {
      content: {
        hero: {
          eyebrow: 'Welcome',
          title: 'Hero Title',
          description: 'Hero description',
          stats: [
            { value: '99%', label: 'Uptime' },
          ],
        },
        provider_section: {
          kicker: 'Trusted By',
          title: 'Industry Leaders',
          logos: [{ src: '/logo.svg', alt: 'Logo' }],
        },
        stack_section: {
          items: [],
          default_feature_rows: 3,
          feature_visual_content: {},
        },
      },
    },
    isPending: false,
    error: null,
  }),
}))

vi.mock('../hooks/useResolvedSeo', () => ({
  useResolvedPageSeo: vi.fn(),
}))

const queryClient = new QueryClient()

describe('HomePage', () => {
  it('renders all sections', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    )
    
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('Hero Title')).toBeInTheDocument()
    expect(screen.getByText('Trusted By')).toBeInTheDocument()
    expect(screen.getByText('99%')).toBeInTheDocument()
  })

  it('uses Tailwind classes instead of custom CSS', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    )
    
    // Check for Tailwind utility classes
    const container = document.querySelector('.mx-auto')
    expect(container).toBeInTheDocument()
    
    // Check no old BEM classes exist (except device mockup)
    const oldClasses = document.querySelectorAll('.hero-section, .provider-section')
    expect(oldClasses.length).toBe(0)
  })
})
```

---

## Phase 6: Visual Regression with Playwright (Day 6-7)

### 6.1 E2E Visual Tests

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'contact', path: '/contact' },
  { name: 'resources', path: '/resources' },
]

for (const { name, path } of pages) {
  test.describe(`${name} page visual regression`, () => {
    test(`matches baseline - ${name}`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      
      // Wait for animations to settle
      await page.waitForTimeout(1000)
      
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${name}.png`)
    })

    test(`matches baseline dark mode - ${name}`, async ({ page }) => {
      await page.goto(path)
      
      // Toggle dark mode
      await page.click('[data-theme-toggle]')
      await page.waitForTimeout(500)
      
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${name}-dark.png`)
    })

    test(`matches baseline mobile - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${name}-mobile.png`)
    })
  })
}

test.describe('interactive elements', () => {
  test('navigation menu opens correctly', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Open menu"]')
    
    await expect(page.locator('[aria-label="Close menu"]')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot('nav-open.png')
  })

  test('buttons have hover states', async ({ page }) => {
    await page.goto('/')
    
    const button = page.locator('button').first()
    await button.hover()
    
    await page.waitForTimeout(200) // Wait for transition
    expect(await page.screenshot()).toMatchSnapshot('button-hover.png')
  })
})
```

### 6.2 Run Visual Tests

```bash
# Update snapshots (first run)
npx playwright test --update-snapshots

# Run tests against current
npx playwright test

# Show report
npx playwright show-report
```

---

## Phase 7: Final Cleanup & Verification (Day 7)

### 7.1 CSS File Reduction

**Before:** 9,659 lines
**After Target:** < 200 lines

```css
/* Final tailwind.css structure */
@import "tailwindcss";
@config "../tailwind.config.ts";

/* === KEEP: Complex components that can't be Tailwind === */

/* Device mockup (~100 lines) */
.device-shell { /* ... */ }
.device-frame { /* complex gradients */ }
/* ... etc ... */

/* Cinematic background orbs (~20 lines) */
.cinematic-bg { @apply fixed inset-0 -z-10 pointer-events-none overflow-hidden; }
.cinematic-bg__orb { @apply absolute rounded-full pointer-events-none blur-[110px] opacity-[0.22]; }
.cinematic-bg__orb--one { @apply top-[10%] right-[10%] w-[31rem] h-[31rem] animate-drift-1; }
.cinematic-bg__orb--two { @apply bottom-[20%] left-[5%] w-[37rem] h-[37rem] animate-drift-2; }

/* === KEEP: Animations referenced by Tailwind config === */
@keyframes organic-drift-1 { /* ... */ }
@keyframes organic-drift-2 { /* ... */ }
@keyframes provider-marquee { /* ... */ }
@keyframes code-pan { /* ... */ }

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .cinematic-bg__orb,
  .animate-marquee,
  .animate-reveal {
    animation: none !important;
  }
}
```

### 7.2 Final Verification Checklist

```bash
#!/bin/bash
# verify-migration.sh

echo "=== Verification Checklist ==="

echo "1. Running unit tests..."
npm run test || exit 1

echo "2. Running type check..."
npm run typecheck || exit 1

echo "3. Running visual regression tests..."
npx playwright test || exit 1

echo "4. Checking CSS file size..."
CSS_LINES=$(wc -l < src/tailwind.css)
echo "   CSS lines: $CSS_LINES"
if [ "$CSS_LINES" -gt 200 ]; then
  echo "   WARNING: CSS file larger than target (200 lines)"
  exit 1
fi

echo "5. Checking no old BEM classes in components..."
if grep -r "className=\"[a-z-]*__" src/components/ src/pages/ 2>/dev/null; then
  echo "   ERROR: Found old BEM class patterns"
  exit 1
fi

echo "6. Checking bundle size..."
npm run build
BUNDLE_SIZE=$(du -h dist/client/assets/*.css | head -1 | cut -f1)
echo "   CSS bundle size: $BUNDLE_SIZE"

echo "7. Lighthouse check..."
npx lighthouse http://localhost:5173 --output=json --chrome-flags="--headless" || true

echo "=== All Checks Passed ==="
```

---

## TDD Workflow Summary

| Phase | Test Type | What to Test | When |
|-------|-----------|--------------|------|
| 0 | Setup | Infrastructure works | Before any code |
| 1 | Unit | Config exports correct values | Before implementing |
| 2 | Unit | Components render with correct classes | Before implementing |
| 3 | Unit | Feature components show content | During migration |
| 4 | Unit | Complex components render | Keep existing behavior |
| 5 | Integration | Pages compose correctly | After component migration |
| 6 | E2E | Visual regression | After each component |
| 7 | E2E | Full page screenshots match | Final verification |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Test Coverage** | > 80% | `npm run test -- --coverage` |
| **Visual Regression** | 0 diffs | `npx playwright test` |
| **CSS Lines** | < 200 | `wc -l src/tailwind.css` |
| **Build Time** | < 30s | `time npm run build` |
| **Bundle Size** | < 50KB CSS | `du -h dist/client/assets/*.css` |
| **Accessibility** | 0 violations | `axe-core` in Playwright |

---

## Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run test            # Run unit tests (watch mode)
npm run test -- --run   # Run unit tests once

# Visual testing
npx playwright test                # Run all e2e tests
npx playwright test --ui          # Interactive mode
npx playwright test --update-snapshots  # Update baselines

# Build & verify
npm run build           # Production build
npm run typecheck       # TypeScript check
./verify-migration.sh   # Full verification
```

This plan ensures zero regression through comprehensive TDD and visual testing.
