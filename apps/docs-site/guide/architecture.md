# Architecture

Learn about the architecture of Filament TypeScript and how its components work together.

## Package Structure

```
@filament-ts/support      # Utilities and type helpers
@filament-ts/schemas      # Base schema classes and serialization
@filament-ts/ui           # Headless UI components
@filament-ts/forms        # Form fields and validation
@filament-ts/tables       # Table columns, filters, pagination
@filament-ts/infolists    # Read-only data display
@filament-ts/actions      # Action framework (modals, etc.)
@filament-ts/widgets      # Dashboard widgets
@filament-ts/notifications # Flash and database notifications
@filament-ts/resources    # Resource definitions and CRUD
@filament-ts/panels       # Panel configuration and routing
```

## Dependency Graph

```
┌─────────────────────────────────────┐
│           @filament-ts/panels       │
│  (Panel configuration, routing)     │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│          @filament-ts/resources     │
│     (Resource definitions, CRUD)    │
└─────┬─────┬─────┬─────┬─────┬──────┘
      │     │     │     │     │
┌─────▼──┐┌▼────┐┌▼──┐┌▼───┐┌▼────────┐
│ forms  │ │tbls│ │inl│ │act│ │widgets  │
└─────┬──┘└┬────┘└┬──┘└┬───┘└┬────────┘
      │     │     │     │     │
      └─────▼─────▼─────▼─────▼───────┐
            @filament-ts/ui            │
            @filament-ts/schemas       │
            @filament-ts/support       │
└──────────────────────────────────────┘
```

## Request Flow

```
User Request
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Panel Router                                       │
│  - Matches route to resource                        │
│  - Checks authorization                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Resource Handler                                   │
│  - Builds schema (form/table/infolist)             │
│  - Serializes to JSON                               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Schema Renderer (Client)                           │
│  - Receives JSON schema                             │
│  - Looks up component type                          │
│  - Renders component with props                     │
└─────────────────────────────────────────────────────┘
```

## Next

- [Type Safety](/guide/type-safety)
- [Server Integration](/guide/server-integration)
