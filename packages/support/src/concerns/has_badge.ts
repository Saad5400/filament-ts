import { evaluateValue } from '../mixins/helpers.js'
import type { ColorInput } from '../color/types.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasBadge<TBase extends Constructor>(Base: TBase) {
  return class HasBadgeMixin extends Base {
    public badgeValue: Resolvable<string | number | null> | null = null
    public badgeColorValue: Resolvable<ColorInput | null> | null = null

    badge(badge: Resolvable<string | number | null>): this {
      this.badgeValue = badge

      return this
    }

    badgeColor(color: Resolvable<ColorInput | null>): this {
      this.badgeColorValue = color

      return this
    }

    getBadge(context: ResolveContextLike = {}): string | number | null {
      if (this.badgeValue === null) {
        return null
      }

      return evaluateValue(this, this.badgeValue, context)
    }

    getBadgeColor(context: ResolveContextLike = {}): ColorInput | null {
      if (this.badgeColorValue === null) {
        return null
      }

      return evaluateValue(this, this.badgeColorValue, context)
    }
  }
}
