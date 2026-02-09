# Milestone 2: Technology Stack Research & Selection

> **Status**: Research Complete
> **Version**: 1.0.0
> **Date**: 2025-02-10
> **Next Phase**: Milestone 3 - Architecture Design

---

## Executive Summary

This document captures comprehensive research across all major technology categories for Filament TypeScript. Each section presents objective comparisons, trade-offs, and key considerations. **Final technology selections will be made in Milestone 3: Architecture Design.**

---

## 1. Frontend Framework Research

### Candidates Evaluated

| Framework | Ecosystem Maturity | Bundle Size | Performance | TypeScript Support |
|-----------|-------------------|-------------|-------------|-------------------|
| Vue 3 | Mature (15+ years) | ~34 KB runtime | Excellent | Excellent |
| Svelte 5 | Growing (5+ years) | ~2-3 KB (compiles away) | Excellent | Excellent (v5) |
| React 19 | Dominant | ~45 KB runtime | Good | Excellent |
| SolidJS | Growing | ~12 KB runtime | Best | Excellent |

### 1.1 Vue 3

**Strengths:**
- Composition API provides excellent abstraction patterns for framework-building
- Explicit reactivity (`ref()`, `computed()`, `watch()`) - easier to debug in complex scenarios
- Single File Components (.vue) - co-located template, script, style
- Proven track record for building UI libraries (Vuetify, Element Plus, PrimeVue, Naive UI)
- Template syntax familiar to Laravel/Blade developers
- Nuxt 3 provides mature SSR/meta-framework
- Built-in transitions, teleport, suspense
- `provide/inject` pattern ideal for theming/config injection

**Weaknesses:**
- Larger runtime bundle compared to Svelte
- More boilerplate than Svelte
- Explicit reactivity requires more mental model than Svelte's runes

**Framework-Building Considerations:**
- Multiple successful component libraries prove the patterns work
- Composition API is ideal for building reusable logic abstractions
- Directive system allows framework-level extensions
- Teleport/Portal built-in (critical for modals, dropdowns)

### 1.2 Svelte 5

**Strengths:**
- Zero runtime overhead - compiles to vanilla JavaScript
- Smallest production bundles (2-3 KB vs 34 KB for Vue)
- Runes system (`$state`, `$derived`, `$effect`) - simple, intuitive reactivity
- Built-in stores - no external state management needed for basic cases
- Less boilerplate than Vue/React
- Compile-time optimizations - better performance with less developer effort
- SvelteKit provides mature SSR/meta-framework

**Weaknesses:**
- Younger ecosystem for framework-building
- Fewer proven headless UI libraries to reference
- Smaller talent pool for contributors
- Less documentation on building large-scale frameworks

**Framework-Building Considerations:**
- Growing ecosystem (Shadcn-svelte, Skeleton UI as references)
- Simpler mental model may benefit framework adoption
- Compile-time approach enables unique optimizations

### 1.3 React 19

**Strengths:**
- Largest ecosystem (~50,000+ npm packages)
- TanStack Table - gold standard for data tables (10,000+ rows)
- Largest hiring pool for contributors
- React Server Components enable server-driven UI optimizations
- Most enterprise adoption
- Extensive tooling and debugging ecosystem

**Weaknesses:**
- Largest runtime bundle
- Virtual DOM overhead
- Hooks complexity (mental model burden)
- More boilerplate than Vue/Svelte

**Framework-Building Considerations:**
- Chakra UI, Radix UI, Shadcn/ui as reference implementations
- React Server Components align with SDUI architecture
- Largest pool of developers to draw from

### 1.4 SolidJS

**Strengths:**
- Fastest runtime performance (fine-grained reactivity)
- Smallest runtime bundle (~12 KB)
- React-like JSX syntax (familiar to many)
- No virtual DOM overhead

**Weaknesses:**
- Smallest ecosystem (~2,000 packages)
- Fewer reference implementations for framework-building
- Smaller community

**Framework-Building Considerations:**
- SolidUI, Hope UI as emerging references
- Fine-grained reactivity ideal for complex form/table state

### 1.5 Laravel Refugee Perspective

| Feature | Laravel/Blade | Vue 3 | Svelte 5 | React |
|---------|---------------|-------|----------|-------|
| Template Syntax | `{{ $var }}` | `{{ var }}` | `{ var }` | `{var}` |
| Event Handlers | `@click` | `@click` | `onclick` | `onClick` |
| Conditionals | `@if`, `@else` | `v-if`, `v-else` | `{#if}` | `{&&}`, ternary |
| Loops | `@foreach` | `v-for` | `{#each}` | `.map()` |
| Directives | `@click`, `@submit` | `@click`, `@submit` | `on:click` | `onClick`, `onSubmit` |

