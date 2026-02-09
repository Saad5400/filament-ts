# Navigation

Customize the navigation structure of your panel.

## Resource Navigation

Resources are automatically added to navigation. Control their placement:

```typescript
export class UserResource extends Resource {
  static navigation = {
    group: 'People',
    sort: 1,
    icon: 'users',
    label: 'Users',
  }
}
```

## Custom Navigation Items

Add custom navigation items:

```typescript
export default definePanel({
  // ...
  navigation: {
    items: [
      NavigationItem.make('dashboard')
        ->label('Dashboard')
        ->icon('dashboard')
        ->url('/admin/dashboard')
        ->sort(0),

      NavigationGroup.make('People')
        ->items([
          UserResource,
          CustomerResource,
        ]),
    ],
  },
})
```

## Navigation Groups

Group related resources together:

```typescript
static navigation = {
  group: 'Blog',  // Groups this under "Blog"
}
```

## User Menu

Customize the user menu in the top right:

```typescript
userMenu: {
  items: [
    UserMenuItem.make('profile')
      ->label('Profile')
      ->url('/admin/profile'),

    UserMenuItem.make('logout')
      ->label('Logout')
      ->action('logout'),
  ],
}
```

## Clusters

Create navigation clusters for related resources:

```typescript
export const blogCluster = defineCluster({
  name: 'Blog',
  icon: 'document-text',
  resources: [
    PostResource,
    CommentResource,
    CategoryResource,
  ],
})

// Register in panel
export default definePanel({
  clusters: [blogCluster],
  // ...
})
```

## Next

- [Branding](/panels/branding)
- [Authentication](/panels/authentication)
