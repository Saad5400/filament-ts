# Introduction

Filament TypeScript is a Server-Driven UI (SDUI) framework for building beautiful admin panels in TypeScript. It is inspired by [Laravel Filament](https://filamentphp.com) but designed for the TypeScript/JavaScript ecosystem.

## What is Server-Driven UI?

In a Server-Driven UI approach, the server sends **schema objects** (JSON) that describe the UI structure, and the client renders them. This means:

- **No frontend code required** for building CRUD interfaces
- **Instant updates** to UI without redeploying the frontend
- **Shared types** between server and client for full type safety
- **Consistent UI** across your entire application

## Key Features

### Forms
Define forms with 20+ field types, validation, and multi-step wizards.

```typescript
const userForm = new Form()
  .schema([
    new TextField('name')
      .label('Name')
      .required()
      .minLength(3),

    new EmailField('email')
      .label('Email')
      .required(),

    new SelectField('role')
      .label('Role')
      .options([
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ]),
  ])
  .method('POST')
  .action('/api/users')
```

### Tables
Build sortable, filterable tables with actions.

```typescript
const userTable = new Table()
  .columns([
    TextColumn.make('name').sortable().searchable(),
    TextColumn.make('email').sortable(),
    BooleanColumn.make('active').toggle(),
  ])
  .filters([
    SelectFilter.make('role').options(RoleOptions),
    TernaryFilter.make('active'),
  ])
  .actions([
    EditAction.make(),
    DeleteAction.make(),
  ])
```

### Resources
Orchestrate complete CRUD interfaces with minimal code.

```typescript
class UserResource extends Resource {
  static form(form: Form): Form {
    return form.schema([
      // ... fields
    ])
  }

  static table(table: Table): Table {
    return table.columns([
      // ... columns
    ])
  }
}
```

## Philosophy

1. **Declarative First**: Describe what you want, not how to build it
2. **Type Safe**: Leverage TypeScript for compile-time guarantees
3. **Convention over Configuration**: Sensible defaults with customization options
4. **Framework Agnostic**: Core libraries work with any frontend framework
5. **Progressive**: Start simple, adopt advanced features when needed
