# Architecture Design Document (ADD)

## Driven: Technology Stack & Design Decisions

**Document Version:** 1.0
**Date:** 2026-02-10
**SDLC Phase:** Design
**Prerequisite:** `SRS.md` (Software Requirements Specification)

---

## 1. Executive Summary

This document records all technology stack decisions for Driven. The project is **opinionated** — it requires users to adopt the chosen stack. This is a deliberate decision to reduce complexity, maximize integration quality, and mirror Laravel Filament's tight coupling with Laravel.

**Core philosophy:** Laravel Filament is to Laravel as Driven is to AdonisJS.

Driven is an **AdonisJS package** — not a standalone framework. Users install it into an AdonisJS application, and it integrates with AdonisJS's routing, ORM, authentication, authorization, validation, CLI, and more.

---

## 2. Technology Stack

### 2.1 Stack Overview

| Layer | Technology | Analogous To (Filament) |
|---|---|---|
| **Backend framework** | AdonisJS (v7+) | Laravel |
| **ORM** | Lucid ORM | Eloquent |
| **CLI** | Ace | Artisan |
| **Frontend integration** | Inertia.js (`@adonisjs/inertia`) | Livewire / Inertia |
| **Frontend framework** | Svelte 5 (runes) | Alpine.js + Blade |
| **CSS framework** | Tailwind CSS 4 | Tailwind CSS |
| **Validation** | VineJS | Laravel Validation |
| **Authentication** | `@adonisjs/auth` | Laravel Auth / Sanctum |
| **Authorization** | `@adonisjs/bouncer` | Laravel Policies |
| **Build tool** | Vite (`@adonisjs/vite`) | Vite (Laravel) |
| **Testing** | Japa | PHPUnit / Pest |
| **File storage** | `@adonisjs/drive` | Laravel Storage |
| **Mail** | `@adonisjs/mail` | Laravel Mail |
| **Cache** | `@adonisjs/cache` | Laravel Cache |
| **Real-time (SSE)** | `@adonisjs/transmit` | Laravel Broadcasting |
| **Security** | `@adonisjs/shield` | Laravel CSRF / XSS |
| **i18n** | AdonisJS i18n | Laravel Localization |
| **Session** | `@adonisjs/session` | Laravel Session |
| **Hashing / Encryption** | AdonisJS built-in | Laravel built-in |

### 2.2 Frontend Libraries

| Concern | Library | Rationale |
|---|---|---|
| **Headless UI primitives** | Bits UI | Svelte 5 native, accessible, unstyled — foundation for all Driven components |
| **shadcn port** | shadcn-svelte | Tailwind-based component recipes built on Bits UI — reference for our component styling |
| **Rich text editor** | Tiptap (`@tiptap/core` + Svelte wrapper) | Official Svelte support, ProseMirror-based, highly extensible |
| **Code editor** | CodeMirror 6 | Lightweight, embeddable, Svelte-compatible via vanilla JS API |
| **Charts** | Chart.js (via svelte-chartjs or vanilla) | Same as Filament, all required chart types supported |
| **Icons** | Lucide Svelte (default), pluggable | Comprehensive icon set with Svelte components; Heroicons also supported |
| **Data table logic** | Custom (no TanStack dependency) | We build our own table engine — Filament's table is custom, ours should be too |

### 2.3 Development Tooling

| Concern | Tool |
|---|---|
| **Runtime** | Node.js (LTS) |
| **Package manager** | npm (AdonisJS default) |
| **Monorepo** | npm workspaces |
| **Linting** | ESLint (AdonisJS preset: `@adonisjs/eslint-config`) |
| **Formatting** | Prettier |
| **Type checking** | TypeScript strict mode + `svelte-check` |
| **Testing** | Japa (unit/integration) + Playwright (E2E/browser) |
| **CI** | GitHub Actions |

---

## 3. Decision Records

### ADR-001: AdonisJS as the Required Backend Framework

**Decision:** Driven requires AdonisJS. It is not backend-agnostic.

**Rationale:**
- AdonisJS is the closest TypeScript equivalent to Laravel — same philosophy (convention-over-configuration, batteries-included, opinionated).
- Tight coupling with a single framework eliminates the complexity of adapter patterns, enabling deeper integration (routing, middleware, ORM, auth, CLI).
- This mirrors Filament's relationship with Laravel exactly.
- AdonisJS provides everything Driven needs out of the box: Lucid ORM, Ace CLI, Bouncer authorization, VineJS validation, Inertia.js, Vite, Japa testing, and more.

