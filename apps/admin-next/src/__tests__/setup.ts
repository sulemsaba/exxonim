// ----------------------------------------------------------------------
// Test Environment Setup
// ----------------------------------------------------------------------

// Extend vitest's expect with jest-dom matchers (toBeInTheDocument, etc.)
import '@testing-library/jest-dom/vitest';

// React 19 in jsdom requires IS_REACT_ACT_ENVIRONMENT to be true
// so that act() warnings are suppressed.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// ----------------------------------------------------------------------
// Mock IntersectionObserver (not available in jsdom)
// ----------------------------------------------------------------------
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(globalThis, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true,
    configurable: true,
  });
}

// ----------------------------------------------------------------------
// Mock ResizeObserver (not available in jsdom)
// ----------------------------------------------------------------------
if (typeof globalThis.ResizeObserver === 'undefined') {
  class MockResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: MockResizeObserver,
    writable: true,
    configurable: true,
  });
}
