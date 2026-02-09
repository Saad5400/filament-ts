# Resources

Resources are the heart of Filament. A resource represents a data model in your application (like User, Post, or Product) and defines how it's displayed, created, edited, and deleted.

## Defining a Resource

```typescript
import { Resource } from '@filament-ts/resources'
import { Form } from '@filament-ts/forms'
import { Table } from '@filament-ts/tables'

export class UserResource extends Resource {
  // Resource configuration
  static model = 'User'
  static label = 'User'
  static pluralLabel = 'Users'
  static icon = 'users'

  // Define the create/edit form
  static form(form: Form): Form {
    // ...
  }

  // Define the list table
  static table(table: Table): Table {
    // ...
  }
}
```

## Resource Pages

Each resource automatically gets:

- **List Page**: Display records in a table with sorting, filtering, and pagination
- **Create Page**: Form for creating new records
- **Edit Page**: Form for editing existing records
- **View Page**: Read-only display of a single record (optional)

## Next

- [Defining Resources](/resources/defining-resources)
- [Forms](/resources/forms)
- [Tables](/resources/tables)
- [InfoLists](/resources/infolists)
