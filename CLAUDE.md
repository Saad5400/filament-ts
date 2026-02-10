# Driven

## Main Goal

Rewrite Laravel Filament (a Server-Driven UI framework for admin panels) in TypeScript.

## What is Filament?

Filament is a collection of tools for rapidly building beautiful admin panels, dashboards, and form-based applications for Laravel. It uses a **Server-Driven UI (SDUI)** approach - you define interfaces declaratively using PHP configuration objects rather than writing templates or frontend code.

Built on: **Livewire** + **Alpine.js** + **Tailwind CSS** (the "TALL" stack)

## Core Features

### Resources (CRUD)
- Build complete CRUD interfaces for any data model
- **Listing records** - sortable, filterable tables
- **Creating records** - forms with validation
- **Editing records** - pre-populated forms
- **Viewing records** - read-only infolists
- **Deleting records** - with confirmation modals
- **Managing relationships** - handle related records (belongsTo, hasMany, etc.)
- **Nested resources** - resources within resources (e.g., comments under posts)
- **Singular resources** - single-record resources (e.g., site settings)
- **Global search** - search across all resources from nav bar
- **Using widgets on resource pages** - embed widgets in list/create/edit pages
- **Custom resource pages** - fully custom pages for a resource

### Tables
- **Columns**: text (with badge mode), icon (with boolean mode), image, color, select, toggle, text input, checkbox, view (custom Svelte component)
- **Column groups**: multi-level table headers
- **Column layouts**: split, stack, grid, panel (responsive row rendering)
- **Filters**: select filters, multi-select filters, ternary filters (yes/no/all), trashed filter (soft-deletes), query builder (advanced), custom filters, filter layout, filter indicators
- **Actions**: bulk actions, row actions, header actions, relationship actions (attach/detach/associate/dissociate)
- **Layout**: column arrangement, reordering, resizing
- **Summaries**: sum, avg, min, max, count, range per column
- **Grouping rows**: group by column values with collapsible groups
- **Empty state**: custom empty state UI
- **Custom data**: use any data source (not just database)
- **Column manager**: toggle column visibility UI
- **Deferred loading**: async data load with skeleton placeholder
- **Striped rows**: alternating row background colors
- **Pagination modes**: standard, simple, cursor

### Forms (27 Field Types)
Text input, select, checkbox, toggle, checkbox list, radio, date-time picker, date picker, time picker, file upload, rich editor (WYSIWYG), markdown editor, repeater (repeatable fields), builder (dynamic block templates), tags input, textarea, key-value editor, color picker, toggle buttons, slider, code editor, hidden fields, morph-to select, placeholder, one-time code input, view field, table select, custom fields. Plus **integrated validation** and **multi-step wizards**.

### InfoLists (Read-Only Display)
Text entry, icon entry, image entry, color entry, code entry, key-value entry, repeatable entry (lists), custom entries. Perfect for "view" pages and detail displays.

### Actions
- **Modal actions** - open modal windows
- **Slide-over actions** - slide-over panels from screen edge
- **Grouped actions** - dropdowns with multiple actions
- **Prebuilt actions**: create, edit, view, delete, restore (soft deletes), force-delete, replicate, attach, detach, associate, dissociate + bulk variants
- **Custom actions** - build your own with forms, logic, authorization

### Notifications
- **Flash notifications** - toast messages that appear immediately, with inline display mode
- **Database notifications** - persistent notifications stored in DB, shown in notification center
- **Broadcast notifications** - real-time notifications via SSE (`@adonisjs/transmit`)

### Widgets
- **Stats overview widgets** - display metrics with trend indicators
- **Chart widgets** - line, bar, pie, doughnut charts
- **Custom widgets** - render anything

### Panel Configuration
- **Multi-panel support** - multiple admin panels in one app
- **Custom branding** - logo, title, colors, favicon
- **Authentication** - login, logout, password reset
- **Middleware** - custom middleware for routes
- **Theme system** - light/dark mode with system preference
- **Routing** - custom route configuration
- **SPA mode** - client-side navigation between panel pages
- **Error notifications** - user-friendly toast notifications instead of error pages in production
- **Unsaved changes alerts** - warn before navigating away from dirty forms
- **Database transactions** - configurable transaction wrapping for CRUD operations

