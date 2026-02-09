# Type Safety

One of the key advantages of Filament TypeScript is full type safety from server to client.

## Shared Types

Types are shared between server and client through the `@filament-ts/schemas` package:

```typescript
import { Form, TextField, EmailField } from '@filament-ts/forms'

// This type is inferred from the schema
type FormData = {
  name: string
  email: string
}

const form = new Form()
  .schema([
    TextField.make('name').required(),
    EmailField.make('email').required(),
  ])
```

## Type Inference

Filament automatically infers types from your schema definitions:

```typescript
const userForm = new Form()
  .schema([
    TextField.make('name'),
    NumberField.make('age'),
    BooleanField.make('active'),
  ])

// Inferred type: { name: string; age: number; active: boolean }
type UserFormData = InferFormData<typeof userForm>
```

## Schema Validation

Schemas can be validated at compile time:

```typescript
// ❌ Type error: 'invalid-field' is not a valid field type
TextField.make('invalid-field').nonExistentMethod()

// ✅ Valid chain
TextField.make('name').label('Name').required().minLength(3)
```

## Next

- [Architecture](/guide/architecture)
- [Server Integration](/guide/server-integration)