**Vue 3 has the closest mental model to Laravel Blade.**

### 1.6 Frontend Framework Decision Matrix

| Criterion | Vue 3 | Svelte 5 | React 19 | SolidJS |
|-----------|-------|----------|----------|---------|
| Laravel DX Alignment | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Framework-Building Proof | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Bundle Size | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ecosystem Size | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| TypeScript Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Talent Pool | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 2. Build System Research

### Candidates Evaluated

| Build System | Dev Server Start | HMR Speed | Library Mode | Ecosystem |
|--------------|------------------|-----------|--------------|-----------|
| Vite | <1s | ~50ms | Excellent | Largest |
| Turbopack | <0.5s | <10ms | Experimental | Growing |
| esbuild | N/A | N/A | Basic | Medium |
| Rollup | N/A | Slow | Excellent | Largest |

### 2.1 Vite

**Strengths:**
- Proven at scale (used by Shopify, Adobe, etc.)
- Excellent library mode with proper tree-shaking
- Rich plugin ecosystem
- Native TypeScript support via plugins
- Best-in-class HMR for development
- Monorepo-native with workspace support

**Weaknesses:**
- Slower than Turbopack for very large applications
- Plugin ecosystem can be fragmented

### 2.2 Turbopack

**Strengths:**
- Fastest HMR (<10ms)
- Built by Next.js team
- Rust-based performance

**Weaknesses:**
- Library mode still experimental
- Tightly coupled to Next.js optimizations
- Smaller plugin ecosystem
- Rapidly changing API

### 2.3 tsup (for Library Packages)

**Strengths:**
- Zero-config esbuild wrapper
- Dual format output (ESM + CJS)
- TypeScript declaration generation
- Fast compilation
- Proper tree-shaking marks

**Weaknesses:**
- Less flexible than pure Rollup
- Fewer optimization options

### 2.4 Build System Recommendation Summary

| Use Case | Recommended Tool |
|----------|------------------|
| Demo/Docs Apps | Vite |
| Library Packages | tsup |
| Very Large Scale (future) | Consider Turbopack when mature |

---

## 3. Monorepo Tool Research

### Candidates Evaluated

| Tool | Disk Efficiency | Install Speed | Caching | Learning Curve |
|------|-----------------|---------------|---------|----------------|
| pnpm workspaces | Best (hard links) | Fastest | Via plugin | Low |
| npm workspaces | Poor | Slow | No | Lowest |
| Yarn Berry | Good | Fast | Via plugin | Medium |
| Turborepo | N/A* | N/A* | Excellent | Medium |
| Nx | N/A* | N/A* | Excellent | High |

* Turborepo and Nx are task orchestration tools that work WITH any package manager

### 3.1 pnpm Workspaces

**Strengths:**
- 50% disk space savings via hard links/symlinks
- Strict dependency isolation (no phantom dependencies)
- Fastest installation speeds
- `workspace:` protocol for internal dependencies
- Monorepo-first design

**Weaknesses:**
- Requires Node.js link support (works on all major platforms)
- Slight learning curve for workspace protocol

### 3.2 Turborepo

**Strengths:**
- Intelligent caching (remote cache available)
- Parallel execution of independent tasks
- Impact analysis (knows what changed)
- CI/CD optimization (can reduce build time 80%+)
- Lightweight compared to Nx
- Vercel-backed but framework agnostic

**Weaknesses:**
- Newer than Nx (fewer enterprise features)
- Remote caching requires paid tier for teams

### 3.3 Nx

**Strengths:**
- Most feature-rich
- Excellent for very large monorepos (100+ packages)
- Built-in generators
- Strong Visual Studio Code integration

**Weaknesses:**
- Higher learning curve
- Heavier setup for smaller projects
- More opinionated

### 3.4 Monorepo Recommendation Summary

| Project Scale | Recommended Stack |
|---------------|-------------------|
| Current (15-20 packages) | pnpm + Turborepo |
| Future (50+ packages) | pnpm + Nx (if needed) |
| Version Management | Changesets |

---

## 4. Runtime Target Research

### Candidates Evaluated

| Runtime | Production Maturity | Ecosystem Compatibility | Performance | Adoption |
|---------|---------------------|------------------------|-------------|----------|
| Node.js | Excellent | 100% | Baseline | Dominant |
| Bun | Experimental | ~95% | 2-4x faster | Growing |
| Deno | Good | ~90% | 1.5-2x faster | Niche |

