# Branding

Customize the look and feel of your Filament panel.

## Logo

```typescript
branding: {
  logo: '/logo.svg',
  logoHeight: '40px',
  logoWidth: 'auto',
}
```

## Colors

```typescript
branding: {
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
}
```

## Theme Options

```typescript
theme: {
  darkMode: 'auto',  // 'auto' | 'enabled' | 'disabled'
  primaryColor: 'blue',  // 'blue' | 'red' | 'green' | 'purple' | etc.
  font: 'sans',  // 'sans' | 'serif' | 'mono'
  borderRadius: '0.5rem',
}
```

## Favicon

```typescript
branding: {
  favicon: '/favicon.ico',
}
```

## Render Hooks

Inject custom content at specific points:

```typescript
renderHooks: {
  'head-end': () => `
    <link rel="preconnect" href="https://fonts.googleapis.com">
  `,
  'body-start': () => `
    <div id="custom-portal"></div>
  `,
}
```

## Next

- [Authentication](/panels/authentication)
- [Configuration](/panels/configuration)
