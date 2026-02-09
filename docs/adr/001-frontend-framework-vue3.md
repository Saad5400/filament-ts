# ADR-001: Frontend Framework - Vue 3

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Context

Filament TypeScript needs a frontend framework to power the client-side rendering of its Server-Driven UI. The framework must:
- Support building a UI library (framework-building)
- Have excellent TypeScript support
- Align with Laravel developer mental models
- Enable declarative, chainable APIs
- Support efficient state management for complex forms/tables

## Decision

**Vue 3 with Composition API** is selected as the frontend framework.

## Alternatives Considered

### Svelte 5
**Strengths**:
- Smallest bundle size (2-3KB vs Vue's 34KB)
- Simpler mental model with runes
- Compile-time optimizations

**Why not chosen**:
- Less proven for framework-building (fewer reference implementations)
- Smaller ecosystem and talent pool
- Less documentation on building large-scale frameworks

### React 19
**Strengths**:
- Largest ecosystem (~50,000+ npm packages)
- TanStack Table (gold standard for data tables)
- Largest hiring pool
- React Server Components align with SDUI

**Why not chosen**:
- Largest runtime bundle (45KB)
- Hooks complexity (higher mental model burden)
- Virtual DOM overhead
- Less familiar to Laravel/Blade developers

## Rationale

Vue 3 provides the best balance of:

1. **Laravel DX Alignment**: Template syntax (`{{ }}`, `@click`, `v-if`) is closest to Blade
2. **Framework-Building Proof**: Vuetify, Element Plus, PrimeVue, Naive UI prove the patterns work
3. **Composition API**: Ideal for building reusable logic abstractions
4. **TypeScript**: Excellent type inference with Composition API
5. **Built-in Features**: Teleport, Suspense, transitions (no extra libraries needed)

## Consequences

### Positive
- Laravel developers will feel at home with the syntax
- Composition API enables clean, reusable composables
- Smaller learning curve for the target audience
- Proven patterns from existing Vue component libraries

### Negative
- 34KB runtime is larger than Svelte but acceptable for admin panels
- Smaller ecosystem than React but still sufficient

## References

- Vue 3 Documentation: https://vuejs.org
- Framework Comparison: Milestone 2 Technology Research