### 4.1 Node.js

**Strengths:**
- Battle-tested production maturity
- 100% npm package compatibility
- Largest talent pool
- Universal CI/CD support
- Enterprise standard

**Weaknesses:**
- Slower than newer runtimes
- Requires transpilation for TypeScript

### 4.2 Bun

**Strengths:**
- Native TypeScript execution
- All-in-one (runtime, bundler, test runner, package manager)
- 2-4x faster performance
- Drop-in Node.js API compatibility

**Weaknesses:**
- Production stability concerns
- Rapid breaking changes
- Smaller community
- Less enterprise adoption

### 4.3 Deno

**Strengths:**
- Native TypeScript
- Security-first design
- Standard library included
- Good web standards alignment

**Weaknesses:**
- Niche adoption
- Compatibility layer needed for npm
- Smaller ecosystem

### 4.4 Runtime Recommendation Summary

| Use Case | Recommended Runtime |
|----------|---------------------|
| Primary Production Target | Node.js 22+ LTS |
| Development (optional) | Bun (for faster iteration) |
| Future Consideration | Bun when production-mature |

---

## 5. Backend Framework Research

### Candidates Evaluated

| Framework | TypeScript | Laravel Similarity | Performance | Ecosystem | Auth/ORM Built-in |
|-----------|------------|--------------------|-------------|-----------|-------------------|
| AdonisJS | First-class | **Highest** | Good | Medium | **Yes** |
| NestJS | First-class | Low | Good | Largest | No |
| Hono | First-class | Medium | **Best** | Growing | No |
| Fastify | Good | Low | Very Good | Large | No |
| Express | Basic | Low | Baseline | Largest | No |

### 5.1 AdonisJS

**Strengths:**
- **"Laravel of Node.js"** - highest similarity for Laravel refugees
- Service Providers, Facades, IoC Container (familiar patterns)
- Lucid ORM built-in (Eloquent-like)
- Built-in authentication system
- Built-in validation
- Built-in migrations and seeders
- Ace CLI (Artisan-like)
- All-in-one solution
- TypeScript-first design

**Weaknesses:**
- Smaller ecosystem than NestJS
- Single primary maintainer
- Less enterprise adoption
- Fewer third-party integrations

**Laravel Parallels:**

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

### 5.2 NestJS

**Strengths:**
- Largest ecosystem and adoption
- Excellent TypeScript support (decorators)
- Dependency injection built-in
- Module system for organization
- Guards, Interceptors, Pipes
- Official Prisma integration
- Enterprise-grade patterns
- 65k+ GitHub stars, 1.2M+ weekly downloads

**Weaknesses:**
- Higher learning curve
- More boilerplate
- Less familiar to Laravel developers
- Requires picking ORM, auth, validation separately

### 5.3 Hono

**Strengths:**
- Best performance (especially for edge/serverless)
- Multi-runtime support (Cloudflare Workers, Deno, Bun, Node)
- Excellent TypeScript inference
- Lightweight and simple
- Fast growing adoption

**Weaknesses:**
- No built-in ORM, auth, validation
- Less opinionated (more to build)
- Smaller ecosystem
- Not enterprise-focused

### 5.4 Backend Framework Decision Matrix

| Criterion | AdonisJS | NestJS | Hono |
|-----------|----------|--------|------|
| Laravel DX Alignment | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| TypeScript Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ecosystem Size | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| All-in-One | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| Enterprise Adoption | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Framework-Building | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 6. ORM Research

### Candidates Evaluated

| ORM | Type Safety | Edge Compatible | Migration Tooling | Ecosystem | Learning Curve |
|-----|-------------|-----------------|-------------------|-----------|----------------|
| Drizzle | Excellent | **Yes** | Excellent | Growing (2025 momentum) | Low-Medium |
| Prisma | Industry Standard | Limited | Excellent | Largest | Low |
| TypeORM | Good | No | Good | Mature | Medium |
| MikroORM | Excellent | No | Good | Medium | High |
| Lucid (Adonis) | Good | No | Built-in | Small | Low |

### 6.1 Drizzle ORM

**Strengths:**
- 2025 momentum - teams migrating from Prisma to Drizzle
- SQL-transparent (type-safe without hiding SQL)
- Edge-native (Cloudflare Workers compatible)
- Smaller bundle sizes
- Relational API (v2) mirrors Prisma patterns
- Excellent TypeScript inference
- Modern, cloud-native workflows

