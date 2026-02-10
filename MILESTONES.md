# Project Milestones

## Driven: Server-Driven UI Framework for TypeScript

**Document Version:** 1.1
**Date:** 2026-02-10
**Approach:** Iterative Design-Implement (bottom-up, package by package). No partial public release — the goal is full feature parity before v1.0.
**Prerequisites:** `SRS.md`, `ADD.md`

---

## How to Use This Document

Each milestone follows the pattern: **design → implement → test**. A milestone is complete when its expected output is delivered and all tests pass. Milestones are sequential — each depends on the ones before it.

**For any agent/session picking up work:** Check the status table below, read the milestone description, and begin where the last session left off. Update the status when you complete a milestone.

---

## Status Tracker

| # | Milestone | Status | Completed By | Date |
|---|-----------|--------|-------------|------|
| 0 | Project Infrastructure | ⬜ Not Started | | |
| 1 | @driven/support | ⬜ Not Started | | |
| 2 | @driven/schemas (server) | ⬜ Not Started | | |
| 3 | Svelte Component Foundation & Design System | ⬜ Not Started | | |
| 4 | @driven/forms (server) | ⬜ Not Started | | |
| 5 | @driven/forms (client) | ⬜ Not Started | | |
| 6 | @driven/infolists | ⬜ Not Started | | |
| 7 | @driven/actions | ⬜ Not Started | | |
| 8 | @driven/query-builder | ⬜ Not Started | | |
| 9 | @driven/tables (server) | ⬜ Not Started | | |
| 10 | @driven/tables (client) | ⬜ Not Started | | |
| 11 | @driven/notifications | ⬜ Not Started | | |
| 12 | @driven/widgets | ⬜ Not Started | | |
| 13 | @driven/panels — Core Shell | ⬜ Not Started | | |
| 14 | @driven/panels — Resources & CRUD | ⬜ Not Started | | |
| 15 | @driven/panels — Auth & Navigation | ⬜ Not Started | | |
| 16 | @driven/panels — Advanced Features | ⬜ Not Started | | |
| 17 | Code Generation (Ace CLI) | ⬜ Not Started | | |
| 18 | Testing Utilities | ⬜ Not Started | | |
| 19 | Integration Testing & Demo App | ⬜ Not Started | | |
| 20 | Documentation | ⬜ Not Started | | |
| 21 | Release Preparation | ⬜ Not Started | | |

**Status values:** ⬜ Not Started · 🔨 In Progress · ✅ Complete · ⏸️ Blocked

---

## Milestone 0: Project Infrastructure

**Goal:** Set up the monorepo, tooling, and empty package scaffolds so that all future work has a proper home.

**Tasks:**
- Initialize npm workspace monorepo at the project root
- Create `packages/` directory with empty scaffolds for all 10 packages (`support`, `schemas`, `forms`, `infolists`, `actions`, `query-builder`, `tables`, `notifications`, `widgets`, `panels`)
- Configure TypeScript (strict mode, shared `tsconfig.base.json`, per-package `tsconfig.json`)
- Configure ESLint with `@adonisjs/eslint-config`
- Configure Prettier
- Configure Japa test runner at the workspace level
- Set up GitHub Actions CI (lint, type-check, test)
- Add a `.gitignore` appropriate for Node.js/TypeScript monorepos

**Expected Output:**
- Running `npm install` succeeds
- Running `npm run lint` succeeds (on empty packages)
- Running `npm run typecheck` succeeds
- Running `npm test` succeeds (zero tests pass, zero fail)
- Each package has `package.json`, `tsconfig.json`, `src/index.ts`

---

## Milestone 1: @driven/support

**Goal:** Build the foundational package that every other package depends on. This defines the core patterns for the entire framework.

**Tasks:**
- **Base Component class** — the root class all schema components inherit from
- **Mixin system** — implement the TypeScript mixin pattern (ADD §5.2) with at minimum these concerns:
  - `HasLabel`, `HasIcon`, `HasColor`, `HasId`, `HasName`
  - `HasVisibility` (visible/hidden/visibleOn/hiddenOn)
  - `HasDescription`, `HasHint`
  - `HasBadge`, `HasTooltip`
  - `HasAlignment`, `HasWeight`, `HasWidth`
  - `Configurable` (static configuration)
  - `EvaluatesClosures` (Resolvable<T> evaluation)
