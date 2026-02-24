import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasHint<TBase extends Constructor>(Base: TBase) {
  return class HasHintMixin extends Base {
    public hintValue: Resolvable<string | null> | null = null

    hint(hint: Resolvable<string | null>): this {
      this.hintValue = hint

      return this
    }

    hasHint(): boolean {
      return this.hintValue !== null
    }

    getHint(context: ResolveContextLike = {}): string | null {
      if (this.hintValue === null) {
        return null
      }

      return evaluateValue(this, this.hintValue, context)
    }
  }
}
