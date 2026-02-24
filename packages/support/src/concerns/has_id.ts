import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasId<TBase extends Constructor>(Base: TBase) {
  return class HasIdMixin extends Base {
    public idValue: Resolvable<string | null> | null = null

    id(id: Resolvable<string | null>): this {
      this.idValue = id

      return this
    }

    getCustomId(context: ResolveContextLike = {}): string | null {
      if (this.idValue === null) {
        return null
      }

      return evaluateValue(this, this.idValue, context)
    }

    getId(fallback: string | null = null, context: ResolveContextLike = {}): string | null {
      return this.getCustomId(context) ?? fallback
    }
  }
}