- **Resolvable<T> type and resolve() function** — the closure/callback evaluation system (ADD §5.3)
- **ResolveContext interface** — record, state, user, operation
- **Color system** — semantic color definitions (primary, danger, gray, info, success, warning) with OKLCH shade generation (50–950)
- **Icon system** — pluggable icon resolution (Lucide default)
- **Utility functions** — string helpers (label generation from names, slugify, etc.), `cn()` class merge utility (tailwind-merge + clsx)
- **Flow control exceptions** — `Cancel` and `Halt` exception classes for lifecycle hook flow control (SRS §3.18)
- **Enums** — Operation (`create`, `edit`, `view`), Alignment, Size, Width, IconPosition, IconSize, FontFamily, FontWeight
- **Tests** — unit tests for every mixin, the resolve system, utilities, and enums

**Expected Output:**
- `@driven/support` package with full TypeScript types
- All mixins composable (e.g., `HasColor(HasIcon(HasLabel(Base)))` works)
- `Resolvable<T>` supports both static values and callbacks
- All tests passing
- Package exports a clean public API from `src/index.ts`

**Reference:** Study `/home/saad/filament/packages/support/src` for the original patterns.

---

## Milestone 2: @driven/schemas (Server-Side)

**Goal:** Build the schema engine — the core composition system that all UI (forms, tables, infolists) is built on. This milestone covers the server-side schema definition and serialization only (no Svelte components yet).

**Tasks:**
- **Schema class** — container for an ordered array of components, with `components()` method
- **Component base class** — extends support's Component, adds schema-specific behavior (child schemas, nesting)
- **Layout components** — Grid, Flex, Fieldset, Section, Tabs, Wizard, Callout, EmptyState
- **Prime components** — Text, Icon, Image, UnorderedList
- **Schema serialization** — `toJSON()` / `serialize()` method that converts the schema tree to a plain JSON object suitable for Inertia props. All `Resolvable<T>` closures evaluated server-side before serialization (ADD ADR-015). Simple visibility rules serialized as declarative JSON rule objects for client-side evaluation.
- **Component registry** — a mapping from component type strings to their classes (needed for the client to know which Svelte component to render)
- **Tests** — schema creation, nesting, serialization, layout components, visibility rule serialization

**Expected Output:**
- Schemas can be defined using fluent API: `Schema.make([Section.make('Details').schema([...])])`
- Schemas serialize to JSON that can be passed as Inertia page props
- Layout components support the documented options (collapsible, columns, etc.)
- All tests passing

**Reference:** Study `/home/saad/filament/packages/schemas/src`

---

## Milestone 3: Svelte Component Foundation & Design System

**Goal:** Establish the Svelte 5 client-side rendering pipeline and the unified design system. This is the bridge between server-defined schemas and client-rendered components, and sets the visual foundation for all Driven UI.

**Tasks:**
- **SchemaRenderer.svelte** — the core component that receives serialized schema JSON and recursively renders the component tree
- **ComponentResolver** — maps component type strings (from JSON) to Svelte components
- **Layout component Svelte implementations** — Grid, Flex, Fieldset, Section, Tabs, Wizard, Callout, EmptyState (using Bits UI primitives where applicable)
- **Prime component Svelte implementations** — Text, Icon, Image, UnorderedList
- **Design system foundation:**
  - CSS custom properties (`--dr-*`) for all semantic colors (6 color scales × 19 shades), typography, spacing, radius, shadows
  - `.dr-*` BEM-style class naming convention on all components
  - Component variant system via props (`variant`, `size`)
  - `cn()` utility integration (tailwind-merge + clsx)
  - Dark mode support (`.dark` class toggling, inverted shade mapping)
- **`@driven/tailwind` plugin** — Tailwind CSS 4 plugin that registers theme values from CSS custom properties and Driven-specific utilities
- **Inertia page wrapper** — base Svelte page component that Driven pages extend
- **Client-side visibility rule evaluator** — evaluate simple declarative visibility rules (from ADR-015) without server round-trip
- **Tests** — component rendering tests (Svelte component tests or Playwright)

