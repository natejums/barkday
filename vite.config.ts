import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages under /barkday/, but served from the root in dev.
// `vite preview` reports command === 'serve', so it needs naming separately:
// without it preview serves the built page at / while that page asks for
// /barkday/assets/*, and the app comes up blank.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/barkday/' : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Double-underscore names are throwaway debugging probes (also gitignored).
    // Excluded so a stray one can never join the suite as a test that passes
    // without asserting anything.
    exclude: [...configDefaults.exclude, '**/__*'],
  },
}))
