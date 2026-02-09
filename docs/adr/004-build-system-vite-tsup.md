# ADR-004: Build System - Vite + tsup

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Context

Filament TypeScript needs a build system that:
- Builds library packages (dual ESM/CJS output)
- Supports fast development with HMR
- Integrates with the monorepo setup
- Handles TypeScript compilation

## Decision

**Vite** for demo/docs/apps and **tsup** for library packages.

## Alternatives Considered

### Turbopack
**Strengths**:
- Fastest HMR (<10ms)
- Rust-based performance

**Why not chosen**:
- Library mode still experimental
- Tightly coupled to Next.js optimizations
- Rapidly changing API

### esbuild
**Strengths**:
- Fast compilation
- Used by tsup under the hood

**Why not chosen**:
- Less flexible for app development
- Vite provides better DX on top of esbuild

## Rationale

### Vite (for Apps)
- Proven at scale (Shopify, Adobe, etc.)
- Excellent library mode with proper tree-shaking
- Rich plugin ecosystem
- Native TypeScript support via plugins
- Best-in-class HMR for development
- Monorepo-native with workspace support

### tsup (for Libraries)
- Zero-config esbuild wrapper
- Dual format output (ESM + CJS)
- TypeScript declaration generation
- Fast compilation
- Proper tree-shaking marks

## Usage

```typescript
// vite.config.ts (for demo/docs)
export default defineConfig({
  // Vite configuration for app development
})

// tsup.config.ts (for packages)
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})
```

## Consequences

### Positive
- Fast development iteration with Vite HMR
- Proper library builds with tsup
- Industry-standard tools with large communities

### Negative
- Two different build systems to learn and maintain

## References

- Vite Documentation: https://vitejs.dev
- tsup Documentation: https://tsup.egoist.dev