**Weaknesses:**
- Slightly more verbose than Prisma
- Newer ecosystem (growing rapidly)
- Less automation than Prisma

### 6.2 Prisma

**Strengths:**
- Industry standard for type safety
- Excellent developer experience
- Best-in-class migration system
- Superior complex query handling
- Official NestJS integration
- Largest community

**Weaknesses:**
- Not ideal for edge/serverless
- More abstraction overhead
- Larger bundle size

### 6.3 Lucid ORM (AdonisJS)

**Strengths:**
- Built into AdonisJS
- Eloquent-like API (familiar to Laravel developers)
- Good type safety
- Migration system included

**Weaknesses:**
- Tied to AdonisJS ecosystem
- Smaller community

### 6.4 ORM Recommendation Summary

| Use Case | Recommended ORM |
|----------|-----------------|
| AdonisJS Projects | Lucid (built-in) |
| Standalone/NestJS | Drizzle (primary), Prisma (alternative) |
| Edge Deployments | Drizzle |

---

## 7. Testing Framework Research

### Candidates Evaluated

| Framework | TypeScript Support | Speed | ESM Support | Ecosystem |
|-----------|-------------------|-------|-------------|-----------|
| Vitest | Native | 10-20x faster than Jest | Native | Growing Fast |
| Jest | Via ts-jest | Baseline | Via config | Largest |
| uvu | Via compilation | Fastest | Native | Minimal |

### 7.1 Vitest

**Strengths:**
- Native TypeScript support (no configuration)
- Jest-compatible API (drop-in migration)
- 10-20x faster in watch mode
- Built-in watch mode UI
- HMR-powered (only re-runs affected tests)
- Shared Vite config
- Better stack traces
- Native ESM support

**Weaknesses:**
- Younger than Jest
- Some plugins still maturing

### 7.2 E2E Testing: Playwright vs Cypress

| Criterion | Playwright | Cypress |
|-----------|------------|---------|
| Cross-Browser | Chromium, Firefox, WebKit | Chromium (free tier) |
| Speed | Faster (runs outside browser) | Slower (in-browser) |
| TypeScript | First-class | Good |
| Parallel Execution | Built-in | Paid tier |
| Visual Regression | Built-in | Via plugins |
| Code Generation | Excellent | Good |

### 7.3 Testing Recommendation Summary

| Test Type | Recommended Tool |
|-----------|------------------|
| Unit Tests | Vitest |
| Component Tests | @testing-library (Vue/React/Svelte variants) |
| E2E Tests | Playwright |
| Visual Regression | Playwright screenshot comparison |

---

## 8. Styling Solution Research

### Candidates Evaluated

| Solution | Bundle Impact | Performance | DX | Theming |
|----------|---------------|-------------|----|---------|
| Tailwind CSS v4 | ~3KB CSS | Excellent (JIT) | High | Excellent |
| CSS Modules | Variable | Good | Medium | Manual |
| CSS-in-JS | 13-20KB JS runtime | Runtime overhead | High | Good |
| Scoped CSS | Small | Good | Low | Manual |

### 8.1 Tailwind CSS v4

**Strengths:**
- Matches Filament PHP (consistency)
- JIT compiler - always on, instant
- ~3KB final CSS output
- Semantic `.fi-*` classes built on Tailwind
- Excellent theming via CSS variables
- Arbitrary values support (critical for SDUI)
- Largest ecosystem

**Weaknesses:**
- Requires build step
- Initial learning curve

### 8.2 Styling Recommendation Summary

**Tailwind CSS v4 is the clear choice** for Filament TypeScript due to:
1. Consistency with Filament PHP
2. Smallest production CSS output
3. Excellent theming capabilities
4. JIT enables server-driven dynamic styles

---

## 9. State Management Research

### Context: Server-Driven UI Implications

In SDUI architecture:
- UI structure comes from server (JSON schema)
- State is primarily server-derived
- Client is primarily a "dumb renderer"

### Candidates Evaluated

| Solution | Bundle Size | Best For | Async Handling |
|----------|-------------|----------|----------------|
| TanStack Query | ~13KB | Server state | Excellent |
| Pinia (Vue) | ~2KB | Client state | Basic |
| Zustand | ~1KB | Client state | Basic |
| Preact Signals | ~1.5KB | Fine-grained reactivity | N/A |

### 9.1 Hybrid State Architecture

**Server State (TanStack Query):**
- API data fetching and caching
- Form submissions (mutations)
- Table data (list records)
- Resource CRUD operations
- Handles loading/error states automatically

