import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Filament TypeScript',
  description: 'Server-Driven UI framework for admin panels in TypeScript',
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Resources', link: '/resources/' },
      { text: 'Panels', link: '/panels/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Server-Driven UI', link: '/guide/sdui' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Type Safety', link: '/guide/type-safety' },
          ],
        },
      ],
      '/resources/': [
        {
          text: 'Resources',
          items: [
            { text: 'Overview', link: '/resources/' },
            { text: 'Defining Resources', link: '/resources/defining-resources' },
            { text: 'Forms', link: '/resources/forms' },
            { text: 'Tables', link: '/resources/tables' },
            { text: 'InfoLists', link: '/resources/infolists' },
          ],
        },
      ],
      '/panels/': [
        {
          text: 'Panels',
          items: [
            { text: 'Overview', link: '/panels/' },
            { text: 'Configuration', link: '/panels/configuration' },
            { text: 'Navigation', link: '/panels/navigation' },
            { text: 'Branding', link: '/panels/branding' },
            { text: 'Authentication', link: '/panels/authentication' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/filament-ts/filament-ts' },
    ],

    search: {
      provider: 'local',
    },
  },
})