**Expected Output:**
- A serialized schema from Milestone 2 can be rendered to HTML by SchemaRenderer
- Layout components render correctly with responsive behavior
- Design system CSS custom properties defined and documented
- `.dr-*` classes applied consistently to all components
- `@driven/tailwind` plugin works with `@plugin` directive
- Dark mode toggle works
- All tests passing

---

## Milestone 4: @driven/forms (Server-Side)

**Goal:** Build all form field types, validation integration, and form state management on the server side.

**Tasks:**
- **Field base class** — extends schema Component, adds validation, state binding, reactive features
- **All 27 field types** — TextInput, Textarea, Select, Checkbox, Toggle, CheckboxList, Radio, DateTimePicker, DatePicker, TimePicker, FileUpload, RichEditor, MarkdownEditor, Repeater, Builder, TagsInput, KeyValue, ColorPicker, ToggleButtons, Slider, CodeEditor, Hidden, MorphToSelect, Placeholder, OneTimeCodeInput, ViewField, TableSelect
- **VineJS validation integration** — fields generate VineJS validation rules from their fluent config (e.g., `.required().maxLength(255)` → VineJS schema)
- **Form state management** — define how form data flows: Inertia `useForm()` on client → submit → VineJS validation on server → errors back via Inertia
- **Reactive state endpoint** — implement the `POST /driven/state-update` AJAX endpoint (ADD ADR-011) for `live()`, `lazy()`, `debounce()` field updates. `afterStateUpdated()` callback evaluation.
- **Relationship bindings** — `relationship()` method on fields/layouts for BelongsTo, HasOne, HasMany, MorphOne, MorphMany, BelongsToMany, MorphToMany
- **Dynamic visibility** — `visible()`, `hidden()`, `visibleOn()`, `hiddenOn()` with operation context. Simple rules serialized as declarative JSON; complex rules evaluated server-side via ADR-011.
- **File upload support** — dedicated upload endpoint for temporary files, integration with `@adonisjs/drive`, server-side type/size validation (SRS §3.19)
- **Serialization** — form schemas serialize to JSON including field types, rules, options, defaults
- **Tests** — every field type, validation rule generation, relationship bindings, reactive endpoint, serialization

**Expected Output:**
- All 27 field types constructable via `FieldType.make('name').options(...)`
- Validation rules auto-generated for VineJS
- Reactive state endpoint handles live field updates
- Form schemas serialize to JSON with all field metadata
- Relationship bindings correctly attach to Lucid relations
- All tests passing

**Reference:** Study `/home/saad/filament/packages/forms/src`

---

## Milestone 5: @driven/forms (Client-Side)

**Goal:** Build the Svelte 5 components for every form field type.

**Tasks:**
- **Svelte component for each of the 27 field types** — rendering, user interaction, state binding
- **Inertia useForm() integration** — form fields bind to Inertia form state, submit via Inertia
- **Validation error display** — show server-side VineJS errors next to the appropriate field
- **Reactive field integration** — Axios calls to `/driven/state-update` when `live()` fields change. Client-side evaluation of simple declarative visibility rules. Debounce/lazy support.
- **File upload UI** — drag-and-drop, preview (via File API), progress, temporary upload to dedicated endpoint
- **Rich text editor** — Tiptap integration as RichEditor field
- **Code editor** — CodeMirror 6 integration as CodeEditor field
- **Repeater UI** — add/remove/reorder items with drag-and-drop
- **Builder UI** — block picker, add/remove/reorder blocks
- **Wizard UI** — multi-step form with step indicators and navigation
- **Select search/create** — searchable dropdown with "create new" option
- **TableSelect UI** — modal with searchable table for record selection
- **MorphToSelect UI** — type selector + record selector for polymorphic relations
- **OneTimeCodeInput UI** — individual digit input boxes with auto-focus progression
- **Tests** — component rendering, user interaction, form submission flow, reactive updates

**Expected Output:**
- Every field type renders correctly and handles user input
- Form submission via Inertia works end-to-end (submit → validate → errors or success)
- Live field reactivity works via Axios (server callback) and local evaluation (simple rules)
- Rich text, code editor, file upload all functional
- Repeater and Builder support drag-and-drop reordering
- All tests passing

