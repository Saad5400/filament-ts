# ADR-003: ORM Strategy - Adapter Pattern

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Context

Different teams use different ORMs. Rather than committing to a single ORM, Filament TypeScript should support multiple ORMs through a common adapter interface.

## Decision

**ORM-agnostic with adapter pattern**. Support multiple ORMs through a unified interface.

## Supported ORMs (Phase 1)

| Package | ORM | Use Case |
|---------|-----|----------|
| @filament-ts/orm-drizzle | Drizzle | Primary recommendation, edge-compatible |
| @filament-ts/orm-prisma | Prisma | Alternative with excellent DX |
| @filament-ts/orm-lucid | Lucid | Built-in for AdonisJS users |

## ORM Adapter Interface

```typescript
interface ORMAdapter<T = any> {
  // Query operations
  findMany(model: ModelConfig, query: Query): Promise<T[]>
  findOne(model: ModelConfig, id: string | number): Promise<T | null>
  count(model: ModelConfig, query: Query): Promise<number>

  // Mutation operations
  create(model: ModelConfig, data: Record<string, any>): Promise<T>
  update(model: ModelConfig, id: string | number, data: Record<string, any>): Promise<T>
  delete(model: ModelConfig, id: string | number): Promise<void>

  // Transaction support
  transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>
}
```

## Rationale

### Drizzle ORM (Primary)
- 2025 momentum - teams migrating from Prisma to Drizzle
- SQL-transparent (type-safe without hiding SQL)
- Edge-native (Cloudflare Workers compatible)
- Smaller bundle sizes

### Prisma (Alternative)
- Industry standard for type safety
- Excellent developer experience
- Best-in-class migration system
- Superior complex query handling

### Lucid (AdonisJS)
- Built into AdonisJS
- Eloquent-like API (familiar to Laravel developers)
- No additional installation needed for AdonisJS users

## Consequences

### Positive
- Developers can use their preferred ORM
- Not locked into a single ecosystem
- Can add new ORM adapters as community needs arise

### Negative
- More maintenance surface (multiple adapters)
- Slightly more complex setup (must choose and configure adapter)

## References

- Drizzle Documentation: https://orm.drizzle.team
- Prisma Documentation: https://www.prisma.io
