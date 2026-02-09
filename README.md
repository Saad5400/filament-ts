# Filament TypeScript

> Server-Driven UI framework for building beautiful admin panels in TypeScript

A TypeScript rewrite of [Laravel Filament](https://filamentphp.com/) - bringing the same declarative, fluent API experience to the TypeScript/JavaScript ecosystem.

## Status

[![Infrastructure](https://img.shields.io/badge/Infrastructure-Complete-success)](https://github.com/filament-ts/filament-ts)

**Current Phase**: Core Foundation (Milestone 5) - In Progress

## Project Structure

```
filament-ts/
├── packages/               # Core packages
│   ├── support/           # Utilities and type helpers
│   ├── schemas/           # Base schema classes and serialization
│   ├── ui/                # Headless UI components (Vue 3)
│   ├── forms/             # Form fields and validation
│   ├── tables/            # Table columns, filters, pagination
│   ├── infolists/         # Read-only data display
│   ├── actions/           # Action framework
│   ├── widgets/           # Dashboard widgets
│   ├── notifications/     # Flash and database notifications
│   ├── resources/         # Resource definitions and CRUD
│   ├── panels/            # Panel configuration and routing
│   ├── cli/               # Code generation CLI
│   └── testing/           # Testing utilities
├── apps/
│   ├── demo-app/          # Demo application
│   └── docs-site/         # Documentation site
└── docs/                  # Architecture and design docs
```

## Technology Stack

| Category | Selection |
|----------|-----------|
| Frontend Framework | Vue 3 (Composition API) |
| Build System | Vite + tsup |
| Monorepo | pnpm + Turborepo |
| Testing | Vitest + Playwright |
| Styling | Tailwind CSS v4 |
| State Management | TanStack Query + Pinia |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Start demo app
pnpm run dev --filter demo-app

# Start docs site
pnpm run dev --filter docs-site

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

## Documentation

See [docs/](./docs) for architecture documentation and design decisions.

## License

MIT