**Consequence:** Users must use AdonisJS. This limits the addressable market but dramatically simplifies the framework and improves integration quality.

**SRS impact:** Supersedes `DR-001` (data adapter pattern). Driven couples directly to Lucid ORM.

---

### ADR-002: Svelte 5 as the Frontend Framework

**Decision:** Svelte 5 with runes is the frontend framework.

**Rationale:**
- **Component authoring DX** — Svelte 5's `$props()`, `$state()`, `$derived()`, and snippets produce significantly less boilerplate per component. When building 100+ components, this compounds.
- **Reactivity model** — Runes (`$state`, `$derived`, `$effect`) are simpler and more explicit than Vue's ref/reactive/computed distinction. This is critical for building reactive forms, dynamic visibility, and the state-heavy UI Driven requires.
- **Performance** — Svelte compiles to vanilla JS with no runtime. Smaller bundles, faster initial load. Relevant for admin panels that load many components.
- **Modern and opinionated** — Aligns with the project's vision of a modern, opinionated package.
- **Ecosystem parity** — shadcn-svelte (Bits UI), Tiptap, CodeMirror 6, Chart.js all have Svelte support. No feature gaps vs Vue 3.

**Alternatives considered:**
- **Vue 3** — Larger community, better AdonisJS starter kit support, more battle-tested Inertia integration. Rejected because the component authoring DX advantage of Svelte 5 is decisive for a framework that ships 100+ components.
- **React** — Rejected outright (project constraint).

---

### ADR-003: Tailwind CSS 4

**Decision:** Tailwind CSS 4 for all styling.

**Rationale:**
- Same approach as Filament (Tailwind CSS).
- Tailwind 4 offers CSS-first configuration, faster builds, and native CSS nesting.
- Excellent integration with both Svelte and the shadcn-svelte ecosystem.
- Semantic CSS classes (`.dr-*` prefix) will be used for component targeting, matching Laravel Filament's approach.

---

### ADR-004: Direct Lucid ORM Coupling (No Adapter Pattern)

**Decision:** Driven works directly with Lucid models. No data adapter abstraction layer.

**Rationale:**
- Laravel Filament is tightly coupled to Eloquent. This coupling is what makes it powerful — auto-generating forms from model schemas, auto-resolving relationships, auto-building queries for tables.
- An adapter pattern would add significant complexity and reduce the quality of integration.
- Going opinionated means users accept the Lucid ORM requirement.
- Lucid supports PostgreSQL, MySQL, MSSQL, SQLite — sufficient database coverage.

**Consequence:** Resources will declare a Lucid model directly. Table queries, form data binding, relationship management, and soft deletes all use Lucid's API.

---

### ADR-005: Inertia.js for Server-Client Communication

**Decision:** Inertia.js (`@adonisjs/inertia` + `@inertiajs/svelte`) handles all server-to-client data flow.

**Rationale:**
- Inertia is the Server-Driven UI bridge — the server defines page data, Inertia delivers it to Svelte components. This is the TypeScript equivalent of Livewire's role in Laravel Filament.
- AdonisJS has an official Inertia adapter with SSR support.
- Inertia's `useForm()` handles form submissions, validation errors, and redirects — covering most of the form lifecycle.
- The [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/inertia-starter-kit) supports Svelte via the `--adapter=svelte` flag.

**SSR:** Enabled via Inertia's SSR mode (`--ssr` flag on the starter kit). Server-side renders the initial page, then Svelte hydrates on the client.

---

### ADR-006: Ace CLI for Code Generation

**Decision:** Driven code generators are implemented as Ace commands.

**Rationale:**
- Ace is AdonisJS's built-in CLI framework, analogous to Artisan.
- Users are already familiar with `node ace` commands.
- Ace provides argument parsing, flags, prompts, and terminal UI out of the box.
- Code generation commands (e.g., `node ace make:driven-resource`, `node ace make:driven-page`) feel native to the AdonisJS workflow.

---

### ADR-007: VineJS for Validation

**Decision:** VineJS handles all server-side validation. Client-side validation is minimal (HTML5 attributes + Inertia error propagation).

**Rationale:**
- VineJS is AdonisJS's official validation library, deeply integrated with the framework.
- With Inertia, the validation flow is: submit form → server validates with VineJS → errors returned to client via Inertia → displayed next to fields. This is the same pattern Laravel Filament uses with Laravel Validation + Livewire.
- No need for a separate client-side validation library (no Zod, no Valibot). VineJS is the single source of truth.

