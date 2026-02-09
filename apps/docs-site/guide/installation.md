# Installation

Learn how to install and configure Filament TypeScript in your project.

## Requirements

- **Node.js** 22 or higher
- **pnpm** 9 or higher

## Quick Install

```bash
# Install the packages package
pnpm add @filament-ts/panels @filament-ts/resources

# Install for AdonisJS (optional)
pnpm add @filament-ts/server-adonis
```

## Manual Setup

### 1. Create a Panel

Create a new panel configuration:

```typescript
// config/filament.ts
import { definePanel } from '@filament-ts/panels'

export default definePanel({
  name: 'admin',
  path: '/admin',
  resources: [
    // ... register resources
  ],
  branding: {
    title: 'My Admin Panel',
    logo: '/logo.svg',
  },
})
```

### 2. Register the Plugin

In your application entry point:

```typescript
import { createApp } from 'vue'
import { FilamentPlugin } from '@filament-ts/panels'
import panelConfig from './config/filament'

const app = createApp(App)

app.use(FilamentPlugin, {
  panel: panelConfig,
})
```

### 3. Run Your App

```bash
pnpm dev
```

Visit `/admin` to see your Filament panel.

## Next Steps

- [Quick Start](/guide/quick-start) - Build your first resource
- [Server Integration](/guide/server-integration) - Connect your backend