---

## Milestone 6: @driven/infolists

**Goal:** Build the read-only data display system (both server and client).

**Tasks:**
- **Entry base class** — extends schema Component for read-only display
- **All 7 entry types** — TextEntry, IconEntry, ImageEntry, ColorEntry, CodeEntry, KeyValueEntry, RepeatableEntry
- **Shared layout system** — infolists use the same layout components as forms (Grid, Section, Tabs, etc.)
- **Serialization** — infolist schemas serialize to JSON
- **Svelte entry components** — render each entry type
- **Tests** — entry rendering, data display, layout sharing

**Expected Output:**
- Infolists definable with fluent API, sharing layout system with forms
- All 7 entry types render data correctly
- All tests passing

**Reference:** Study `/home/saad/filament/packages/infolists/src`

---

## Milestone 7: @driven/actions

**Goal:** Build the action system — buttons, modals, slide-overs, prebuilt CRUD and relationship actions.

**Tasks:**
- **Action class** — encapsulates trigger, modal, form, server logic, authorization
- **BulkAction class** — operates on selected records, extends Action
- **Trigger styles** — button, link, icon button, badge (Svelte components)
- **Modal system** — modal and slide-over Svelte components (using Bits UI Dialog)
- **Action forms** — actions can contain form schemas (uses @driven/forms)
- **Prebuilt record actions** — CreateAction, EditAction, ViewAction, DeleteAction, ForceDeleteAction, RestoreAction, ReplicateAction
- **Prebuilt relationship actions** — AttachAction, DetachAction, AssociateAction, DissociateAction
- **Prebuilt bulk actions** — DeleteBulkAction, ForceDeleteBulkAction, RestoreBulkAction, DetachBulkAction, DissociateBulkAction
- **Action groups** — ActionGroup, BulkActionGroup (dropdown containing multiple actions)
- **Lifecycle hooks** — before/after hooks on action execution
- **Flow control** — `Cancel` and `Halt` exceptions respected in action lifecycle
- **Authorization** — Bouncer ability checks before action execution
- **Rate limiting** — configurable rate limits on sensitive actions (SRS FR-ACT-010)
- **Key bindings** — keyboard shortcuts for actions
- **Events** — dispatch `driven:action.calling` / `driven:action.called` events (SRS §3.17)
- **Serialization** — actions serialize to JSON for client rendering
- **Tests** — action execution, modal flow, authorization, rate limiting, prebuilt actions, bulk actions

**Expected Output:**
- Actions work end-to-end: click trigger → open modal → fill form → submit → server executes logic
- All prebuilt record, relationship, and bulk actions functional
- Authorization prevents unauthorized actions
- Rate limiting enforced
- All tests passing

**Reference:** Study `/home/saad/filament/packages/actions/src`

---

## Milestone 8: @driven/query-builder

**Goal:** Build the advanced multi-condition query builder — a standalone package providing a visual rule builder for complex filtering.

**Tasks:**
- **Constraint base class** — base for all constraint types, with operator system
- **Constraint types:**
  - `TextConstraint` — equals, contains, starts with, ends with
  - `NumberConstraint` — equals, min, max, with relationship aggregation support
  - `DateConstraint` — before, after, is date, is month, is year
  - `BooleanConstraint` — is true / is false
  - `SelectConstraint` — is / is not from option set
  - `RelationshipConstraint` — has / count / related record matching
- **Operator system** — each constraint has configurable operators that modify Lucid queries
- **Nullable support** — "is filled" / "is empty" operators on all constraints
- **RuleBuilder form component** — visual UI (Svelte) for adding/removing/combining conditions with AND/OR logic
- **Lucid query integration** — constraints apply to Lucid query builder
- **Serialization** — constraint configs serialize to JSON for RuleBuilder UI
- **Tests** — each constraint type, operator application, query generation, RuleBuilder UI

**Expected Output:**
- Constraints definable with fluent API
- RuleBuilder UI allows users to visually build complex filter conditions
- Constraints correctly modify Lucid queries
- Integrates with `@driven/tables` as a filter type (Milestone 9)
- All tests passing

**Reference:** Study `/home/saad/filament/packages/query-builder/src`

