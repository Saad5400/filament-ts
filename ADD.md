# Architecture Design Document (ADD)

## Driven: Technology Stack & Design Decisions

**Document Version:** 1.2
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
| **HTTP client** | Axios | Used for reactive field AJAX endpoints alongside Inertia; consistent API for all non-Inertia HTTP calls |
| **Class merging** | tailwind-merge + clsx (via `cn()` utility) | Merge Tailwind CSS classes without conflicts — same pattern as shadcn-svelte |
| **Drag-and-drop** | SortableJS (via `sortablejs` npm package) | Used for Repeater/Builder reordering, table row reordering. Mature, framework-agnostic, touch-friendly. Svelte integration via action/wrapper. |
| **Markdown rendering** | marked (or markdown-it) | Used for MarkdownEditor preview. Fast, extensible, well-maintained. |
| **Date/time picker** | Custom (Bits UI Popover + Calendar primitive) | Svelte 5 native calendar picker built on Bits UI's calendar/range-calendar primitives, same approach as shadcn-svelte date-picker |

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

### ADR-011: Reactive State Management via AJAX (Axios)

**Decision:** Reactive/live field updates are handled via dedicated AJAX endpoints using Axios, separate from Inertia's page-based request cycle.

**Context:** Laravel Filament's `live()`, `afterStateUpdated()`, `debounce()`, and dynamic field reactivity all rely on Livewire's stateful server-side component model — Livewire sends field state to the server, re-evaluates closures, and returns a diffed component tree. Inertia.js is page-based and has no equivalent mechanism.

**Architecture:**

```
┌──────────────────────────────────────────────────────────────┐
│  Svelte Client                                                │
│                                                               │
│  Field A changes → field marked as live()                     │
│    │                                                          │
│    ├── Axios POST /driven/state-update                        │
│    │     Body: { schemaId, fieldName, value, formState }      │
│    │                                                          │
│    ▼                                                          │
│  Server evaluates all dependent closures with new state       │
│    │                                                          │
│    ▼                                                          │
│  Response: { updatedFields: { fieldB: { options: [...] } } }  │
│                                                               │
│  Client merges response → fieldB re-renders with new options  │
└──────────────────────────────────────────────────────────────┘
```

