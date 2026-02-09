# ADR-008: State Management - Hybrid Approach

**Status**: Accepted
**Date**: 2025-02-10
**Context**: Milestone 3 - Architecture Design

## Decision

**Hybrid state architecture**:
- **TanStack Query** for server state
- **Pinia** for client UI state
- **Vue Computed** for fine-grained reactivity

## Context

In Server-Driven UI architecture, state flows differently than traditional SPAs:
- UI structure comes from server (JSON schema)
- Most data is server-derived
- Client is primarily a "dumb renderer"

## Rationale

### TanStack Query (Server State)
- API data fetching and caching
- Form submissions (mutations)
- Table data (list records)
- Resource CRUD operations
- Handles loading/error states automatically

### Pinia (Client UI State)
- UI state (modal open/close, panel collapse)
- Table UI state (column visibility, selected rows)
- Notification queue
- Panel configuration
- User preferences

### Vue Computed (Fine-Grained Reactivity)
- High-frequency updates (form field changes)
- Table filtering/sorting state
- Real-time validation feedback
- Derived values from other state

## State Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        STATE LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SERVER STATE (TanStack Query)                          │   │
│  │  - API data fetching & caching                          │   │
│  │  - Form submissions (mutations)                         │   │
│  │  - Table data (list records)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼───────────────────────────────┐   │
│  │  CLIENT STATE (Pinia Stores)                           │   │
│  │  - UI state (modal open/close)                         │   │
│  │  - Table UI state (column visibility)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼───────────────────────────────┐   │
│  │  FINE-GRAINED REACTIVITY (Vue Computed/Ref)            │   │
│  │  - Form field changes                                  │   │
│  │  - Real-time validation feedback                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Example Usage

```typescript
// Server state with TanStack Query
function useTableData(statePath: string, params: Ref<TableParams>) {
  return useQuery({
    queryKey: ['table', statePath, params],
    queryFn: () => api.get(`/api/filament/schema/${statePath}`, params),
    staleTime: 5000,
  })
}

// Client state with Pinia
export const useUIStore = defineStore('ui', () => {
  const modals = ref<Map<string, boolean>>(new Map())

  function openModal(id: string) {
    modals.value.set(id, true)
  }

  return { modals, openModal }
})

// Fine-grained with computed
const isValid = computed(() => {
  return form.value.name.length >= 3 && /^\S+@\S+\.\S+$/.test(form.value.email)
})
```

## Consequences

### Positive
- Clear separation of concerns
- TanStack Query handles complex server state automatically
- Pinia provides simple, typed stores for UI state
- Vue's reactivity system is excellent for fine-grained updates

### Negative
- Three different systems to learn
- More boilerplate than a single-state solution

## References

- TanStack Query: https://tanstack.com/query/latest
- Pinia: https://pinia.vuejs.org
