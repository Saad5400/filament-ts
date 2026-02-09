# ADR-006: Testing - Vitest + Playwright

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Decision

**Vitest** for unit/component tests and **Playwright** for E2E tests.

## Alternatives Considered

### Jest
**Why not chosen**:
- Requires ts-jest for TypeScript (extra config)
- Slower than Vitest in watch mode
- No native ESM support

### Cypress
**Why not chosen**:
- Slower (runs in-browser)
- Cross-browser testing requires paid tier
- Playwright has better TypeScript support

## Rationale

### Vitest
- Native TypeScript support (no configuration)
- Jest-compatible API (drop-in migration)
- 10-20x faster in watch mode
- Built-in watch mode UI
- HMR-powered (only re-runs affected tests)
- Shared Vite config
- Better stack traces
- Native ESM support

### Playwright
- Cross-browser: Chromium, Firefox, WebKit (all free)
- Faster than Cypress (runs outside browser)
- First-class TypeScript support
- Built-in parallel execution
- Built-in visual regression
- Excellent code generation

## Test Structure

```
packages/
  forms/
    src/
    __tests__/
      unit/
        text-field.test.ts
      component/
        form-renderer.test.ts
apps/
  demo/
    e2e/
      user-crud.spec.ts
```

## Consequences

### Positive
- Fast test execution
- Excellent TypeScript experience
- Modern tooling with active development

### Negative
- Younger than Jest (but mature enough)
- Cypress has larger community (but Playwright growing faster)

## References

- Vitest Documentation: https://vitest.dev
- Playwright Documentation: https://playwright.dev
