# Software Requirements Specification (SRS)

## Driven: Server-Driven UI Framework for TypeScript

**Document Version:** 1.2
**Date:** 2026-02-10
**Status:** Approved — Design Phase Active

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **Driven**, an open-source Server-Driven UI (SDUI) framework for the TypeScript/JavaScript ecosystem. It is a spiritual successor to [Laravel Filament](https://filamentphp.com) — preserving Filament's design philosophy, developer experience, and core capabilities, while rethinking the implementation for TypeScript idioms and the JS ecosystem.

This SRS serves as the single source of truth for what the system must do. All design, architecture, and implementation decisions must trace back to requirements defined here.

### 1.2 Scope

Driven will provide:

- A **declarative, configuration-driven** approach to building full-featured admin panels, dashboards, CRUD interfaces, and form-based applications — entirely in TypeScript.
- A **modular package architecture** that allows developers to use the full panel framework or individual packages (forms, tables, schemas, actions, notifications, widgets) independently.
- A set of **standalone UI components** usable in any project context.

Driven is **not** limited to admin panels — it must be suitable for any application that benefits from convention-over-configuration UI patterns.

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|-----------|
| **SDUI** | Server-Driven UI — the server defines the structure, content, and behavior of the UI using configuration objects; the client renders them. |
| **Schema** | A tree of component configuration objects that describes a piece of UI. The fundamental building block. |
| **Resource** | A CRUD interface bound to a data model. Includes list, create, edit, view, and delete capabilities. |
| **Panel** | A self-contained application shell (nav, auth, routing, branding) that hosts resources, pages, and widgets. |
| **Action** | A user-triggered operation — a button, its optional modal, form, and server-side logic. |
| **Component** | A configuration object in a schema (field, entry, layout, prime). |
| **Field** | A form component that accepts user input and has integrated validation. |
| **Entry** | An infolist component that displays read-only data in a key-value format. |
| **Concern/Mixin** | A reusable behavior applied to a component via composition (TypeScript equivalent of PHP traits). |

### 1.4 Reference Material

- Laravel Filament v4 source code: `/home/saad/filament`
- Laravel Filament v4 documentation: `/home/saad/filament/docs`
- Filament website: https://filamentphp.com

---

## 2. Overall Description

### 2.1 Product Perspective

Driven exists to bring Laravel Filament's battle-tested developer experience to the JavaScript/TypeScript ecosystem. It is:

- **Open-source** (MIT license).
- A **spiritual successor** — not a line-for-line port. It preserves Filament's design philosophy and API ergonomics while leveraging TypeScript's type system, modern JS patterns, and the JS ecosystem.
- **Opinionated** — requires AdonisJS as the backend framework, Lucid ORM for data, and Svelte 5 for rendering. See `ADD.md` for the full technology stack and rationale.

### 2.2 Product Features (High-Level)

1. **Panel Builder** — Multi-panel application shell with auth, navigation, theming, and routing.
2. **Resources (CRUD)** — Declarative CRUD interfaces for data models.
3. **Tables** — Interactive data tables with columns, filters, sorting, searching, pagination, grouping, summaries, and actions.
4. **Forms** — 27 field types with integrated validation, dynamic visibility, and relationship support.
5. **Schemas** — The core composition engine: arrays of component objects that define UI.
6. **Infolists** — Read-only data display using entry components.
7. **Actions** — Buttons with optional modals/forms/logic — usable anywhere in the UI.
8. **Notifications** — Flash, database-backed, and broadcast notification systems.
9. **Widgets** — Stats, charts, tables, and custom widgets for dashboards.
10. **Standalone Components** — Low-level UI components usable outside the panel context.
11. **Plugin System** — Extensibility for panel plugins and standalone plugins.
12. **Testing Utilities** — First-class testing helpers for all packages.
13. **CLI / Code Generation** — Commands to scaffold resources, pages, widgets, and more.

### 2.3 User Characteristics

**Primary users:** TypeScript/JavaScript developers building data-rich applications (admin panels, dashboards, internal tools, CRMs, CMSes, SaaS apps).

**Skill level:** Same as Laravel Filament — accessible to developers with basic framework experience, while powerful enough for advanced use cases. Developers should not need deep frontend expertise to build high-quality interfaces.

### 2.4 Constraints

| Constraint | Detail |
|------------|--------|
| **Language** | TypeScript (strict mode). JavaScript consumption must be supported. |
| **Browser support** | Modern browsers only (latest 2 versions of Chrome, Firefox, Safari, Edge). No IE support. |
| **SSR** | Server-side rendering is a required capability. |
| **Offline** | The application must function when the full-stack app runs locally in production (local backend + frontend). No frontend-only offline support. |
| **Open source** | All core packages must be open-source. |

### 2.5 Assumptions & Dependencies

- The user is running an **AdonisJS v7+** application with Lucid ORM, Inertia.js, and Svelte 5.
- The application was scaffolded using the [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/inertia-starter-kit) with `--adapter=svelte --ssr`.
- Tailwind CSS 4 is used for the styling foundation (consistent with Filament's approach).
- All technology stack decisions are recorded in `ADD.md` (Architecture Design Document).

---

## 3. Functional Requirements

### 3.1 Package Architecture

**FR-PKG-001:** The system SHALL be organized as a monorepo of independently installable packages:

| Package | Purpose | Dependencies |
|---------|---------|-------------|
| `@driven/support` | Shared utilities, base component class, concerns/mixins, color system, icon system | None |
| `@driven/schemas` | Core schema engine, layout components, prime components | support |
| `@driven/forms` | Form field components with integrated validation | support, schemas |
| `@driven/infolists` | Read-only entry components | support, schemas |
| `@driven/actions` | Action system (buttons, modals, prebuilt CRUD actions) | support, schemas, forms |
| `@driven/query-builder` | Advanced multi-condition query builder (constraints, operators, rule builder UI) | support, schemas, forms |
| `@driven/tables` | Table builder (columns, filters, pagination, sorting) | support, schemas, forms, actions, query-builder |
| `@driven/notifications` | Notification system (flash, database, broadcast) | support |
| `@driven/widgets` | Dashboard widgets (stats, charts, tables, custom) | support, schemas, tables |
| `@driven/panels` | Panel builder (auth, nav, resources, routing, theming) | All above |

**FR-PKG-002:** Each package SHALL be independently installable and usable without requiring the panel builder.

**FR-PKG-003:** The `@driven/support` package SHALL provide the foundational utilities used by all other packages, including: base Component class, the closure/callback evaluation system, the configuration system, the color system, and the icon system.

---

### 3.2 Core Engine: Schemas

**FR-SCH-001:** A Schema SHALL be a container for an ordered array of component configuration objects.

**FR-SCH-002:** Components SHALL support infinite nesting — a component may contain child schemas.

**FR-SCH-003:** The schema engine SHALL support the following component categories:
- **Form Fields** (user input with validation)
- **Infolist Entries** (read-only display)
- **Layout Components** (structural arrangement)
- **Prime Components** (static content)
- **Action Components** (interactive buttons)

**FR-SCH-004:** All components SHALL support a fluent, chainable API for configuration:
```typescript
TextInput.make('name')
  .required()
  .maxLength(255)
  .label('Full Name')
```

**FR-SCH-005:** Components SHALL support dynamic configuration via callbacks/closures that receive contextual data (current record, form state, authenticated user, etc.).

**FR-SCH-006:** Layout components SHALL include at minimum:
- Grid (responsive column grid)
- Flex (flexbox layout)
- Fieldset (grouped fields with border)
- Section (collapsible card with heading)
- Tabs (tabbed interface)
- Wizard (multi-step form)
- Callout (highlighted information box)
- Empty State (placeholder for no-data scenarios)

**FR-SCH-007:** Prime components SHALL include at minimum:
- Text (static text)
- Icon (icon display)
- Image (image display)
- Unordered List

---

### 3.3 Forms

**FR-FRM-001:** The forms package SHALL provide the following field types:

| # | Field | Description |
|---|-------|-------------|
| 1 | TextInput | Single-line text, email, phone, URL, password, numeric |
| 2 | Textarea | Multi-line text |
| 3 | Select | Single/multi-select dropdown with search, create-new-option |
| 4 | Checkbox | Single boolean checkbox |
| 5 | Toggle | Toggle switch |
| 6 | CheckboxList | Multiple checkboxes from options |
| 7 | Radio | Radio button group |
| 8 | DateTimePicker | Date, time, datetime, and date range selection |
| 9 | FileUpload | Single/multiple file upload with preview |
| 10 | RichEditor | WYSIWYG rich text editor |
| 11 | MarkdownEditor | Markdown text editor with preview |
| 12 | Repeater | Repeatable set of fields (add/remove/reorder items) |
| 13 | Builder | Dynamic block-based content builder with templates |
| 14 | TagsInput | Tag input with autocomplete |
| 15 | KeyValue | Key-value pair editor |
| 16 | ColorPicker | Color selection |
| 17 | ToggleButtons | Button-style selection (single/multiple) |
| 18 | Slider | Range/value slider |
| 19 | CodeEditor | Code editor with syntax highlighting |
| 20 | Hidden | Hidden form field |
| 21 | MorphToSelect | Polymorphic relationship select — select morphTo related model type and record |
| 22 | Placeholder | Display-only static text/content within a form (no user input) |
| 23 | OneTimeCodeInput | OTP/MFA verification code input with individual digit boxes |
| 24 | DatePicker | Date-only selection (simplified variant of DateTimePicker) |
| 25 | TimePicker | Time-only selection (simplified variant of DateTimePicker) |
| 26 | ViewField | Render a custom Svelte component inline within a form |
| 27 | TableSelect | Select records via a searchable table in a modal popup |

**FR-FRM-002:** All fields SHALL support integrated validation with methods like `required()`, `maxLength()`, `email()`, `unique()`, `rules()`, etc. Both client-side and server-side validation SHALL be supported.

**FR-FRM-003:** Fields SHALL support dynamic visibility via `visible()`, `hidden()`, `visibleOn()`, `hiddenOn()` methods.

**FR-FRM-004:** Fields SHALL support reactive/live updates — when a field value changes, other fields can react (update options, toggle visibility, compute values). Reactive updates SHALL be implemented via dedicated AJAX endpoints (see ADD ADR-011). Fields SHALL support `live()`, `lazy()` (on blur), and `debounce()` modifiers. Fields SHALL support `afterStateUpdated()` server-side callbacks and client-side Svelte reactivity for simple cases.

**FR-FRM-005:** Forms SHALL support saving data to relationships:
- BelongsTo, HasOne, MorphOne via layout components with `relationship()` method
- HasMany, MorphMany via Repeater with `relationship()` method
- BelongsToMany via Select/CheckboxList with `relationship()` method

**FR-FRM-006:** Fields SHALL support default values, placeholder text, help text, hints, prefixes, suffixes, and custom validation messages.

**FR-FRM-007:** Developers SHALL be able to create custom field types.

**FR-FRM-008:** Multi-step wizard forms SHALL be supported via Wizard layout component.

---

### 3.4 Tables

**FR-TBL-001:** The table builder SHALL support the following column types:

| # | Column | Description |
|---|--------|-------------|
| 1 | TextColumn | Display text, with formatting options |
| 2 | IconColumn | Display icons, including boolean icons |
| 3 | ImageColumn | Display images/thumbnails |
| 4 | ColorColumn | Display color swatches |
| 5 | SelectColumn | Inline select editing |
| 6 | ToggleColumn | Inline toggle editing |
| 7 | TextInputColumn | Inline text editing |
| 8 | CheckboxColumn | Inline checkbox editing |

**FR-TBL-002:** Columns SHALL support: sorting, searching (individual & global), toggling visibility, responsive breakpoints, tooltips, formatting, and custom rendering.

**FR-TBL-003:** Tables SHALL support filters:
- Base filter (custom query + form UI)
- Select filter (filter by a select dropdown)
- Ternary filter (yes/no/all)
- Query builder integration (advanced multi-condition filter, provided by `@driven/query-builder` — see §3.16)
- Custom filters
- Configurable filter layout (dropdown, sidebar, above table)

**FR-TBL-004:** Tables SHALL support actions:
- **Record actions** (per-row actions like edit, delete, view)
- **Header actions** (above the table, like create, import)
- **Toolbar/Bulk actions** (actions on selected records, like bulk delete)

**FR-TBL-005:** Tables SHALL support:
- Pagination (with configurable page sizes)
- Row click behavior (link to URL, open modal, etc.)
- Record URL generation
- Row reordering (drag-and-drop)
- Column summaries (sum, average, count, min, max, custom)
- Row grouping (group by column value)
- Empty state customization
- Custom data sources (not limited to database/ORM)
- Tabs for pre-filtered views above the table

**FR-TBL-006:** Columns SHALL support displaying data from relationships using dot notation (e.g., `author.name`).

**FR-TBL-007:** Developers SHALL be able to create custom column types.

**FR-TBL-008:** Table state (current page, sort column, sort direction, active filters, search query) SHALL be persisted in URL query parameters to enable shareable/bookmarkable table views and proper browser back/forward navigation. See ADD ADR-012.

---

### 3.5 Infolists

**FR-INF-001:** The infolist package SHALL provide the following entry types:

| # | Entry | Description |
|---|-------|-------------|
| 1 | TextEntry | Display text with formatting |
| 2 | IconEntry | Display icons |
| 3 | ImageEntry | Display images |
| 4 | ColorEntry | Display color swatches |
| 5 | CodeEntry | Display formatted code |
| 6 | KeyValueEntry | Display key-value pairs |
| 7 | RepeatableEntry | Display lists of sub-entries |

**FR-INF-002:** Entries SHALL share the same layout system as forms (Grid, Section, Tabs, etc.).

**FR-INF-003:** Developers SHALL be able to create custom entry types.

---

### 3.6 Actions

**FR-ACT-001:** An Action SHALL encapsulate:
- A trigger (button/link/icon button/badge)
- An optional modal or slide-over with configurable content
- An optional form for collecting user input
- Server-side logic to execute when submitted
- Authorization checks

**FR-ACT-002:** Actions SHALL support four trigger styles: button, link, icon button, badge.

**FR-ACT-003:** Actions SHALL support modals with:
- Confirmation dialogs (requiresConfirmation)
- Custom form schemas
- Custom content (schema components)
- Slide-over variant
- Configurable width, alignment, close behavior

**FR-ACT-004:** The package SHALL provide prebuilt actions:

*Record actions:*
- CreateAction
- EditAction
- ViewAction
- DeleteAction (with soft-delete support)
- ForceDeleteAction
- RestoreAction
- ReplicateAction

*Relationship actions (for relation managers):*
- AttachAction (attach existing records to BelongsToMany)
- DetachAction (detach records from BelongsToMany)
- AssociateAction (associate a record to HasMany)
- DissociateAction (dissociate a record from HasMany)

*Bulk actions (operate on selected records):*
- DeleteBulkAction
- ForceDeleteBulkAction
- RestoreBulkAction
- DetachBulkAction
- DissociateBulkAction

> **Deferred:** ImportAction (CSV import) and ExportAction (CSV/XLSX export) are deferred to a future release. They require a background job/queue system that is out of scope for the initial version. See ADD §7.

**FR-ACT-005:** Actions SHALL support grouping (dropdown of actions) via ActionGroup and BulkActionGroup.

**FR-ACT-006:** Actions SHALL support lifecycle hooks (before, after).

**FR-ACT-007:** Actions SHALL support authorization checks via `@adonisjs/bouncer`.

**FR-ACT-008:** Actions SHALL support key bindings.

**FR-ACT-009:** Actions SHALL be usable in any context: page headers, form footers, table rows, table headers, table toolbars, schema components, notifications.

**FR-ACT-010:** Actions SHALL support rate limiting to prevent abuse of sensitive operations.

**FR-ACT-011:** Actions SHALL dispatch events via AdonisJS's event emitter (`@adonisjs/events`) at key lifecycle points (e.g., `driven:action.called`, `driven:action.completed`). See §3.18 for the full events system.

---

### 3.7 Notifications

**FR-NOT-001:** Flash notifications SHALL:
- Support title, body, icon, color, and status (success, warning, danger, info)
- Support action buttons within the notification
- Support configurable duration and dismissibility
- Be triggerable from both server-side code and client-side JavaScript

**FR-NOT-002:** Database notifications SHALL:
- Be stored persistently in a database
- Be rendered in a slide-over notification center accessible from the UI
- Support mark-as-read functionality
- Support the same display options as flash notifications

**FR-NOT-003:** Broadcast notifications SHALL:
- Be delivered in real-time via Server-Sent Events (`@adonisjs/transmit`)
- Support the same display options as flash notifications

---

### 3.8 Widgets

**FR-WDG-001:** The widget system SHALL support:
- Stats overview widgets (display metrics with trend indicators, descriptions, charts)
- Chart widgets (line, bar, pie, doughnut, polar area, bubble, scatter, radar)
- Table widgets (embed tables inside widgets)
- Custom widgets (render any content)

**FR-WDG-002:** Widgets SHALL be arrangeable in a configurable grid layout.

**FR-WDG-003:** Widgets SHALL support filtering by date range and other parameters.

**FR-WDG-004:** Widgets SHALL support lazy loading.

> **Deferred:** Widget polling (auto-refresh at intervals) is deferred to a future release.

---

### 3.9 Panel Builder

#### 3.9.1 Resources (CRUD)

**FR-PNL-RES-001:** A Resource SHALL be a class that declares:
- The data model it manages
- A form schema for create/edit
- A table configuration for listing
- An optional infolist for viewing
- Page registrations (list, create, edit, view, custom)
- Navigation configuration (label, icon, group, sort, badge)
- Authorization rules

**FR-PNL-RES-002:** A Resource SHALL auto-generate pages for: listing records, creating records, editing records. Optionally: viewing records.

**FR-PNL-RES-003:** Simple/modal resources SHALL be supported — managing records on a single page with modals for create/edit/delete instead of separate pages.

**FR-PNL-RES-004:** Resources SHALL support soft-delete operations (trash, restore, force-delete, trashed filter).

**FR-PNL-RES-005:** Resources SHALL support relationship management via:
- Relation managers (interactive tables on edit/view pages)
- Relation pages (standalone pages for managing related records)
- Form-level relationship bindings (Select, Repeater, layout component `relationship()`)

**FR-PNL-RES-006:** Resources SHALL support nested resources (resources within resources, e.g., Course > Lessons).

**FR-PNL-RES-007:** Singular resources SHALL be supported (single-record pages like Settings).

**FR-PNL-RES-008:** Resources SHALL support sub-navigation for navigating between related pages of a single record.

**FR-PNL-RES-009:** Resource pages SHALL support lifecycle hooks:
- beforeFill, afterFill
- beforeValidate, afterValidate
- beforeCreate/beforeSave, afterCreate/afterSave
- Data mutation hooks (mutateFormDataBeforeFill, mutateFormDataBeforeCreate, mutateFormDataBeforeSave)

**FR-PNL-RES-010:** Resource pages SHALL support custom page content via the schema system.

**FR-PNL-RES-011:** Resources SHALL support customizable redirect behavior after create/edit/delete.

**FR-PNL-RES-012:** Resources SHALL support customizable success/failure notifications.

#### 3.9.2 Global Search

**FR-PNL-GSR-001:** The panel SHALL provide a global search feature that searches across all resources.

**FR-PNL-GSR-002:** Global search SHALL support: custom result titles, multi-column search, result details, result URLs, result actions, result limits, sorting, debounce, and keyboard shortcuts.

#### 3.9.3 Authentication

**FR-PNL-AUTH-001:** The panel SHALL provide built-in authentication pages:
- Login
- Registration
- Password reset (request + reset)
- Email verification
- Email change verification
- Profile editing

**FR-PNL-AUTH-002:** All authentication pages SHALL be customizable (forms, logic, views).

**FR-PNL-AUTH-003:** Multi-factor authentication (2FA) SHALL be supported.

**FR-PNL-AUTH-004:** Custom authentication guards SHALL be supported.

**FR-PNL-AUTH-005:** Guest access to panels SHALL be configurable.

#### 3.9.4 Multi-Tenancy

**FR-PNL-TEN-001:** The panel SHALL support multi-tenancy where a user belongs to multiple tenants (teams/organizations) and can switch between them.

**FR-PNL-TEN-002:** Multi-tenancy SHALL support:
- Tenant registration (creating new tenants)
- Tenant profile editing
- Billing integration
- Automatic scoping of resources to the current tenant
- Tenant-specific middleware
- Custom tenant slugs

#### 3.9.5 Navigation

**FR-PNL-NAV-001:** The panel SHALL auto-generate navigation items for resources, pages, and clusters.

**FR-PNL-NAV-002:** Navigation items SHALL support: labels, icons, active icons, sorting, badges (with colors and tooltips), grouping, parent-child hierarchy.

**FR-PNL-NAV-003:** The panel SHALL support both sidebar navigation and top navigation layouts.

**FR-PNL-NAV-004:** The sidebar SHALL support: collapsible on desktop, fully collapsible on desktop, custom width.

**FR-PNL-NAV-005:** Navigation groups SHALL support: custom icons, collapsibility, custom ordering, enum-based registration.

**FR-PNL-NAV-006:** Custom navigation items SHALL be registerable programmatically.

**FR-PNL-NAV-007:** Navigation SHALL support breadcrumbs (configurable).

**FR-PNL-NAV-008:** Clusters SHALL be supported — logical groupings of resources and pages with their own sub-navigation.

#### 3.9.6 Panel Configuration

**FR-PNL-CFG-001:** Each panel SHALL be independently configurable with:
- Path/URL prefix
- Domain restriction
- Branding (name, logo, favicon)
- Color scheme (6 semantic colors: primary, danger, gray, info, success, warning)
- Dark mode / Light mode / System preference
- Maximum content width
- SPA mode (client-side navigation between pages)
- Unsaved changes alerts
- Database transaction wrapping
- Font customization
- Default date/time display format
- Middleware (general and auth-specific, persistent or per-request)

**FR-PNL-CFG-002:** Multiple panels SHALL be supported in a single application, each with independent configuration, resources, pages, widgets, and auth.

**FR-PNL-CFG-003:** Render hooks SHALL be supported — named insertion points throughout the UI where custom content can be injected.

**FR-PNL-CFG-004:** Custom assets (CSS, JS) SHALL be registrable per-panel.

**FR-PNL-CFG-005:** Lifecycle hooks SHALL be supported at the panel level (e.g., boot).

#### 3.9.7 Custom Pages

**FR-PNL-PG-001:** The panel SHALL support fully custom pages (standalone pages outside of resources).

**FR-PNL-PG-002:** Custom pages SHALL support: navigation configuration, header/footer widgets, header actions, sub-navigation, authorization.

#### 3.9.8 User Menu

**FR-PNL-UM-001:** The panel SHALL provide a user menu with: avatar, name, custom items, theme selector, and logout.

**FR-PNL-UM-002:** User avatars SHALL be customizable (model attribute, avatar provider).

---

### 3.10 Standalone Components

**FR-CMP-001:** The following standalone UI components SHALL be available for use outside the panel context:

Avatar, Badge, Breadcrumbs, Button, Callout, Checkbox, Dropdown, Empty State, Fieldset, Icon Button, Input, Input Wrapper, Link, Loading Indicator, Modal, Pagination, Section, Select, Tabs.

**FR-CMP-002:** Standalone components SHALL be styled using Tailwind CSS with semantic CSS classes (`.dr-*` prefix) for customization.

---

### 3.11 Plugin System

**FR-PLG-001:** The framework SHALL support two types of plugins:
- **Panel plugins** — extend panels with resources, pages, widgets, and configuration.
- **Standalone plugins** — extend individual packages with custom fields, columns, filters, actions, etc.

**FR-PLG-002:** Panel plugins SHALL register via a Plugin class/object that integrates with panel configuration.

**FR-PLG-003:** The plugin system SHALL support: asset registration, service provider-based configuration, and composable configuration APIs.

> **Note:** Plugin support is critical but not required for the initial release.

---

### 3.12 Code Generation (CLI)

**FR-CLI-001:** The framework SHALL provide **Ace commands** (AdonisJS CLI) to generate:
- Resources (with optional --generate for auto-generating from model/schema, --simple for modal resources, --soft-deletes, --view)
- Pages (custom pages, resource pages)
- Widgets (stats, charts, tables, custom)
- Relation managers
- Panel configurations

**FR-CLI-002:** Generated code SHALL follow project conventions and be fully functional with minimal modification.

---

### 3.13 Testing Utilities

**FR-TST-001:** The framework SHALL provide testing helpers for:
- Resources (test CRUD operations end-to-end)
- Tables (test sorting, filtering, searching, actions, columns)
- Schemas (test form filling, validation, field visibility)
- Actions (test action execution, modals, authorization)
- Notifications (test notification delivery and content)

**FR-TST-002:** Testing utilities SHALL integrate with **Japa** (AdonisJS's testing framework).

---

### 3.14 Authorization

**FR-AUTH-001:** All CRUD operations SHALL support policy-based authorization:
- viewAny, view, create, update, delete, deleteAny
- forceDelete, forceDeleteAny, restore, restoreAny
- reorder

**FR-AUTH-002:** Authorization checks SHALL be granular — per-resource, per-page, per-action.

**FR-AUTH-003:** Strict authorization mode SHALL be configurable (throw on missing policy vs. allow).

---

### 3.15 Internationalization (i18n)

**FR-I18N-001:** All user-facing strings SHALL be translatable.

**FR-I18N-002:** The framework SHALL support RTL layouts.

**FR-I18N-003:** Model labels, navigation labels, and all configurable text SHALL accept translation keys/functions.

---

### 3.16 Query Builder

**FR-QB-001:** The `@driven/query-builder` package SHALL provide an advanced multi-condition filter system with a constraint/operator architecture.

**FR-QB-002:** The following constraint types SHALL be supported:

| Constraint | Description |
|---|---|
| TextConstraint | Text matching (equals, contains, starts with, ends with) |
| NumberConstraint | Numeric comparison (equals, min, max) with relationship aggregation support |
| DateConstraint | Date comparison (before, after, is date, is month, is year) |
| BooleanConstraint | Boolean filtering (is true, is false) |
| SelectConstraint | Enum/option-based filtering |
| RelationshipConstraint | Filter by relationship existence, count, or related record values |

**FR-QB-003:** Each constraint SHALL have configurable operators. Operators SHALL modify the underlying Lucid query.

**FR-QB-004:** The query builder SHALL provide a visual rule builder UI (RuleBuilder form component) allowing users to add/remove/combine conditions with AND/OR logic.

**FR-QB-005:** Constraints SHALL support nullable state (is filled / is empty operators).

**FR-QB-006:** The query builder SHALL integrate with `@driven/tables` as a filter type (QueryBuilder filter).

---

### 3.17 Events System

**FR-EVT-001:** The framework SHALL dispatch domain events via AdonisJS's event emitter (`@adonisjs/events`) at key lifecycle points:
- `driven:record.creating` / `driven:record.created`
- `driven:record.updating` / `driven:record.updated`
- `driven:record.saving` / `driven:record.saved`
- `driven:record.deleting` / `driven:record.deleted`
- `driven:action.calling` / `driven:action.called`
- `driven:tenant.set`
- `driven:serving` (panel boot)

**FR-EVT-002:** All events SHALL carry contextual data (record, user, resource, action name, etc.) so listeners can react appropriately.

**FR-EVT-003:** Developers SHALL be able to register custom event listeners for any Driven event in their AdonisJS application.

---

### 3.18 Flow Control

**FR-FLC-001:** The framework SHALL provide `Cancel` and `Halt` exception classes for controlling action and lifecycle hook flow:
- Throwing `Halt` inside a lifecycle hook SHALL abort the current operation silently (e.g., prevent save without showing an error).
- Throwing `Cancel` inside a lifecycle hook SHALL abort the current operation and optionally display a user-facing notification.

**FR-FLC-002:** Flow control exceptions SHALL be catchable at the framework level and SHALL NOT result in unhandled error pages.

---

### 3.19 File Upload Architecture

**FR-FUP-001:** File uploads SHALL work via standard multipart POST requests through Inertia form submissions, integrated with `@adonisjs/drive` for storage.

**FR-FUP-002:** File upload fields SHALL support:
- Client-side preview generation (via File API / FileReader) before form submission
- Server-side file type and size validation
- Multiple file uploads
- Image-specific features (preview thumbnails, aspect ratio constraints)

**FR-FUP-003:** For large file uploads, the framework SHALL support a dedicated upload endpoint that returns a temporary file reference. The temporary reference is then submitted with the form, decoupling the upload from the form submission.

> **Deferred:** Chunked uploads and client-side image cropping are deferred to a future release.

---

## 4. Non-Functional Requirements

### 4.1 Developer Experience (DX)

**NFR-DX-001:** The API SHALL be fluent/chainable and discoverable via IDE autocomplete (full TypeScript types).

**NFR-DX-002:** The framework SHALL follow convention-over-configuration — sensible defaults that "just work" with minimal setup.

**NFR-DX-003:** Error messages SHALL be clear and actionable, pointing to the exact issue and suggesting fixes.

**NFR-DX-004:** Documentation SHALL be comprehensive, with examples for every feature.

**NFR-DX-005:** TypeScript's type system SHALL be leveraged to catch configuration errors at compile time wherever possible.

### 4.2 User Experience (UX)

**NFR-UX-001:** The default UI SHALL be high-quality, modern, and consistent — matching or exceeding Laravel Filament's visual quality.

**NFR-UX-002:** All components SHALL be fully responsive (mobile, tablet, desktop).

**NFR-UX-003:** All components SHALL be accessible (WCAG 2.1 AA compliance).

**NFR-UX-004:** Dark mode and light mode SHALL be supported with a system-preference option.

**NFR-UX-005:** Loading states SHALL be handled gracefully with appropriate loading indicators.

**NFR-UX-006:** Keyboard navigation SHALL be supported for all interactive elements.

### 4.3 Performance

**NFR-PERF-001:** Initial page load SHALL be optimized through SSR and code splitting.

**NFR-PERF-002:** Tables SHALL handle 10,000+ records efficiently with pagination and lazy loading.

**NFR-PERF-003:** Form re-renders SHALL be minimal — only affected components should update on state changes.

**NFR-PERF-004:** Client-side bundle size SHALL be minimized through tree-shaking and lazy loading of components.

### 4.4 Scalability & Maintainability

**NFR-SCL-001:** The modular package architecture SHALL allow independent versioning and deployment of packages.

**NFR-SCL-002:** The codebase SHALL follow consistent patterns across all packages.

**NFR-SCL-003:** The concern/mixin system SHALL maximize code reuse across component types.

### 4.5 Extensibility

**NFR-EXT-001:** Every component SHALL be subclassable/extendable.

**NFR-EXT-002:** The CSS system SHALL use semantic class names (`.dr-*`) that can be overridden without modifying framework internals.

**NFR-EXT-003:** Render hooks SHALL provide injection points throughout the UI.

**NFR-EXT-004:** The plugin system SHALL enable third-party extensions without forking.

### 4.6 Security

**NFR-SEC-001:** XSS prevention SHALL be built into all rendering.

**NFR-SEC-002:** CSRF protection SHALL be integrated.

**NFR-SEC-003:** File upload fields SHALL validate file types and sizes server-side.

**NFR-SEC-004:** All model attributes exposed to the client SHALL be controllable (hidden attributes).

---

## 5. Data Requirements

### 5.1 Data Layer (Lucid ORM)

**DR-001:** The framework SHALL be coupled to **Lucid ORM** (AdonisJS's SQL ORM). Resources declare a Lucid model directly. *(Updated from v1.0 — the data adapter pattern was removed in favor of direct Lucid coupling per ADR-004 in `ADD.md`.)*

**DR-002:** The framework SHALL support standard CRUD operations via Lucid: list (with pagination, sorting, filtering), find, create, update, delete.

**DR-003:** The framework SHALL support Lucid relationship operations: belongsTo, hasOne, hasMany, manyToMany, hasManyThrough, morphTo, morphMany, morphToMany, etc.

**DR-004:** The framework SHALL support Lucid soft-delete operations (via `@adonisjs/lucid` soft-deletes mixin): trash, restore, force-delete.

---

## 6. Interface Requirements

### 6.1 API Style

**IR-001:** The primary developer interface SHALL be a fluent TypeScript API:

```typescript
// Resource definition (conceptual)
class PostResource extends Resource {
  static model = Post

  static form(schema: Schema): Schema {
    return schema.components([
      TextInput.make('title').required().maxLength(255),
      Select.make('status').options({ draft: 'Draft', published: 'Published' }),
      RichEditor.make('content'),
    ])
  }

  static table(table: Table): Table {
    return table
      .columns([
        TextColumn.make('title').sortable().searchable(),
        TextColumn.make('status').badge(),
        TextColumn.make('created_at').dateTime(),
      ])
      .filters([
        SelectFilter.make('status').options({ draft: 'Draft', published: 'Published' }),
      ])
  }
}
```

**IR-002:** Static `make()` factory methods SHALL be the standard way to create component instances.

**IR-003:** Configuration methods SHALL return `this` for chaining.

---

## 7. Quality Attributes Mapping

| Quality Attribute | Priority | Requirement IDs |
|-------------------|----------|-----------------|
| Developer Experience | Critical | NFR-DX-001 through NFR-DX-005 |
| User Experience | Critical | NFR-UX-001 through NFR-UX-006 |
| Feature Completeness | Critical | All FR-* requirements |
| Type Safety | High | NFR-DX-001, NFR-DX-005 |
| Performance | High | NFR-PERF-001 through NFR-PERF-004 |
| Extensibility | High | NFR-EXT-001 through NFR-EXT-004, FR-PLG-* |
| Accessibility | High | NFR-UX-003 |
| Security | High | NFR-SEC-001 through NFR-SEC-004 |
| Observability | High | FR-EVT-001 through FR-EVT-003 |
| Internationalization | Medium | FR-I18N-001 through FR-I18N-003 |
| Plugin System | Medium (not day-one) | FR-PLG-001 through FR-PLG-003 |

---

## 8. Acceptance Criteria

The project is considered successful when:

1. A developer can install Driven into a TypeScript project and build a fully functional admin panel with CRUD resources, in a comparable amount of code and effort as Laravel Filament.
2. All functional requirements in Section 3 are implemented and documented.
3. The developer experience (autocomplete, error messages, conventions) is at parity with or better than Laravel Filament.
4. The visual quality of the default UI is at parity with Laravel Filament.
5. The framework passes comprehensive automated tests covering all packages.
6. The framework is published as open-source with complete documentation.

---

## Appendix A: Filament Source Statistics

For reference, the original Laravel Filament codebase comprises:

| Package | PHP Files | Lines of Code |
|---------|-----------|---------------|
| support | 216 | 23,988 |
| schemas | 80 | 10,965 |
| forms | 96 | 20,556 |
| tables | 79 | 12,085 |
| query-builder | 25 | ~3,500 |
| actions | 99 | 18,362 |
| panels | 280 | 33,750 |
| notifications | 26 | 3,061 |
| widgets | 18 | 1,918 |
| infolists | 37 | 3,499 |
| **Total** | **~930** | **~128,000** |

Additionally: ~250 Blade templates (~14,000 lines) and ~70 JavaScript files.

---

## Appendix B: Glossary of Filament Design Patterns

These patterns from Filament are critical to preserve in the TypeScript rewrite:

1. **Fluent Builder Pattern** — All configuration is done via chainable method calls on objects created with `make()`.
2. **Closure/Callback Evaluation** — Any configuration value can be a static value OR a callback. The callback receives contextual data (record, state, livewire component, etc.) and is evaluated at render time. This enables dynamic, context-dependent UI.
3. **Concerns (Traits) as Composition** — Behaviors like HasColor, HasIcon, HasLabel are composed onto components via traits. The TypeScript equivalent should use mixins or a similar composition pattern.
4. **Convention over Configuration** — Labels auto-generated from names, navigation auto-generated from resources, validation integrated into fields. Things work out of the box.
5. **hiddenOn/visibleOn** — Components can be contextually shown/hidden based on the current operation (create, edit, view) or other conditions.
6. **Operation Context** — The system tracks the current operation (create, edit, view) and makes it available to all components for conditional behavior.
7. **Utility Injection** — Callbacks can declare what context they need via parameter types, and the framework injects the appropriate values.

---

## Appendix C: Deferred Features

The following features are intentionally deferred from the initial release. They are tracked here for future planning:

| Feature | Reason | Dependency |
|---|---|---|
| ImportAction / ExportAction | Requires background job/queue system not in initial scope | Job queue solution |
| Widget polling (auto-refresh) | Requires robust SSE or polling infrastructure | Reactive state architecture maturity |
| Chunked file uploads | Standard multipart sufficient for initial release | File upload field maturity |
| Client-side image cropping | Standard file upload sufficient initially | File upload field maturity |
| Plugin system | Critical but explicitly deferred per SRS §3.11 | All core packages stable |

---

*End of Document*