**Client State (Pinia/Zustand):**
- UI state (modal open/close, panel collapse)
- Temporary form state
- Notification queue
- Table UI state (column visibility)

**Fine-Grained Reactivity (Signals/computed):**
- High-frequency updates (form field changes)
- Table filtering/sorting state
- Real-time validation feedback

### 9.2 State Management Recommendation Summary

| Layer | Vue 3 Stack | React Stack | Svelte Stack |
|-------|-------------|-------------|--------------|
| Server State | TanStack Query | TanStack Query | TanStack Query |
| Client State | Pinia | Zustand | Built-in stores |
| Fine-Grained | Computed | Signals | Reactive ($derived) |

---

## 10. Package Publishing Research

### Candidates Evaluated

| Tool | Monorepo Support | Changelog | Independent Versions |
|------|------------------|-----------|----------------------|
| Changesets | ✅ Native | ✅ Auto | ✅ Yes |
| Lerna | ✅ Yes | ✅ Yes | ✅ Yes |
| Release-it | ⚠️ Plugin | ✅ Yes | ❌ No |

### 10.1 Changesets

**Strengths:**
- Designed specifically for monorepos
- Semantic versioning based on change types
- Automatic CHANGELOG.md generation
- GitHub Actions integration
- Independent package versions
- Flexible publishing (publish only changed packages)

**Weaknesses:**
- Manual changelog entry (can be automated)

---

## 11. Summary Matrix

### 11.1 Technology Options by Category

| Category | Option A | Option B | Option C |
|----------|---------|----------|----------|
| **Frontend** | Vue 3 | Svelte 5 | React 19 |
| **Build System** | Vite + tsup | Turbopack | esbuild |
| **Monorepo** | pnpm + Turborepo | pnpm + Nx | Yarn Berry |
| **Runtime** | Node.js | Bun | Deno |
| **Backend** | AdonisJS | NestJS | Hono |
| **ORM** | Drizzle | Prisma | Lucid/TypeORM |
| **Testing** | Vitest + Playwright | Jest + Cypress | - |
| **Styling** | Tailwind v4 | - | - |
| **State** | TQ + Pinia + Signals | TQ + Zustand + Signals | TQ + Stores + Runes |
| **Publishing** | Changesets | Lerna | - |

### 11.2 Decision Criteria Summary

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Laravel Refugee DX | **High** | Target audience alignment |
| Framework-Building Proof | **High** | Proven patterns matter |
| Bundle Size | Medium | Library, not app |
| Performance | Medium | Backend pagination mitigates |
| Ecosystem Size | Medium | Larger = more options |
| Talent Pool | Medium | Contributor availability |
| TypeScript Support | **High** | Core project requirement |

---

## 12. Open Questions for Milestone 3

The following decisions will be made in Milestone 3: Architecture Design:

1. **Frontend Framework Selection**
   - Vue 3 vs Svelte 5 vs React 19
   - Framework-building capability vs ecosystem size trade-off

2. **Backend Framework Selection**
   - AdonisJS (Laravel-like DX) vs NestJS (enterprise scale)
   - Adapter interface design

3. **ORM Strategy**
   - Single ORM vs Adapter pattern
   - Edge deployment requirements

4. **Adapter Architecture**
   - Where do adapter boundaries exist?
   - Frontend adapters? Backend adapters? Both?

5. **SDUI Protocol**
   - JSON schema design
   - Type sharing between server and client

6. **Package Boundaries**
   - How many packages?
   - What depends on what?

---

## 13. Research Sources

### Framework Comparisons
- js-framework-benchmark (Stefan Krause)
- State of JS 2024
- FrontendTools.tech framework comparisons

### Backend Research
- AdonisJS documentation
- NestJS documentation and recipes
- Hono benchmarks and documentation

### ORM Research
- Drizzle vs Prisma comparisons (2025)
- TypeORM and MikroORM documentation

### Build Tool Research
- Vite documentation and ecosystem
- Turbopack vs Vite comparisons
- pnpm vs npm vs Yarn comparisons

---

## Document Status

- [x] Frontend Framework Research
- [x] Build System Research
- [x] Monorepo Tool Research
- [x] Runtime Target Research
- [x] Backend Framework Research
- [x] ORM Research
- [x] Testing Framework Research
- [x] Styling Solution Research
- [x] State Management Research
- [x] Package Publishing Research

**Next Phase:** Milestone 3 - Architecture Design (Technology selections and architecture decisions)
