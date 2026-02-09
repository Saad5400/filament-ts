# Authentication

Configure authentication for your Filament panel.

## Basic Auth

```typescript
auth: {
  guard: 'web',
  loginRoute: '/login',
  redirectAfterLogin: '/admin',
  redirectAfterLogout: '/',
}
```

## Custom Login

```typescript
auth: {
  login: {
    route: '/admin/login',
    template: 'auth.custom-login',
  },
}
```

## Two-Factor Authentication

Enable 2FA for enhanced security:

```typescript
auth: {
  twoFactor: {
    enabled: true,
    route: '/admin/2fa-challenge',
  },
}
```

## Password Reset

```typescript
auth: {
  passwordReset: {
    enabled: true,
    route: '/admin/forgot-password',
  },
}
```

## Authorization Gates

Define custom authorization gates:

```typescript
export default definePanel({
  auth: {
    gates: [
      (user, ability, resource) => {
        // Custom authorization logic
        return user.can(ability)
      },
    ],
  },
})
```

## Next

- [Configuration](/panels/configuration)
- [Navigation](/panels/navigation)