**Key design points:**
1. **Dedicated route** — `POST /driven/state-update` (registered by Driven's service provider, scoped per panel)
2. **Axios (not Inertia)** — Inertia's `router.visit()` replaces the entire page component. Axios allows targeted JSON responses without full page re-render.
3. **Modifiers** — Fields support `live()` (on change), `lazy()` (on blur), and `debounce(ms)` to control when AJAX fires.
4. **`afterStateUpdated()` callbacks** — Evaluated server-side when the AJAX request arrives. The callback receives the new value and full form state.
5. **Client-side reactivity for simple cases** — Simple visibility rules (e.g., "show field B when field A = 'X'") can be expressed as declarative JSON rules and evaluated in Svelte without a server round-trip. Complex logic (database lookups, computed values) requires the server.
6. **Reusable** — The Axios-based state endpoint is available for any custom AJAX needs beyond built-in reactivity.

**Consequence:** This introduces a "mini-Livewire" pattern for field reactivity. The server remains the source of truth for all business logic, while the client handles simple UI state changes (visibility toggling, etc.) for responsiveness.

---

### ADR-012: Table State via URL Query Parameters

**Decision:** All table state (current page, sort column, sort direction, active filters, search query) is persisted in URL query parameters.

**Rationale:**
- With Inertia, the URL is the natural place for page state (unlike Livewire where state lives in the component).
- Enables shareable/bookmarkable table views — users can share a filtered, sorted table URL.
- Browser back/forward navigation works correctly.
- Aligns with Inertia's `router.visit()` pattern which naturally uses query parameters.

**URL format:**
```
/admin/posts?page=2&sort=created_at&direction=desc&filter[status]=published&search=hello
```

**Implementation:**
- Inertia controller reads query params → applies to Lucid query → returns paginated results
- Svelte table component updates URL via `router.get()` with `preserveState: true` when user interacts
- Default values omitted from URL for cleanliness

---

### ADR-013: Asset Distribution, Design System & Theming

**Decision:** Driven provides a Tailwind CSS 4 plugin (`@driven/tailwind`) and ships pre-compiled Svelte components resolved from `node_modules`.

**Asset Distribution:**

1. **Svelte components** ship in each package's `dist/` directory as compiled Svelte components. Inertia's component resolver is configured to also look in `node_modules/@driven/*/dist/pages/` for Driven page components.

2. **Tailwind CSS integration** — Users add two lines to their CSS entry file:
   ```css
   @import "tailwindcss";
   @source "../node_modules/@driven/*/dist/**/*.svelte";
   @plugin "@driven/tailwind";
   ```
   - `@source` tells Tailwind CSS 4 to scan Driven's components for class names
   - `@plugin` loads Driven's Tailwind plugin which registers theme values and utilities

3. **Vite integration** — Each Driven package registers its assets via AdonisJS's Vite integration. No manual Vite config needed.

**Unified Design System:**

All Driven components follow a consistent design system built on CSS custom properties:

1. **CSS Custom Properties as the theming foundation:**
   ```css
   :root {
     /* 6 semantic color scales (50-950 shades, OKLCH) */
     --dr-primary-50: oklch(...); --dr-primary-500: oklch(...); --dr-primary-950: oklch(...);
     --dr-danger-50: oklch(...);  /* ... */
     --dr-gray-50: oklch(...);    /* ... */
     --dr-info-50: oklch(...);    /* ... */
     --dr-success-50: oklch(...); /* ... */
     --dr-warning-50: oklch(...); /* ... */
     /* Typography */
     --dr-font-family: 'Inter', system-ui, sans-serif;
     --dr-font-size-base: 0.875rem;
     /* Spacing, radius, shadows */
     --dr-radius-sm: 0.25rem; --dr-radius-md: 0.375rem; --dr-radius-lg: 0.5rem;
   }
   .dark { /* Inverted shade mapping for dark mode */ }
   ```

2. **Semantic `.dr-*` CSS classes** on all components for targeted customization:
   ```html
   <div class="dr-section dr-section--collapsible">
     <div class="dr-section__header">...</div>
     <div class="dr-section__content">...</div>
   </div>
   ```

3. **Component variants via props** — Components support variant/size props:
   ```svelte
   <Button variant="default|outlined|ghost|link" size="xs|sm|md|lg|xl" />
   ```

4. **`cn()` utility** for class merging (tailwind-merge + clsx), same pattern as shadcn-svelte.

5. **Dark mode** — Driven uses Tailwind's `dark:` variant mapped to CSS custom properties. Three modes: light, dark, system preference.

6. **Panel-level theming** — Each panel configures its 6 semantic colors. The `@driven/tailwind` plugin generates the full shade scales from base colors using OKLCH color space.

**Consequence:** Users customize appearance by overriding CSS custom properties or Tailwind theme values. Component internals never need modification.

---

### ADR-014: Database Migrations (Package-Registered)

**Decision:** Driven packages register their migration directories via AdonisJS service providers. Users run migrations with `node ace migration:run` — no publishing or modification needed.

**Rationale:**
- AdonisJS service providers can register additional migration paths that are picked up by `node ace migration:run`.
- Users don't need to modify framework migrations — they're internal implementation details.
- This is simpler than Laravel's `vendor:publish` pattern and less error-prone (no stale published migrations).

**Packages requiring migrations:**
- `@driven/notifications` — `driven_notifications` table (for database notifications)
- `@driven/panels` — optional tenant-related tables (when multi-tenancy is enabled)

**Setup:** When users run `node ace configure @driven/panels`, the package's configure hook registers its migration paths in `adonisrc.ts`. Subsequent `node ace migration:run` picks up Driven's migrations automatically.

---

### ADR-015: Schema Serialization Strategy

**Decision:** The server is the authoritative source of truth. All `Resolvable<T>` closures are evaluated server-side before serialization. The client receives only resolved static values in JSON.

**Rationale:**
- Closures/functions cannot be serialized to JSON.
- Keeping evaluation server-side prevents leaking business logic to the client.
- Server-side evaluation aligns with the SDUI philosophy — the server decides what the UI looks like.

**Architecture:**

```
Server                                      Client
──────                                      ──────
TextInput.make('name')                      Receives JSON:
  .label('Full Name')        ──serialize──▶ { type: 'text-input',
  .visible((ctx) =>                           name: 'name',
    ctx.operation === 'edit')                  label: 'Full Name',
  .placeholder('...')                          visible: true,
                                               placeholder: '...' }
```

**Special cases:**
1. **Dynamic visibility rules** — Simple conditional rules (e.g., "visible when field X = value Y") are serialized as declarative rule objects, NOT as closures. The client evaluates these locally for instant responsiveness:
   ```json
   { "visible": { "rule": "fieldEquals", "field": "status", "value": "published" } }
   ```

2. **Complex server-dependent logic** — Any closure that requires database access, authenticated user checks, or complex computation is evaluated server-side. When the dependency changes (e.g., a `live()` field), ADR-011's AJAX mechanism re-evaluates and sends updated values.

3. **Model data exposure** — Only explicitly serialized model attributes are sent to the client. Lucid model `$hidden` and `$visible` arrays are respected. Resources can define a `transformRecord()` method to control what data reaches the client.

4. **Paginated table data** — Table serialization includes both the table configuration (columns, filters, actions — serialized once on initial load) and the paginated record data (serialized on every page/filter/sort change). The configuration is static per table; the record data is dynamic. For efficiency:
   - Column definitions are serialized once and reused across page changes.
   - Each record row is serialized with only the columns' resolved values (not the full model).
   - Relationship data used by columns (e.g., `author.name`) is eagerly loaded server-side before serialization.
   - Summary calculations (sum, avg, etc.) are computed server-side as SQL aggregates, not in JavaScript.

5. **StateCasts** — State transformation between UI representation and storage representation is handled by the StateCast system (SRS FR-SCH-008). StateCasts are applied server-side during form filling (storage → UI) and form saving (UI → storage). The client receives already-transformed values.

**Consequence:** The client is a "dumb" renderer for most cases, with local evaluation only for simple declarative rules. All business logic stays server-side.

---

### ADR-016: No Macroable Pattern

**Decision:** Driven does not implement a runtime `Macroable` pattern (PHP's `__call` + macro registry). Use TypeScript-native extension mechanisms instead.

**Rationale:**
- TypeScript's type system makes runtime monkey-patching problematic — added methods would not be type-safe.
- TypeScript provides superior alternatives:
  - **Class inheritance** — `class MyTextInput extends TextInput {}`
  - **Mixin composition** — `class MyComponent extends CustomMixin(TextInput) {}`
  - **Module augmentation** — extend interfaces at compile time for type-safe additions
- The mixin system (ADD §5.2) already handles the composition use cases that PHP macros solve.

---

### ADR-017: Avatar & Font Provider System

**Decision:** Pluggable provider interfaces for user avatars and font loading.

**Avatar Providers:**
```typescript
interface AvatarProvider {
  getUrl(user: Authenticatable): string | Promise<string>
}
```
- **Default:** `InitialsAvatarProvider` — generates initials-based SVG avatars (no external service)
- **Built-in alternatives:** `GravatarProvider`, `UiAvatarsProvider`
- Configurable per panel: `panel.avatarProvider(new GravatarProvider())`
- Users can implement custom providers

**Font Providers:**
```typescript
interface FontProvider {
  getHtml(family: string): string  // Returns <link> or <style> tag
}
```
- **Default:** System font stack (no external loading)
- **Built-in:** `GoogleFontProvider`, `BunnyFontProvider` (privacy-friendly), `LocalFontProvider`
- Configurable per panel: `panel.font('Inter', new GoogleFontProvider())`

---

### ADR-018: Events System

**Decision:** Driven dispatches domain events via `@adonisjs/events` (AdonisJS's built-in event emitter). No new event infrastructure needed.

**Event naming convention:** `driven:domain.action` (e.g., `driven:record.created`, `driven:action.called`)

**Users listen via standard AdonisJS patterns:**
```typescript
// start/events.ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('driven:record.created', (event) => {
  // event.resource, event.record, event.user
})
```

---

### ADR-019: Static Configuration Defaults (`configureUsing`)

**Decision:** Every component class SHALL support a static `configureUsing()` method that sets default configuration for all future instances of that component type.

**Rationale:**
- This is one of Filament's most powerful patterns — it allows project-wide defaults without subclassing (e.g., "all TextInput fields should have `maxLength(255)` by default").
- TypeScript equivalent uses a static callback stored on the class:

```typescript
class TextInput extends Field {
  private static defaultConfigurator?: (input: TextInput) => void

  static configureUsing(callback: (input: TextInput) => void): void {
    TextInput.defaultConfigurator = callback
  }

  static make(name: string): TextInput {
    const instance = new TextInput(name)
    TextInput.defaultConfigurator?.(instance)
    return instance
  }
}

// In a service provider or boot file:
TextInput.configureUsing((input) => {
  input.maxLength(255)
})
```

**Consequence:** Allows customization at scale — change defaults for an entire component type in one place. This is critical for large applications with consistent conventions.

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
│   ├── query-builder/    # Advanced multi-condition query builder (constraints, operators)
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

The following design concerns will be resolved during implementation:

| Concern | Notes |
|---|---|
| **Exact Svelte component structure** | How schema JSON maps to Svelte component tree — resolved during `@driven/schemas` implementation |
| **Plugin registration API** | How third-party plugins hook into the panel — deferred per SRS (not day-one) |
| **Multi-tenancy scoping strategy** | Single-database (column-based) vs multi-database. Default: single-database with automatic query scoping via Lucid global scopes — resolved during `@driven/panels` implementation |
| **Multi-tenancy billing integration** | Provider interface for Stripe/Paddle/etc. — resolved during `@driven/panels` advanced features |
| **Component caching** | `node ace driven:cache` / `driven:clear-cache` for production optimization (caches discovered resources/pages/widgets to avoid filesystem scanning) — resolved during `@driven/panels` implementation |
| **RawJs equivalent** | Filament uses `RawJs` to pass JavaScript expressions from PHP to the client (e.g., custom format functions for text inputs). Driven needs a strategy — options: (a) encode JS strings in JSON with a marker, (b) use named formatters registered client-side, (c) leverage Svelte's native reactivity. Resolved during `@driven/schemas` implementation |
| **Deferred loading skeleton design** | Table deferred loading shows a skeleton placeholder while data loads asynchronously. The exact skeleton component design will be resolved during `@driven/tables` implementation |
| **Column manager persistence** | Whether user column visibility preferences should be persisted (localStorage, URL params, or server-side per-user). Resolved during `@driven/tables` implementation |

---

## 7. Out of Scope (Deferred)

The following features are intentionally deferred from the initial release:

| Feature | Reason | Future Dependency |
|---|---|---|
| **ImportAction / ExportAction** | Requires a background job/queue system. AdonisJS lacks a built-in queue; a solution (e.g., BullMQ, `@rlanz/bull-queue`) must be evaluated separately. | Job queue library decision |
| **Widget / Component polling** | Requires SSE or polling infrastructure beyond initial scope | Reactive state architecture maturity |
| **Chunked file uploads** | Standard multipart POST is sufficient for initial release | File upload field maturity |
| **Client-side image cropping** | Standard file upload + preview is sufficient initially | File upload field maturity |
| **Plugin system** | Critical but explicitly deferred (SRS §3.11) | All core packages stable |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Svelte 5 ecosystem gaps (missing library) | Low | Medium | Svelte easily wraps vanilla JS libraries; Tiptap + CodeMirror + Chart.js all confirmed |
| AdonisJS market share limits adoption | Medium | Medium | AdonisJS is growing; Driven could itself drive AdonisJS adoption (as Laravel Filament drove Laravel adoption) |
| Inertia Svelte adapter less tested than Vue | Medium | Low | Inertia's Svelte adapter is officially maintained; issues can be contributed upstream |
| Svelte 5 runes API changes | Low | High | Svelte 5 is stable; pin to specific versions |
| Reactive AJAX endpoint complexity | Medium | Medium | Scope initial implementation to field-level updates; avoid replicating Livewire's full reactivity model |
| Tailwind CSS 4 scanning performance | Low | Low | Limit `@source` paths; pre-compile Driven component styles where possible |

---

## 9. References

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

