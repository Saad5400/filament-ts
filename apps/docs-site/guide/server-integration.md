# Server Integration

Filament TypeScript works with any backend framework through our adapter pattern.

## Supported Backends

### AdonisJS (Reference Implementation)

```bash
pnpm add @filament-ts/server-adonis
```

```typescript
// config/filament.ts
import { configureFilament } from '@filament-ts/server-adonis'
import { UserResource } from '#resources/user_resource'

export default configureFilament({
  panel: {
    name: 'admin',
    path: '/admin',
    resources: [UserResource],
  },
})
```

### NestJS

```bash
pnpm add @filament-ts/server-nestjs
```

### Express / Fastify / Hono

```bash
pnpm add @filament-ts/server-generic
```

## ORM Integration

Filament works with any ORM through adapters:

- **Drizzle ORM**: `@filament-ts/orm-drizzle`
- **Prisma**: `@filament-ts/orm-prisma`
- **Lucid** (built-in for AdonisJS)

```typescript
import { DrizzleAdapter } from '@filament-ts/orm-drizzle'

const adapter = new DrizzleAdapter(db)

// Use with resources
export class UserResource extends Resource {
  static ormAdapter = adapter
  // ...
}
```

## Custom Adapter

Create your own adapter by implementing the adapter interface:

```typescript
interface ServerAdapter {
  handleRequest(request: Request): Promise<Response>
  authenticate(credentials: Credentials): Promise<User | null>
  authorize(user: User, ability: string, resource: any): boolean
}
```

## Next

- [Resources](/resources/)
- [Panels](/panels/)
