/// <reference types="node" />

import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { cn } from 'src/utils/cn';

// ----------------------------------------------------------------------

describe('Design tokens', () => {
  const tailwindCssPath = path.resolve(__dirname, '../app/tailwind.css');
  const tailwindCss = fs.readFileSync(tailwindCssPath, 'utf-8');

  it('tailwind.css file exists', () => {
    expect(fs.existsSync(tailwindCssPath)).toBe(true);
  });

  it('has @theme directive', () => {
    expect(tailwindCss).toContain('@theme');
  });

  it('has primary color scale', () => {
    expect(tailwindCss).toContain('--color-primary-500');
    expect(tailwindCss).toContain('#167AFF');
  });

  it('has grey palette', () => {
    expect(tailwindCss).toContain('--color-grey-50');
    expect(tailwindCss).toContain('--color-grey-900');
  });

  it('has semantic color tokens', () => {
    expect(tailwindCss).toContain('--color-background:');
    expect(tailwindCss).toContain('--color-text-primary:');
    expect(tailwindCss).toContain('--color-divider:');
  });

  it('has system font stack', () => {
    expect(tailwindCss).toContain('system-ui');
    expect(tailwindCss).toContain('--font-family-sans');
  });

  it('has shadow tokens', () => {
    expect(tailwindCss).toContain('--shadow-card');
    expect(tailwindCss).toContain('--shadow-dropdown');
    expect(tailwindCss).toContain('rgba');
  });

  it('has spacing tokens', () => {
    expect(tailwindCss).toContain('--spacing-nav-width: 280px');
    expect(tailwindCss).toContain('--spacing-header-height: 68px');
  });

  it('has dark mode overrides', () => {
    expect(tailwindCss).toContain('[data-color-scheme="dark"]');
    expect(tailwindCss).toContain('--color-background: #141A21');
  });

  it('has scrollbar styles', () => {
    expect(tailwindCss).toContain('.scrollbar-thin');
    expect(tailwindCss).toContain('scrollbar-width: thin');
  });

  it('has status colors', () => {
    expect(tailwindCss).toContain('--color-error-500');
    expect(tailwindCss).toContain('--color-warning-500');
    expect(tailwindCss).toContain('--color-success-500');
    expect(tailwindCss).toContain('--color-info-500');
  });
});

describe('cn utility', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, undefined, 'b', null)).toBe('a b');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles single argument', () => {
    expect(cn('only')).toBe('only');
  });
});
