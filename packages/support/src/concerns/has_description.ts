import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasDescription<TBase extends Constructor>(Base: TBase) {
  return class HasDescriptionMixin extends Base {
    public descriptionValue: Resolvable<string | null> | null = null

    description(description: Resolvable<string | null> = null): this {
      this.descriptionValue = description

      return this
    }

    getDescription(context: ResolveContextLike = {}): string | null {
      if (this.descriptionValue === null) {
        return null
      }

      return evaluateValue(this, this.descriptionValue, context)
    }
  }
}
