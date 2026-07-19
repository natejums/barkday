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
    // jsdom renders the whole app, 247-breed combobox included, and the engine
    // fuzz pass makes ~1235 calls. Both are fast in isolation (~250ms) and both
    // brush the 5s default once several files run in parallel on a loaded
    // machine. A flaky red run teaches people to stop reading CI.
    testTimeout: 20_000,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Scratch probes are named `__*` or `tmp*` by convention and gitignored, so
    // a stray one can neither join the suite nor reach the repo. Worth having:
    // an automated review left throwaway probes behind here more than once, one
    // of which threw on purpose to dump state and simply failed the suite.
    exclude: [...configDefaults.exclude, '**/__*', '**/tmp*.test.*'],
  },
}))
