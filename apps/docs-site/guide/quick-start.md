# Quick Start

Build your first Filament resource in under 5 minutes.

## Step 1: Define a Resource

Create a new resource class:

```typescript
// app/resources/UserResource.ts
import { Resource } from '@filament-ts/resources'
import { Form } from '@filament-ts/forms'
import { Table } from '@filament-ts/tables'
import {
  TextField,
  EmailField,
  BooleanField,
} from '@filament-ts/forms'
import {
  TextColumn,
  BooleanColumn,
} from '@filament-ts/tables'
import { EditAction, DeleteAction } from '@filament-ts/actions'

export class UserResource extends Resource {
  static model = 'User'
  static label = 'User'
  static pluralLabel = 'Users'
  static icon = 'users'

  static form(form: Form): Form {
    return form.schema([
      TextField.make('name')
        .label('Name')
        .required()
        .minLength(3),

      EmailField.make('email')
        .label('Email')
        .required()
        .unique(),

      BooleanField.make('active')
        .label('Active')
        .default(true),
    ])
  }

  static table(table: Table): Table {
    return table
      .columns([
        TextColumn.make('name')
          .label('Name')
          .sortable()
          .searchable(),

        TextColumn.make('email')
          .label('Email')
          .sortable(),

        BooleanColumn.make('active')
          .label('Active')
          .sortable(),
      ])
      .actions([
        EditAction.make(),
        DeleteAction.make(),
      ])
  }
}
```

## Step 2: Register the Resource

Add it to your panel configuration:

```typescript
// config/filament.ts
import { definePanel } from '@filament-ts/panels'
import { UserResource } from '../resources/UserResource'

export default definePanel({
  name: 'admin',
  path: '/admin',
  resources: [
    UserResource,
  ],
})
```

## Step 3: View Your Resource

Visit `/admin/users` to see your new resource with:
- A listing table with sortable columns
- Create and edit forms
- Delete actions
- Full CRUD functionality

## What's Next?

- Customize your [forms](/resources/forms) with more field types
- Add [filters](/resources/tables#filters) to your tables
- Configure [table actions](/resources/tables#actions)
- Set up [authentication](/panels/authentication)
