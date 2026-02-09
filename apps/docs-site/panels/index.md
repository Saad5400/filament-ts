# Panels

A Panel is a complete admin interface. It contains resources, navigation, branding, and authentication configuration.

## Panel Configuration

```typescript
import { definePanel } from '@filament-ts/panels'

export default definePanel({
  name: 'admin',
  path: '/admin',

  // Resources to include
  resources: [
    UserResource,
    PostResource,
    CommentResource,
  ],

  // Branding
  branding: {
    title: 'My Admin',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
  },

  // Authentication
  auth: {
    guard: 'web',
    loginRoute: '/login',
  },

  // Theme
  theme: {
    darkMode: true,
    primaryColor: 'blue',
  },
})
```

## Multi-Panel Support

You can create multiple panels for different purposes:

```typescript
// Admin panel for internal users
export const adminPanel = definePanel({
  name: 'admin',
  path: '/admin',
  // ...
})

// Public panel for customers
export const customerPanel = definePanel({
  name: 'customer',
  path: '/customer',
  // ...
})
```

## Next

- [Configuration](/panels/configuration)
- [Navigation](/panels/navigation)
- [Branding](/panels/branding)
- [Authentication](/panels/authentication)
