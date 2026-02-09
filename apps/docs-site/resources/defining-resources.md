# Defining Resources

Learn how to create and customize resources in Filament.

## Basic Resource

```typescript
import { Resource } from '@filament-ts/resources'

export class UserResource extends Resource {
  static model = 'User'
  static label = 'User'
  static pluralLabel = 'Users'
  static icon = 'users'
}
```

## Resource Configuration

### Model

```typescript
static model = 'User'  // Reference to your data model
```

### Labels

```typescript
static label = 'User'
static pluralLabel = 'Users'
```

### Navigation

```typescript
static navigation = {
  group: 'People',      // Navigation group
  sort: 1,              // Sort order
  icon: 'users',        // Icon name
}
```

### Routes

```typescript
static routes = {
  index: '/users',
  create: '/users/create',
  edit: '/users/:id/edit',
  view: '/users/:id',
}
```

## Authorization

Control who can access the resource:

```typescript
static canView(user: User): boolean {
  return user.can('view any users')
}

static canCreate(user: User): boolean {
  return user.can('create users')
}

static canUpdate(user: User, record: User): boolean {
  return user.can('edit users') || user.id === record.id
}

static canDelete(user: User, record: User): boolean {
  return user.can('delete users')
}
```

## Next

- [Forms](/resources/forms)
- [Tables](/resources/tables)
