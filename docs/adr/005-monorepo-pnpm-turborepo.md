# ADR-005: Monorepo - pnpm + Turborepo

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Decision

**pnpm** for package management and **Turborepo** for task orchestration.

## Alternatives Considered

### npm workspaces
**Why not chosen**:
- Poor disk efficiency (no hard links)
- Slow installation speeds
- No built-in caching

### Yarn Berry
**Why not chosen**:
- pnpm has better disk efficiency
- Slightly higher learning curve

### Nx
**Why not chosen**:
- Higher learning curve
- Heavier setup for our scale (15-20 packages)
- Can migrate later if needed

## Rationale

### pnpm
- 50% disk space savings via hard links/symlinks
- Strict dependency isolation (no phantom dependencies)
- Fastest installation speeds
- `workspace:` protocol for internal dependencies
- Monorepo-first design

### Turborepo
- Intelligent caching (remote cache available)
- Parallel execution of independent tasks
- Impact analysis (knows what changed)
- CI/CD optimization (can reduce build time 80%+)
- Lightweight compared to Nx
- Vercel-backed but framework agnostic

## Workspace Configuration

```json
// pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'examples/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

## Version Management

**Changesets** for version management:
- Semantic versioning based on change types
- Automatic CHANGELOG.md generation
- GitHub Actions integration
- Independent package versions

## Consequences

### Positive
- Fast install and build times
- Proper dependency isolation
- CI/CD optimization with caching

### Negative
- pnpm requires Node.js link support (works on all major platforms)
- Two tools to learn (pnpm + Turborepo)

## References

- pnpm Documentation: https://pnpm.io
- Turborepo Documentation: https://turbo.build/repo
- Changesets Documentation: https://github.com/changesets/changesets
