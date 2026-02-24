import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasTooltip<TBase extends Constructor>(Base: TBase) {
  return class HasTooltipMixin extends Base {
    public tooltipValue: Resolvable<string | null> | null = null

    tooltip(tooltip: Resolvable<string | null>): this {
      this.tooltipValue = tooltip

      return this
    }

    getTooltip(context: ResolveContextLike = {}): string | null {
      if (this.tooltipValue === null) {
        return null
      }

      return evaluateValue(this, this.tooltipValue, context)
    }
  }
}
