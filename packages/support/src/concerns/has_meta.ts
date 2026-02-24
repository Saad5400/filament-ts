import type { Constructor } from '../types.js'

function normalizeKeys(keys: string | string[]): string[] {
  return Array.isArray(keys) ? keys : [keys]
}

function getFromPath(source: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.')
  let current: unknown = source

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined
    }

    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

function setToPath(source: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.')
  const last = segments.pop()

  if (!last) {
    return
  }

  let current = source

  for (const segment of segments) {
    const next = current[segment]
    if (typeof next !== 'object' || next === null) {
      current[segment] = {}
    }

    current = current[segment] as Record<string, unknown>
  }

  current[last] = value
}

export function HasMeta<TBase extends Constructor>(Base: TBase) {
  return class HasMetaMixin extends Base {
    public metaValue: Record<string, unknown> = {}

    meta(key: string, value: unknown): this {
      setToPath(this.metaValue, key, value)

      return this
    }

    getMeta(keys?: string | string[]): unknown {
      if (!keys) {
        return {
          ...this.metaValue,
        }
      }

      if (Array.isArray(keys)) {
        return keys.reduce<Record<string, unknown>>((result, key) => {
          const value = getFromPath(this.metaValue, key)
          if (value !== undefined) {
            result[key] = value
          }

          return result
        }, {})
      }

      return getFromPath(this.metaValue, keys)
    }

    hasMeta(keys: string | string[]): boolean {
      return normalizeKeys(keys).every((key) => getFromPath(this.metaValue, key) !== undefined)
    }
  }
}
