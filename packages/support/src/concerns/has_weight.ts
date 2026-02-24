import { FontWeight } from '../enums/font_weight.js'
import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

function resolveWeight(value: string | FontWeight | null): string | FontWeight | null {
  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    return value
  }

  return Object.values(FontWeight).includes(value as FontWeight) ? (value as FontWeight) : value
}

export function HasWeight<TBase extends Constructor>(Base: TBase) {
  return class HasWeightMixin extends Base {
    public weightValue: Resolvable<string | FontWeight | null> | null = null

    weight(weight: Resolvable<string | FontWeight | null>): this {
      this.weightValue = weight

      return this
    }

    getWeight(context: ResolveContextLike = {}): string | FontWeight | null {
      if (this.weightValue === null) {
        return null
      }

      return resolveWeight(evaluateValue(this, this.weightValue, context))
    }
  }
}
