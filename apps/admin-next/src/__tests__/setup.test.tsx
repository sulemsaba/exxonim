import { describe, it, expect } from 'vitest';

// ----------------------------------------------------------------------

describe('Test infrastructure', () => {
  it('is set up correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('has jsdom environment', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });

  it('can create DOM elements', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello';
    expect(div.textContent).toBe('Hello');
  });
});
