import { evaluateValue } from '../mixins/helpers.js'
import type { ColorInput } from '../color/types.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasColor<TBase extends Constructor>(Base: TBase) {
  return class HasColorMixin extends Base {
    public colorValue: Resolvable<ColorInput | null> | null = null
    public defaultColorValue: Resolvable<ColorInput | null> | null = null

    color(color: Resolvable<ColorInput | null>): this {
      this.colorValue = color

      return this
    }

    defaultColor(color: Resolvable<ColorInput | null>): this {
      this.defaultColorValue = color

      return this
    }

    getColor(context: ResolveContextLike = {}): ColorInput | null {
      const color = this.colorValue === null ? null : evaluateValue(this, this.colorValue, context)
      if (color !== null && color !== undefined) {
        return color
      }

      if (this.defaultColorValue === null) {
        return null
      }

      return evaluateValue(this, this.defaultColorValue, context)
    }
  }
}
