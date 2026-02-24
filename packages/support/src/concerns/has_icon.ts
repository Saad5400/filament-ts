import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasIcon<TBase extends Constructor>(Base: TBase) {
  return class HasIconMixin extends Base {
    public iconValue: Resolvable<string | false | null> | null = null

    icon(icon: Resolvable<string | null>): this {
      this.iconValue = icon

      return this
    }

    getIcon(defaultIcon: string | null = null, context: ResolveContextLike = {}): string | null {
      if (this.iconValue === null) {
        return defaultIcon
      }

      const icon = evaluateValue(this, this.iconValue, context)
      if (icon === false) {
        return null
      }

      return icon ?? defaultIcon
    }
  }
}
