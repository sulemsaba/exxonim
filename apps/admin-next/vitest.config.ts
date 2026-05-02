import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(__dirname, 'src/$1'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@exxonim/admin-core',
        replacement: path.resolve(__dirname, '../../packages/admin-core/src'),
      },
      {
        find: /^@exxonim\/admin-core\/(.+)/,
        replacement: path.resolve(__dirname, '../../packages/admin-core/src/$1'),
      },
      {
        find: '@exxonim/shared',
        replacement: path.resolve(__dirname, '../../packages/shared/src'),
      },
      {
        find: /^@exxonim\/shared\/(.+)/,
        replacement: path.resolve(__dirname, '../../packages/shared/src/$1'),
      },
    ],
  },
});
