import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@filament-ts/support': resolve(__dirname, '../../packages/support/src'),
      '@filament-ts/schemas': resolve(__dirname, '../../packages/schemas/src'),
      '@filament-ts/ui': resolve(__dirname, '../../packages/ui/src'),
      '@filament-ts/forms': resolve(__dirname, '../../packages/forms/src'),
      '@filament-ts/tables': resolve(__dirname, '../../packages/tables/src'),
      '@filament-ts/infolists': resolve(__dirname, '../../packages/infolists/src'),
      '@filament-ts/actions': resolve(__dirname, '../../packages/actions/src'),
      '@filament-ts/widgets': resolve(__dirname, '../../packages/widgets/src'),
      '@filament-ts/notifications': resolve(__dirname, '../../packages/notifications/src'),
      '@filament-ts/resources': resolve(__dirname, '../../packages/resources/src'),
      '@filament-ts/panels': resolve(__dirname, '../../packages/panels/src'),
    },
  },
  server: {
    port: 5173,
  },
  test: {
    passWithNoTests: true,
  },
})