### Navigation
- **Custom pages** - standalone pages outside of resources
- **User menu** - authenticated user menu with profile, logout
- **Clusters** - group related resources under navigation sections (e.g., "Blog" cluster with Posts, Categories, Tags)

### Users & Security
- **Multi-factor authentication (MFA)** - 2FA support
- **Multi-tenancy** - built-in tenant support for SaaS apps

### Customizing Styling
- **CSS hooks** - semantic CSS classes (`.dr-*`) for targeting components
- **Colors** - customize color scheme
- **Icons** - use any icon library (Blade Icons)

### Schemas (Core Engine)
- **Layout components**: Group, Grid, Flex, Fieldset, Section, Tabs, Wizard, Callout, EmptyState, FusedGroup
- **Prime/utility components**: Text, Icon, Image, UnorderedList, Html, View, RenderHook, Actions, EmbeddedSchema, EmbeddedTable
- **StateCast system** - transform state between UI and storage representations
- **Extra attributes** - escape hatch for arbitrary HTML attributes on any component
- **configureUsing** - set default configuration for all instances of a component type
- **URL opening** - make any component clickable to navigate
- **Clipboard copying** - click to copy component value

### Advanced Features
- **Render hooks** - inject custom content at specific points in components
- **Registering assets** - add custom CSS/JS
- **Enum tricks** - use enums for selects, toggles, etc.
- **File generation** - Ace commands to generate resources, pages, etc.
- **Modular architecture** - 10-package monorepo with clean dependency tree

### Testing
- **Testing resources** - test CRUD operations
- **Testing tables** - test sorting, filtering, actions
- **Testing schemas** - test forms and infolists
- **Testing actions** - test action logic and authorization
- **Testing notifications** - test notification delivery

### Plugins
- **Panel plugins** - extend panels with new features
- **Standalone plugins** - distribute features as packages
- **Plugin development** - tools for building plugins

### Standalone Components
Can use Driven components outside panels: Avatar, Badge, Breadcrumbs, Button, Checkbox, Dropdown, Empty State, Fieldset, Icon button, Input wrapper, Input, Link, Loading indicator, Modal, Pagination, Section, Select, Tabs

### Local copy of Filament

The following directory contains the filament project cloned from GitHub which contains all the source code and documentation for Filament:

```
/home/saad/filament
```

## Project Status

**Current SDLC Phase:** Design (Phase 2) — Technology stack decisions complete, architecture patterns defined, all critical ADRs documented

### Completed
- [x] Requirements Gathering — stakeholder questions answered
- [x] Software Requirements Specification (SRS) — see `SRS.md` (v1.3)
- [x] Technology Stack Decisions — see `ADD.md`
- [x] Architecture Design Document (ADD) — see `ADD.md` (v1.2, ADR-001 through ADR-019)
- [x] Milestones & Task Breakdown — see `MILESTONES.md` (v1.2, 22 milestones)
- [x] Critical architecture gaps resolved:
  - Reactive/live field updates via AJAX/Axios (ADR-011)
  - Table state in URL query parameters (ADR-012)
  - Asset distribution & unified design system (ADR-013)
  - Database migration strategy (ADR-014)
  - Schema serialization strategy with paginated data (ADR-015)
  - Static configuration defaults via configureUsing (ADR-019)
  - Events system, flow control, rate limiting
  - StateCast system for state transformation
  - Drag-and-drop library (SortableJS), date picker (Bits UI), markdown rendering (marked)

### Next Steps
- [ ] **Implementation Phase** — Build packages bottom-up (see `MILESTONES.md` for detailed task breakdown)
  - `@driven/support` → `schemas` → `forms` → `infolists` → `actions` → `query-builder` → `tables` → `notifications` → `widgets` → `panels`
- [ ] **Testing Phase** — Comprehensive test suite (Japa + Playwright)
- [ ] **Documentation Phase** — API docs, guides, examples

### Deferred (Out of Scope for Initial Release)
- ImportAction / ExportAction (requires background job/queue system)
- Widget/component polling (auto-refresh)
- Plugin system (critical but not day-one)
- Chunked file uploads / client-side image cropping

