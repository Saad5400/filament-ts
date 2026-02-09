import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/dist/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@filament-ts/support': resolve(__dirname, './packages/support/src'),
      '@filament-ts/schemas': resolve(__dirname, './packages/schemas/src'),
      '@filament-ts/ui': resolve(__dirname, './packages/ui/src'),
      '@filament-ts/forms': resolve(__dirname, './packages/forms/src'),
      '@filament-ts/tables': resolve(__dirname, './packages/tables/src'),
      '@filament-ts/infolists': resolve(__dirname, './packages/infolists/src'),
      '@filament-ts/actions': resolve(__dirname, './packages/actions/src'),
      '@filament-ts/widgets': resolve(__dirname, './packages/widgets/src'),
      '@filament-ts/notifications': resolve(__dirname, './packages/notifications/src'),
      '@filament-ts/resources': resolve(__dirname, './packages/resources/src'),
      '@filament-ts/panels': resolve(__dirname, './packages/panels/src'),
    },
  },
})