---

### ADR-008: Bouncer for Authorization

**Decision:** `@adonisjs/bouncer` handles all authorization (policies and abilities).

**Rationale:**
- Direct equivalent of Laravel Policies used by Laravel Filament.
- Driven resources will check Bouncer abilities for `viewAny`, `view`, `create`, `update`, `delete`, `forceDelete`, `restore`, `reorder` — exactly as Laravel Filament checks Laravel policies.

---

### ADR-009: Transmit for Real-Time Notifications

**Decision:** `@adonisjs/transmit` (Server-Sent Events) handles broadcast notifications.

**Rationale:**
- Transmit is AdonisJS's official real-time module based on SSE.
- Simpler than WebSockets for the notification use case (server → client push).
- Sufficient for database notification polling and broadcast notifications.

**Note:** SRS requirement FR-NOT-003 references "WebSocket connections." With this decision, broadcast notifications use SSE via Transmit instead. The functional behavior is identical from the user's perspective.

---

### ADR-010: Bits UI as Headless Component Foundation

**Decision:** Bits UI is the headless component primitive layer for all interactive Driven components.

**Rationale:**
- Bits UI is the Svelte 5 headless component library (equivalent to Radix UI for React, Reka UI for Vue).
- Provides accessible, unstyled primitives: dialogs, dropdowns, popovers, tabs, tooltips, etc.
- shadcn-svelte is built on Bits UI — we use the same foundation but with our own Driven-specific styling and API.
- WAI-ARIA compliant, supporting SRS accessibility requirements (NFR-UX-003).

---

## 4. Project Scaffolding

### 4.1 New Project Setup

To create a new AdonisJS project with Driven's required stack, use the official AdonisJS Inertia Starter Kit:

```bash
npm init adonisjs -- -K=inertia --adapter=svelte --ssr --db=postgres
```

> **Important:** Always use the CLI to scaffold new projects. Do not manually create AdonisJS config files.
> See: https://github.com/adonisjs/inertia-starter-kit

Available flags:
- `--adapter=svelte` — Configures Svelte as the frontend framework
- `--ssr` — Enables server-side rendering
- `--db=postgres|mysql|sqlite|mssql` — Configures the database dialect
- `--auth-guard=session|access_tokens|basic_auth` — Configures auth guard

### 4.2 Driven Package Structure

Driven is organized as a monorepo of AdonisJS-compatible packages:

```
driven/
├── packages/
│   ├── support/          # Base classes, mixins, utilities, color/icon systems
│   ├── schemas/          # Core schema engine, layout components, prime components
│   ├── forms/            # Form field components + VineJS validation integration
│   ├── infolists/        # Read-only entry components
│   ├── actions/          # Action system (buttons, modals, prebuilt CRUD actions)
│   ├── tables/           # Table builder (columns, filters, pagination, sorting)
│   ├── notifications/    # Flash, database, broadcast notifications
│   ├── widgets/          # Stats, charts, custom widgets
│   └── panels/           # Panel builder (auth, nav, resources, routing, theming)
├── stubs/                # Code generation templates for Ace commands
├── CLAUDE.md             # Project context and status
├── SRS.md                # Software Requirements Specification
├── ADD.md                # Architecture Design Document (this file)
└── package.json          # Workspace root
```

Each package registers as an **AdonisJS service provider** and may include:
- **Server-side code** (TypeScript) — resource definitions, schema builders, Ace commands, middleware, controllers
- **Client-side code** (Svelte 5) — Inertia page components, form field components, table components, UI components
- **Styles** (Tailwind CSS 4) — component styles with `.dr-*` prefix

### 4.3 Developer Workflow

```bash
# Scaffold a new AdonisJS + Driven project
npm init adonisjs -- -K=inertia --adapter=svelte --ssr --db=postgres
cd my-project
npm install @driven/panels        # Installs all packages

# Generate a resource
node ace make:driven-resource Post

# Generate a custom page
node ace make:driven-page Dashboard

# Generate a widget
node ace make:driven-widget StatsOverview

# Run dev server
node ace serve --hmr
```

---

## 5. Key Architecture Patterns

### 5.1 Server-Driven UI Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        AdonisJS Server                       │
│                                                              │
│  Resource Definition (TypeScript)                            │
│    ├── form() → Schema → serialized JSON config              │
│    ├── table() → Table config → serialized JSON config       │
│    └── infolist() → Infolist config → serialized JSON config │
│                                                              │
│  Controller renders Inertia page with config as props        │
└──────────────────────────┬──────────────────────────────────┘
                           │ Inertia (JSON props)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Svelte 5 Client                         │