---

## Milestone 9: @driven/tables (Server-Side)

**Goal:** Build the table configuration system, query builder integration, and server-side logic.

**Tasks:**
- **Table class** — container for columns, filters, actions, pagination config
- **All 8 column types** — TextColumn, IconColumn, ImageColumn, ColorColumn, SelectColumn, ToggleColumn, TextInputColumn, CheckboxColumn
- **Column features** — sorting, searching, toggling visibility, formatting, relationship dot notation
- **Filters** — BaseFilter, SelectFilter, TernaryFilter, QueryBuilder filter (uses @driven/query-builder), custom filters
- **URL query parameter integration** — table state (page, sort, direction, filters, search) read from and written to URL query params (ADD ADR-012)
- **Lucid query integration** — filters and sorting modify Lucid queries, pagination via Lucid
- **Table actions** — record actions, header actions, bulk actions (uses @driven/actions)
- **Summaries** — sum, average, count, min, max per column
- **Row grouping** — group rows by column value
- **Serialization** — table config + paginated data serialize to JSON for Inertia
- **Tests** — query building, filtering, sorting, pagination, URL state, column rendering

**Expected Output:**
- Tables configurable with fluent API
- Lucid queries correctly modified by filters, sorts, and search
- Table state round-trips through URL query parameters
- Paginated results serialized for Inertia
- All tests passing

**Reference:** Study `/home/saad/filament/packages/tables/src`

---

## Milestone 10: @driven/tables (Client-Side)

**Goal:** Build the Svelte table UI — rendering, interactivity, and user experience.

**Tasks:**
- **Table Svelte component** — renders columns, rows, pagination, empty state
- **Column Svelte components** — render each of the 8 column types
- **Inline editing** — SelectColumn, ToggleColumn, TextInputColumn, CheckboxColumn submit changes via Inertia
- **Filter UI** — filter panel (dropdown/sidebar/above-table layouts), QueryBuilder filter UI
- **Search UI** — global search input and per-column search
- **Pagination UI** — page navigation with configurable page sizes
- **URL state sync** — filter/sort/search/page changes update URL query params via `router.get()` with `preserveState: true`
- **Bulk selection** — checkbox selection with "select all" and bulk action toolbar
- **Row reordering** — drag-and-drop row reordering
- **Summary row** — rendered below table columns
- **Row grouping UI** — collapsible groups
- **Empty state** — customizable empty state component
- **Tabs** — pre-filtered view tabs above the table
- **Responsive** — column hiding at breakpoints, mobile-friendly layout
- **Tests** — rendering, interaction, pagination, filtering, sorting, URL state

**Expected Output:**
- Full interactive table with all features working in the browser
- Filter, sort, search, paginate all trigger Inertia requests and update URL
- Bulk actions work on selected records
- Shareable table URLs work correctly
- All tests passing

---

## Milestone 11: @driven/notifications

**Goal:** Build the notification system — flash, database, and broadcast.

**Tasks:**
- **Notification class** — title, body, icon, color, status, actions, duration
- **Flash notifications** — triggerable from server (via Inertia shared data) and client (JS API)
- **Toast Svelte component** — animated notification toasts
- **Database notifications** — Lucid model for persistent notifications, mark-as-read. Migration registered via service provider (ADD ADR-014).
- **Notification center** — slide-over panel listing database notifications (Svelte component)
- **Broadcast notifications** — `@adonisjs/transmit` (SSE) integration for real-time push
- **Tests** — flash display, database CRUD, broadcast delivery, mark-as-read

**Expected Output:**
- Flash notifications appear as toasts and auto-dismiss
- Database notifications persist, display in notification center, support mark-as-read
- Broadcast notifications arrive in real-time via SSE
- Migration runs via `node ace migration:run` without user publishing
- All tests passing

**Reference:** Study `/home/saad/filament/packages/notifications/src`

---

## Milestone 12: @driven/widgets

**Goal:** Build the widget system for dashboards.