### Technology Stack (decided)
- **Backend:** AdonisJS v7+ (TypeScript-first, opinionated — mirrors Laravel Filament's relationship with Laravel)
- **ORM:** Lucid ORM (direct coupling, no adapter pattern)
- **CLI:** Ace (code generation commands: `node ace make:driven-resource`, etc.)
- **Frontend:** Svelte 5 (runes) via Inertia.js
- **SSR:** Enabled via `@adonisjs/inertia` SSR mode (required, not optional)
- **CSS:** Tailwind CSS 4 + `@driven/tailwind` plugin
- **Validation:** VineJS (server-side, errors propagated via Inertia)
- **Authentication:** `@adonisjs/auth`
- **Authorization:** `@adonisjs/bouncer` (equivalent to Laravel Policies)
- **Build tool:** Vite (`@adonisjs/vite`)
- **Testing:** Japa (unit/integration) + Playwright (E2E)
- **File storage:** `@adonisjs/drive`
- **Mail:** `@adonisjs/mail`
- **Cache:** `@adonisjs/cache`
- **Real-time:** `@adonisjs/transmit` (SSE, for broadcast notifications)
- **Security:** `@adonisjs/shield` (CSRF, XSS)
- **i18n:** AdonisJS i18n
- **HTTP client:** Axios (for reactive field AJAX alongside Inertia)
- **UI primitives:** Bits UI (headless) + shadcn-svelte (styling reference)
- **Class merging:** tailwind-merge + clsx (via `cn()` utility)
- **Rich text:** Tiptap
- **Code editor:** CodeMirror 6
- **Charts:** Chart.js
- **Icons:** Lucide Svelte (default, pluggable)
- **Drag-and-drop:** SortableJS (for Repeater/Builder reordering, table row reordering)
- **Date/time picker:** Custom (Bits UI Popover + Calendar primitives)
- **Markdown rendering:** marked (for MarkdownEditor preview)

### Key Decisions Made
- **Vision:** Spiritual successor to Laravel Filament for the JS/TS ecosystem (not a 1:1 port)
- **License:** MIT (open source)
- **Target Users:** Developers in general (same as Laravel Filament)
- **Browser Support:** Modern browsers only
- **SSR:** Required (Inertia SSR mode)
- **Offline:** Works when full-stack app runs locally (no frontend-only offline)
- **Plugin System:** Critical but not day-one
- **No MVP approach:** Full feature parity with Laravel Filament is the goal (iterative build, no partial public release)
- **Opinionated stack:** Users MUST use AdonisJS + Lucid + Svelte 5 (see ADR-001 in ADD.md)
- **Reactive fields:** AJAX via Axios (not Livewire), dedicated `/driven/state-update` endpoint (ADR-011)
- **Table state:** URL query parameters for shareable/bookmarkable views (ADR-012)
- **Design system:** CSS custom properties (`--dr-*`), semantic `.dr-*` classes, OKLCH color system (ADR-013)
- **Migrations:** Package-registered, user runs `node ace migration:run` — no publishing needed (ADR-014)
- **Serialization:** Server evaluates all closures; client receives static JSON + declarative visibility rules (ADR-015)
- **No Macroable pattern:** Use TypeScript mixins and class extension instead (ADR-016)
- **Events:** AdonisJS event emitter for domain events (ADR-018)
- **configureUsing:** Static default configuration for all component instances (ADR-019)
- **Version-locked packages:** All `@driven/*` packages share the same version number

### Developer Quick Start

> **Always use CLI commands when available. Do not manually create config files.**

```bash
# Scaffold a new AdonisJS project with the Driven stack
npm init adonisjs -- -K=inertia --adapter=svelte --ssr --db=postgres

# Install Driven (once published)
npm install @driven/panels

# Generate resources, pages, widgets via Ace
node ace make:driven-resource Post
node ace make:driven-page Dashboard
node ace make:driven-widget StatsOverview
```

Starter kit: https://github.com/adonisjs/inertia-starter-kit

### Project Documents
- `CLAUDE.md` — Project context and status (this file)
- `SRS.md` — Software Requirements Specification (v1.3 — 27 field types, 10 packages, StateCast system, extra attributes, column groups/layouts, advanced RichEditor, events, flow control, file upload architecture)
- `ADD.md` — Architecture Design Document (v1.2 — 19 ADRs covering all critical architecture decisions, including configureUsing pattern, drag-and-drop, date picker, markdown rendering, paginated data serialization)
- `MILESTONES.md` — Project milestones and progress tracker (v1.2 — 22 milestones, 0–21, with corrected dependency graph)
