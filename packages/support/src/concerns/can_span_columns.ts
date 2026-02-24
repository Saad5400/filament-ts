import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export type ColumnSpanValue = number | string | null
export type ColumnSpanMap = Record<string, ColumnSpanValue>
export type ColumnSpanInput =
  | ColumnSpanMap
  | ColumnSpanValue
  | Resolvable<ColumnSpanMap | ColumnSpanValue>

const DEFAULT_BREAKPOINTS: ColumnSpanMap = {
  default: 1,
  sm: null,
  md: null,
  lg: null,
  xl: null,
  '2xl': null,
}

const DEFAULT_START_BREAKPOINTS: ColumnSpanMap = {
  default: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,
  '2xl': null,
}

type StoredEntry = {
  key: string | null
  value: Resolvable<ColumnSpanMap | ColumnSpanValue>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeSpanInput(span: ColumnSpanInput): StoredEntry[] {
  if (typeof span === 'function') {
    return [{ key: null, value: span }]
  }

  if (!isPlainObject(span)) {
    return [
      { key: 'default', value: 1 },
      { key: 'lg', value: span },
    ]
  }

  return Object.entries(span).map(([key, value]) => ({ key, value }))
}

function normalizeStartInput(start: ColumnSpanInput): StoredEntry[] {
  if (typeof start === 'function') {
    return [{ key: null, value: start }]
  }

  if (!isPlainObject(start)) {
    return [{ key: 'lg', value: start }]
  }

  return Object.entries(start).map(([key, value]) => ({ key, value }))
}

function applyEntries(
  target: ColumnSpanMap,
  entries: StoredEntry[],
  evaluator: (
    value: Resolvable<ColumnSpanMap | ColumnSpanValue>,
  ) => ColumnSpanMap | ColumnSpanValue,
): ColumnSpanMap {
  const next = {
    ...target,
  }

  for (const entry of entries) {
    const resolved = evaluator(entry.value)

    if (isPlainObject(resolved)) {
      Object.assign(next, resolved)
      if (entry.key) {
        delete next[entry.key]
      }
      continue
    }

    if (!entry.key) {
      next.default = resolved
      continue
    }

    next[entry.key] = resolved
  }

  return next
}

export function CanSpanColumns<TBase extends Constructor>(Base: TBase) {
  return class CanSpanColumnsMixin extends Base {
    public columnSpanEntries: StoredEntry[] = []
    public columnStartEntries: StoredEntry[] = []

    columnSpan(span: ColumnSpanInput): this {
      this.columnSpanEntries = [...this.columnSpanEntries, ...normalizeSpanInput(span)]

      return this
    }

    columnSpanFull(): this {
      return this.columnSpan({ default: 'full' })
    }

    columnStart(start: ColumnSpanInput): this {
      this.columnStartEntries = [...this.columnStartEntries, ...normalizeStartInput(start)]

      return this
    }

    getColumnSpan(
      breakpoint?: string,
      context: ResolveContextLike = {},
    ): ColumnSpanValue | ColumnSpanMap {
      const span = applyEntries(
        {
          ...DEFAULT_BREAKPOINTS,
        },
        this.columnSpanEntries,
        (value) => evaluateValue(this, value, context),
      )

      if (!breakpoint) {
        return span
      }

      return span[breakpoint] ?? null
    }

    getColumnStart(
      breakpoint?: string,
      context: ResolveContextLike = {},
    ): ColumnSpanValue | ColumnSpanMap {
      const start = applyEntries(
        {
          ...DEFAULT_START_BREAKPOINTS,
        },
        this.columnStartEntries,
        (value) => evaluateValue(this, value, context),
      )

      if (!breakpoint) {
        return start
      }

      return start[breakpoint] ?? null
    }
  }
}