**Tasks:**
- **Widget base class** — extends schema Component
- **StatsOverviewWidget** — display metrics with trend indicators, descriptions, mini-charts
- **ChartWidget** — Chart.js integration (line, bar, pie, doughnut, polar area, bubble, scatter, radar)
- **TableWidget** — embed a @driven/tables table inside a widget
- **Custom widget support** — render arbitrary Svelte content
- **Widget grid layout** — configurable responsive grid for arranging widgets
- **Lazy loading** — widgets load data on demand
- **Date range filtering** — widgets respond to date range selector
- **Svelte widget components** — render all widget types
- **Tests** — widget rendering, data loading, chart rendering

**Expected Output:**
- Dashboard-style pages with stats, charts, and tables in a responsive grid
- Widgets lazy-load on demand
- All tests passing

> **Deferred:** Widget polling (auto-refresh at intervals) is out of scope for initial release.

**Reference:** Study `/home/saad/filament/packages/widgets/src`

---

## Milestone 13: @driven/panels — Core Shell

**Goal:** Build the panel application shell — the layout, routing, theming, and middleware that wraps everything else.

**Tasks:**
- **Panel class** — configuration object (path, domain, branding, colors, dark mode, fonts, etc.)
- **AdonisJS service provider** — registers routes, middleware, Inertia pages, migration paths for the panel
- **Panel layout Svelte component** — the main app shell (sidebar, top bar, content area, footer)
- **Routing** — auto-register panel routes under the configured path prefix
- **Middleware** — panel auth middleware, tenant middleware
- **Theme system** — light/dark/system, 6 semantic colors (configurable per panel, generates CSS custom property overrides), font customization via font providers (ADD ADR-017)
- **Branding** — name, logo, favicon configuration
- **Avatar providers** — pluggable avatar resolution (ADD ADR-017). Default: InitialsAvatarProvider.
- **SPA mode** — Inertia client-side navigation between panel pages
- **Render hooks** — named injection points throughout the shell
- **Custom assets** — register custom CSS/JS per panel
- **Multi-panel support** — multiple panels in one app with independent configuration
- **Events** — dispatch `driven:serving` event on panel boot (SRS §3.17)
- **Tests** — panel registration, routing, middleware, theming, multi-panel

**Expected Output:**
- A panel shell renders with sidebar, top bar, and content area
- Routing works under the configured prefix (e.g., `/admin/*`)
- Theme switching works (dark/light/system) with per-panel color configuration
- Multiple panels can coexist
- All tests passing

**Reference:** Study `/home/saad/filament/packages/panels/src`

---

## Milestone 14: @driven/panels — Resources & CRUD

**Goal:** Build the Resource system — the main way users define CRUD interfaces.

**Tasks:**
- **Resource class** — declares model, form schema, table config, infolist, pages, navigation
- **ListRecords page** — renders the table from Milestone 9/10
- **CreateRecord page** — renders the form from Milestone 4/5, handles create via Lucid
- **EditRecord page** — renders pre-populated form, handles update via Lucid
- **ViewRecord page** — renders infolist from Milestone 6
- **DeleteRecord flow** — delete confirmation modal, soft-delete support
- **Inertia controllers** — one controller per resource operation, passes schema JSON as props
- **Simple/modal resources** — manage records via modals on a single page
- **Relation managers** — interactive tables on edit/view pages for related records (uses relationship actions from Milestone 7)
- **Nested resources** — resources within resources (e.g., Course > Lessons)
- **Singular resources** — single-record resources (e.g., Settings page)
- **Lifecycle hooks** — beforeFill, afterFill, beforeCreate, afterCreate, beforeSave, afterSave, data mutation hooks. `Cancel`/`Halt` exceptions respected.
- **Record events** — dispatch `driven:record.creating/created/updating/updated/saving/saved/deleting/deleted` events (SRS §3.17)
- **`transformRecord()` method** — control which model attributes are exposed to the client (ADD ADR-015)
- **Redirect behavior** — configurable redirects after create/edit/delete
- **Success/failure notifications** — auto-notifications on CRUD operations
- **Sub-navigation** — navigate between pages of a single record
- **Tests** — full CRUD flow, relationship management, lifecycle hooks, events

**Expected Output:**
- A developer can define a Resource class and get a full CRUD interface (list, create, edit, view, delete)
- Relationships manageable via relation managers
- Lifecycle hooks execute at the correct points, flow control exceptions work
- Events dispatched for all record operations
- All tests passing

