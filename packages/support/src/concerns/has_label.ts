import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function HasLabel<TBase extends Constructor>(Base: TBase) {
  return class HasLabelMixin extends Base {
    public isLabelHiddenValue: Resolvable<boolean> = false
    public labelValue: Resolvable<string | null> | null = null

    hiddenLabel(condition: Resolvable<boolean> = true): this {
      this.isLabelHiddenValue = condition

      return this
    }

    label(label: Resolvable<string | null>): this {
      this.labelValue = label

      return this
    }

    getLabel(context: ResolveContextLike = {}): string | null {
      if (this.labelValue === null) {
        return null
      }

      return evaluateValue(this, this.labelValue, context)
    }

    hasCustomLabel(): boolean {
      return this.labelValue !== null
    }

    isLabelHidden(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.isLabelHiddenValue, context))
    }
  }
}
