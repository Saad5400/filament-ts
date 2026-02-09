# Panel Configuration

Configure your Filament panel with branding, theme, and behavior settings.

## Basic Configuration

```typescript
import { definePanel } from '@filament-ts/panels'

export default definePanel({
  name: 'admin',
  path: '/admin',
  resources: [
    UserResource,
    PostResource,
  ],
})
```

## Branding

```typescript
branding: {
  title: 'My Admin Panel',
  logo: '/logo.svg',
  logoHeight: '40px',
  favicon: '/favicon.ico',
}
```

## Theme

```typescript
theme: {
  darkMode: 'auto',  // 'auto' | 'enabled' | 'disabled'
  primaryColor: 'blue',
  font: 'sans',
  borderRadius: '0.5rem',
}
```

## Middleware

```typescript
middleware: [
  'auth',
  'verify.panel',
]
```

## Auth Guard

```typescript
auth: {
  guard: 'web',
  loginRoute: '/login',
  redirectAfterLogin: '/admin',
}
```

## Database Notifications

```typescript
databaseNotifications: true,
notificationPolling: 30000, // ms
```

## Next

- [Navigation](/panels/navigation)
- [Branding](/panels/branding)
- [Authentication](/panels/authentication)