---

## Milestone 15: @driven/panels — Auth & Navigation

**Goal:** Build authentication pages and the navigation system.

**Tasks:**
- **Login page** — email/password login form, integrates with `@adonisjs/auth`
- **Registration page** — user registration form
- **Password reset** — request reset + reset password pages
- **Email verification** — verify email page
- **Profile editing** — profile page with form
- **MFA (2FA)** — multi-factor authentication support (uses OneTimeCodeInput field)
- **Custom auth guards** — support different auth guard configurations
- **Guest access** — configurable unauthenticated panel access
- **Navigation system** — auto-generate nav items from resources and pages
- **Sidebar navigation** — collapsible, groups, icons, badges, active state
- **Top navigation** — alternative layout
- **Breadcrumbs** — auto-generated breadcrumbs
- **Clusters** — group resources/pages under nav sections
- **User menu** — avatar (via provider), name, custom items, theme selector, logout
- **Tests** — auth flows, navigation rendering, breadcrumbs

**Expected Output:**
- Full auth flow: register → login → reset password → verify email → profile
- Navigation auto-generated from resources with groups, icons, badges
- Both sidebar and top navigation layouts work
- User menu functional with avatar
- All tests passing

---

## Milestone 16: @driven/panels — Advanced Features

**Goal:** Build the remaining panel features — multi-tenancy, global search, authorization, and i18n.

**Tasks:**
- **Multi-tenancy** — tenant model, tenant switching, tenant registration, automatic query scoping (single-database, column-based default), tenant middleware, `driven:tenant.set` event
- **Global search** — search across all resources from nav bar, custom result rendering
- **Authorization** — Bouncer policy integration for all CRUD operations (viewAny, view, create, update, delete, deleteAny, forceDelete, forceDeleteAny, restore, restoreAny, reorder), strict mode
- **Internationalization** — translatable strings, RTL layout support, translation key support in all labels
- **Database transactions** — configurable transaction wrapping for CRUD operations
- **Unsaved changes alerts** — warn before navigating away from dirty forms
- **Custom pages** — standalone pages outside resources with nav config, widgets, actions
- **Component caching** — `node ace driven:cache` / `driven:clear-cache` for production optimization
- **Tests** — multi-tenancy scoping, global search, authorization, i18n

**Expected Output:**
- Multi-tenancy works: users belong to tenants, resources scoped to tenant
- Global search returns results across resources
- Authorization enforced on all operations
- UI strings translatable, RTL supported
- All tests passing

---

## Milestone 17: Code Generation (Ace CLI)

**Goal:** Build all `node ace make:driven-*` commands for scaffolding.

**Tasks:**
- **make:driven-resource** — generate a Resource class (with flags: `--generate`, `--simple`, `--soft-deletes`, `--view`)
- **make:driven-page** — generate a custom Page class
- **make:driven-widget** — generate a Widget class (with type flag: `--stats`, `--chart`, `--table`, `--custom`)
- **make:driven-relation-manager** — generate a RelationManager class
- **make:driven-panel** — generate a Panel configuration
- **Stubs/templates** — create template files in `stubs/` directory
- **Tests** — verify generated files are correct and functional

**Expected Output:**
- All `node ace make:driven-*` commands work and generate correct, functional code
- Generated code follows project conventions
- All tests passing

---

## Milestone 18: Testing Utilities

**Goal:** Build first-class testing helpers that users can use in their own test suites.

**Tasks:**
- **Resource test helpers** — test CRUD operations end-to-end (assert record created, updated, deleted)
- **Table test helpers** — test sorting, filtering, searching, actions, column rendering
- **Schema test helpers** — test form filling, validation, field visibility
- **Action test helpers** — test action execution, modal flow, authorization
- **Notification test helpers** — test notification delivery and content
- **Japa plugin** — integrate as a Japa plugin for clean test API
- **Tests** — test the test helpers themselves

**Expected Output:**
- Users can write tests like: `await resource(PostResource).assertCanCreate({ title: 'Hello' })`
- Helpers cover all major testing scenarios
- Published as part of the package suite
- All tests passing

---

## Milestone 19: Integration Testing & Demo App

