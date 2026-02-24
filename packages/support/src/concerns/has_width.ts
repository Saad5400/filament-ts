import { Width } from '../enums/width.js'
import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

function resolveWidth(value: number | string | Width | null): string | Width | null {
  if (value === null) {
    return null
  }

  if (typeof value === 'number') {
    return `${value}px`
  }

  if (Object.values(Width).includes(value as Width)) {
    return value as Width
  }

  return value
}

export function HasWidth<TBase extends Constructor>(Base: TBase) {
  return class HasWidthMixin extends Base {
    public widthValue: Resolvable<number | string | Width | null> | null = null

    width(width: Resolvable<number | string | Width | null>): this {
      this.widthValue = width

      return this
    }

    getWidth(context: ResolveContextLike = {}): string | Width | null {
      if (this.widthValue === null) {
        return null
      }

      return resolveWidth(evaluateValue(this, this.widthValue, context))
    }
  }
}