│                                                              │
│  Receives JSON schema config via Inertia props               │
│    ├── SchemaRenderer maps config → Svelte components        │
│    ├── Form fields bind to Inertia useForm() state           │
│    ├── Table renders with sorting/filtering/pagination       │
│    └── Actions trigger Inertia visits or modal opens         │
│                                                              │
│  User interactions → Inertia form submissions → Server       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Composition (TypeScript Mixins)

Laravel Filament uses PHP traits extensively (HasColor, HasIcon, HasLabel, etc.). The TypeScript equivalent uses **mixin functions**:

```typescript
// Mixin pattern — equivalent to PHP traits
function HasColor<T extends Constructor>(Base: T) {
  return class extends Base {
    protected _color?: string | ((record: any) => string)

    color(color: string | ((record: any) => string)) {
      this._color = color
      return this
    }

    getColor(record?: any): string | undefined {
      return typeof this._color === 'function'
        ? this._color(record)
        : this._color
    }
  }
}

// Usage — composing multiple mixins
class TextColumn extends HasColor(HasIcon(HasLabel(BaseColumn))) {
  // TextColumn-specific methods
}
```

### 5.3 Closure/Callback Evaluation

Laravel Filament allows any config value to be a static value OR a closure. The TypeScript equivalent:

```typescript
type Resolvable<T> = T | ((context: ResolveContext) => T)

interface ResolveContext {
  record?: any           // Current Lucid model instance
  state?: FormState      // Current form state
  user?: User            // Authenticated user (from AdonisJS auth)
  operation?: 'create' | 'edit' | 'view'
}

// Resolution at render time
function resolve<T>(value: Resolvable<T>, context: ResolveContext): T {
  return typeof value === 'function' ? (value as Function)(context) : value
}
```

### 5.4 Fluent Builder Pattern

```typescript
class TextInput extends Field {
  static make(name: string): TextInput {
    return new TextInput(name)
  }

  required(): this {
    this._rules.push('required')
    return this
  }

  maxLength(max: number): this {
    this._rules.push(`maxLength:${max}`)
    return this
  }

  placeholder(text: Resolvable<string>): this {
    this._placeholder = text
    return this
  }
}

// Usage
TextInput.make('email')
  .required()
  .email()
  .maxLength(255)
  .placeholder('Enter your email')
```

---

## 6. Decisions NOT Yet Made

The following design concerns will be resolved during implementation (Phase 3):

| Concern | Notes |
|---|---|
| **Exact Svelte component structure** | How schema JSON maps to Svelte component tree — resolved during `@driven/schemas` implementation |
| **Plugin registration API** | How third-party plugins hook into the panel — deferred per SRS (not day-one) |
| **Multi-tenancy scoping** | How Lucid queries are automatically scoped to tenant — resolved during `@driven/panels` implementation |
| **Import/Export action formats** | CSV parsing library choice — resolved during `@driven/actions` implementation |
| **Markdown editor library** | Specific library for MarkdownEditor field — resolved during `@driven/forms` implementation |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Svelte 5 ecosystem gaps (missing library) | Low | Medium | Svelte easily wraps vanilla JS libraries; Tiptap + CodeMirror + Chart.js all confirmed |
| AdonisJS market share limits adoption | Medium | Medium | AdonisJS is growing; Driven could itself drive AdonisJS adoption (as Laravel Filament drove Laravel adoption) |
| Inertia Svelte adapter less tested than Vue | Medium | Low | Inertia's Svelte adapter is officially maintained; issues can be contributed upstream |
| Svelte 5 runes API changes | Low | High | Svelte 5 is stable; pin to specific versions |

---

## 8. References

- AdonisJS Documentation: https://docs.adonisjs.com
- AdonisJS Inertia Starter Kit: https://github.com/adonisjs/inertia-starter-kit
- AdonisJS GitHub Organization: https://github.com/orgs/adonisjs/repositories
- Inertia.js: https://inertiajs.com
- Svelte 5: https://svelte.dev
- shadcn-svelte: https://shadcn-svelte.com
- Bits UI: https://bits-ui.com
- Tiptap: https://tiptap.dev
- Tailwind CSS 4: https://tailwindcss.com
- VineJS: https://vinejs.dev
- Filament (reference): https://filamentphp.com

---

*End of Document*