**Goal:** Validate the entire framework works end-to-end by building a real application.

**Tasks:**
- **Demo app** — build a blog admin panel (Posts, Categories, Tags, Comments, Users, Dashboard)
- **End-to-end Playwright tests** — test the demo app in a real browser
- **Performance profiling** — measure page load, table rendering with large datasets, form submission latency
- **Accessibility audit** — run aXe or similar tools, fix any WCAG 2.1 AA violations
- **Cross-browser testing** — Chrome, Firefox, Safari, Edge
- **Mobile responsiveness** — test on mobile viewports
- **Bug fixes** — fix anything discovered during integration testing

**Expected Output:**
- A fully functional demo app showcasing all framework features
- Playwright E2E tests passing across browsers
- No critical accessibility violations
- Performance meets NFR requirements (10k+ row tables, fast page loads)

---

## Milestone 20: Documentation

**Goal:** Write comprehensive documentation for all packages and features.

**Tasks:**
- **Getting started guide** — installation, first resource, first panel
- **Package-level docs** — one doc section per package (support, schemas, forms, tables, query-builder, actions, notifications, widgets, panels)
- **API reference** — auto-generated from TypeScript types
- **Examples** — code examples for every feature
- **Migration guide** — for developers coming from Laravel Filament
- **Plugin development guide** — how to build Driven plugins (once plugin system exists)
- **Deploy guide** — deploying a Driven application

**Expected Output:**
- Documentation site (or markdown docs) covering all features
- Every SRS requirement has corresponding documentation
- Code examples are tested and working

---

## Milestone 21: Release Preparation

**Goal:** Prepare for the first public release.

**Tasks:**
- **npm publishing setup** — configure all packages for npm registry under `@driven/*` scope
- **Versioning** — all packages version-locked (same version number, like Filament), semver, initial version 0.1.0
- **License** — MIT license file in every package and the repo root
- **Changelog** — document all features
- **GitHub repository** — public repo, LICENSE file, CONTRIBUTING.md
- **CI/CD** — automated publishing pipeline on tagged releases
- **Announcement** — prepare launch content

**Expected Output:**
- All `@driven/*` packages published to npm
- GitHub repository public with proper documentation
- CI/CD pipeline auto-publishes on release tags
- v0.1.0 released

---

## Dependency Graph

```
Milestone 0 (Infrastructure)
    └── Milestone 1 (@driven/support)
        ├── Milestone 2 (@driven/schemas server)
        │   └── Milestone 3 (Svelte Foundation & Design System)
        │       ├── Milestone 4 (@driven/forms server)
        │       │   └── Milestone 5 (@driven/forms client)
        │       │       └── Milestone 7 (@driven/actions)
        │       │           ├── Milestone 8 (@driven/query-builder)
        │       │           │   └── Milestone 9 (@driven/tables server)
        │       │           │       └── Milestone 10 (@driven/tables client)
        │       │           └── Milestone 13 (Panels — Core Shell)
        │       │               ├── Milestone 14 (Panels — Resources & CRUD)
        │       │               ├── Milestone 15 (Panels — Auth & Navigation)
        │       │               └── Milestone 16 (Panels — Advanced)
        │       └── Milestone 6 (@driven/infolists)
        ├── Milestone 11 (@driven/notifications)
        └── Milestone 12 (@driven/widgets) — depends on Milestone 3 + 9

Milestone 17 (CLI) — after Milestone 16
Milestone 18 (Testing Utils) — after Milestone 16
Milestone 19 (Integration Test) — after Milestone 18
Milestone 20 (Documentation) — after Milestone 19
Milestone 21 (Release) — after Milestone 20
```

---

## Estimation Notes

This is a large-scale project. For context, the original Laravel Filament is ~128,000 lines of PHP + ~14,000 lines of Blade templates + a separate query-builder package (~3,500 lines). The TypeScript rewrite will likely be comparable in scope, though TypeScript + Svelte may be more concise in some areas and more verbose in others.

Each milestone is designed to be completable in focused work sessions. The early milestones (0–3) establish foundations and are smaller. The middle milestones (4–12) are the bulk of the work. The panel milestones (13–16) integrate everything together.

---

*End of Document*
