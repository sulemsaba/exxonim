import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/admin/',
  // Keep the Vite cache in the repo-root node_modules so dev does not depend on
  // write access inside this workspace-local node_modules directory.
  cacheDir: path.resolve(process.cwd(), '../../node_modules/.vite/admin-next'),
  plugins: [
    tailwindcss(),
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@',
        replacement: path.resolve(process.cwd(), 'src'),
      },
      {
        find: '@exxonim/admin-core',
        replacement: path.resolve(process.cwd(), '../../packages/admin-core/src'),
      },
      {
        find: '@exxonim/shared',
        replacement: path.resolve(process.cwd(), '../../packages/shared/src'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
}));
