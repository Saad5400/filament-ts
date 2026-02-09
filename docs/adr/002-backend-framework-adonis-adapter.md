# ADR-002: Backend Framework - AdonisJS with Adapter Pattern

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Context

Filament TypeScript needs backend integration. Unlike Filament PHP (which is Laravel-only), this project should support multiple backend frameworks through an adapter pattern.

## Decision

**AdonisJS** as the reference implementation, with an **adapter pattern** to support other frameworks.

## Alternatives Considered

### NestJS
**Strengths**:
- Largest ecosystem and adoption
- Excellent TypeScript support with decorators
- Enterprise-grade patterns
- 65k+ GitHub stars

**Why not chosen as reference**:
- Higher learning curve
- Less familiar to Laravel developers
- Requires separate selection of ORM, auth, validation

### Hono
**Strengths**:
- Best performance
- Multi-runtime support
- Excellent TypeScript inference

**Why not chosen as reference**:
- No built-in ORM, auth, validation (more to assemble)
- Less opinionated
- Not enterprise-focused

## Rationale

AdonisJS is the "Laravel of Node.js":

| Laravel | AdonisJS |
|---------|----------|
| Service Providers | Service Providers |
| Facades | Facades |
| Artisan CLI | Ace CLI |
| Eloquent ORM | Lucid ORM |
| Migrations | Migrations |
| Seeders | Seeders |
| Request Validation | Request Validators |
| Middleware | Middleware |
| Policies | Policies |
| Mail | Mail |
| Queues | Queues (Bull) |
| Scheduling | Scheduling |

This familiarity means Laravel developers can be productive immediately.

## Adapter Pattern

To support multiple backends, we define a `ServerAdapter` interface:

```typescript
interface ServerAdapter {
  handleRequest(request: Request): Promise<Response>
  authenticate(credentials: Credentials): Promise<User | null>
  authorize(user: User, ability: string, resource: any): boolean
  // ... more methods
}
```

### Supported Backends (Phase 1)

1. **@filament-ts/server-adonis** - Reference implementation
2. **@filament-ts/server-nestjs** - NestJS adapter
3. **@filament-ts/server-generic** - Generic Express/Hono/Fastify adapter

## Consequences

### Positive
- Laravel refugees feel at home with AdonisJS
- Adapter pattern enables community to support other frameworks
- All-in-one solution (auth, ORM, validation included)

### Negative
- Smaller ecosystem than NestJS
- Single primary maintainer risk (mitigated by adapter pattern)

## References

- AdonisJS Documentation: https://docs.adonisjs.com
- Adapter Interface: docs/milestone-3-architecture-design.md
