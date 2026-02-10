# Filament TypeScript

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
- **Columns**: text, icon, image, color, select, toggle, text input, checkbox, custom
- **Filters**: select filters, ternary filters (yes/no/all), query builder (advanced), custom filters, filter layout
- **Actions**: bulk actions, row actions, header actions
- **Layout**: column arrangement, reordering, resizing
- **Summaries**: sum, avg, min, max per column
- **Grouping rows**: group by column values
- **Empty state**: custom empty state UI
- **Custom data**: use any data source (not just database)

### Forms (25+ Field Types)
Text input, select, checkbox, toggle, checkbox list, radio, date-time picker, file upload, rich editor (WYSIWYG), markdown editor, repeater (repeatable fields), builder (dynamic block templates), tags input, textarea, key-value editor, color picker, toggle buttons, slider, code editor, hidden fields, custom fields. Plus **integrated validation** and **multi-step wizards**.

### InfoLists (Read-Only Display)
Text entry, icon entry, image entry, color entry, code entry, key-value entry, repeatable entry (lists), custom entries. Perfect for "view" pages and detail displays.

### Actions
- **Modal actions** - open modal windows
- **Slide-over actions** - slide-over panels from screen edge
- **Grouped actions** - dropdowns with multiple actions
- **Prebuilt actions**: create, edit, view, delete, restore (soft deletes), force-delete, replicate, import, export
- **Custom actions** - build your own with forms, logic, authorization

### Notifications
- **Flash notifications** - toast messages that appear immediately
- **Database notifications** - persistent notifications stored in DB, shown in notification center
- **Broadcast notifications** - real-time notifications via websockets

### Widgets
- **Stats overview widgets** - display metrics with trend indicators
- **Chart widgets** - line, bar, pie, doughnut charts
- **Custom widgets** - render anything

### Panel Configuration
- **Multi-panel support** - multiple admin panels in one app
- **Custom branding** - logo, title, colors, favicon
- **Authentication** - login, logout, password reset
- **Middleware** - custom middleware for routes
- **Theme system** - light/dark mode
- **Routing** - custom route configuration

### Navigation
- **Custom pages** - standalone pages outside of resources
- **User menu** - authenticated user menu with profile, logout
- **Clusters** - group related resources under navigation sections (e.g., "Blog" cluster with Posts, Categories, Tags)

### Users & Security
- **Multi-factor authentication (MFA)** - 2FA support
- **Multi-tenancy** - built-in tenant support for SaaS apps

### Customizing Styling
- **CSS hooks** - semantic CSS classes (`.fi-*`) for targeting components
- **Colors** - customize color scheme
- **Icons** - use any icon library (Blade Icons)

### Advanced Features
- **Render hooks** - inject custom content at specific points in components
- **Registering assets** - add custom CSS/JS
- **Enum tricks** - use PHP enums for selects, toggles, etc.
- **File generation** - artisan commands to generate resources, pages, etc.
- **Modular architecture (DDD)** - support for domain-driven design structure

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
Can use Filament components outside panels: Avatar, Badge, Breadcrumbs, Button, Checkbox, Dropdown, Empty State, Fieldset, Icon button, Input wrapper, Input, Link, Loading indicator, Modal, Pagination, Section, Select, Tabs

### Local copy of Filament

The following directory contains the filament project cloned from GitHub which contains all the source code and documentation for Filament:

```
/home/saad/filament
```

## Project Status

**Current SDLC Phase:** Requirements Gathering & Analysis (Phase 1)

### Completed
- [x] Requirements Gathering — stakeholder questions answered
- [x] Software Requirements Specification (SRS) — see `SRS.md`

### Next Steps
- [ ] **Design Phase** — Architecture, technology decisions, system design document
  - Choose JS framework
  - Choose data layer approach
  - Choose SSR strategy
  - Choose state management
  - Design the component composition system (TS equivalent of PHP traits)
  - Design the schema engine
  - Design the closure/callback evaluation system
  - Produce Architecture Design Document (ADD)
- [ ] **Implementation Phase** — Build packages bottom-up
- [ ] **Testing Phase** — Comprehensive test suite
- [ ] **Documentation Phase** — API docs, guides, examples

### Key Decisions Made
- **Vision:** Spiritual successor to Filament for the JS/TS ecosystem (not a 1:1 port)
- **License:** Open source
- **Target Users:** Developers in general (same as Filament)
- **Browser Support:** Modern browsers only
- **SSR:** Required
- **Offline:** Works when full-stack app runs locally (no frontend-only offline)
- **Plugin System:** Critical but not day-one
- **No MVP approach:** Full feature parity with Filament is the goal

### Project Documents
- `CLAUDE.md` — Project context and status (this file)
- `SRS.md` — Software Requirements Specification
