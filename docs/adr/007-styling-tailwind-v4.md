# ADR-007: Styling - Tailwind CSS v4

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Decision

**Tailwind CSS v4** with custom `.fi-*` semantic classes.

## Alternatives Considered

### CSS Modules
**Why not chosen**:
- Requires manual class management
- No utility-first productivity
- Harder to implement dynamic server-driven styles

### CSS-in-JS
**Why not chosen**:
- 13-20KB JS runtime overhead
- Runtime performance cost
- More complex theming

## Rationale

### Tailwind CSS v4
- Matches Filament PHP (consistency across ecosystems)
- JIT compiler - always on, instant
- ~3KB final CSS output
- Excellent theming via CSS variables
- Arbitrary values support (critical for SDUI)
- Largest ecosystem
- Built-in responsive design
- Dark mode support

### Semantic Classes

Building on Filament PHP's pattern, we'll provide semantic `.fi-*` classes:

```css
/* Semantic classes built on Tailwind */
.fi-btn { @apply px-4 py-2 rounded font-medium transition-colors; }
.fi-btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
.fi-input { @apply w-full px-3 py-2 border rounded; }
.fi-modal-overlay { @apply fixed inset-0 bg-black/50 backdrop-blur-sm; }
```

### Server-Driven Styles

Tailwind's JIT compiler enables dynamic style generation from server config:

```json
// Server sends style config
{
  "type": "text-field",
  "props": {
    "classes": "w-full max-w-md px-4 py-2 border-blue-500 rounded-lg"
  }
}
```

## Consequences

### Positive
- Consistency with Filament PHP
- Smallest production CSS output
- Excellent theming capabilities
- JIT enables server-driven dynamic styles

### Negative
- Requires build step
- Initial learning curve (mitigated by semantic classes)

## References

- Tailwind CSS Documentation: https://tailwindcss.com
