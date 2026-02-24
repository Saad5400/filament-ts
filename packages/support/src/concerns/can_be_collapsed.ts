import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function CanBeCollapsed<TBase extends Constructor>(Base: TBase) {
  return class CanBeCollapsedMixin extends Base {
    public isCollapsedValue: Resolvable<boolean> = false
    public isCollapsibleValue: Resolvable<boolean | null> | null = null
    public shouldPersistCollapsedValue: Resolvable<boolean> = false

    collapsed(condition: Resolvable<boolean> = true, shouldMakeComponentCollapsible = true): this {
      this.isCollapsedValue = condition

      if (shouldMakeComponentCollapsible && this.isCollapsibleValue === null) {
        this.collapsible()
      }

      return this
    }

    collapsible(condition: Resolvable<boolean | null> = true): this {
      this.isCollapsibleValue = condition

      return this
    }

    persistCollapsed(condition: Resolvable<boolean> = true): this {
      this.shouldPersistCollapsedValue = condition

      return this
    }

    isCollapsed(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.isCollapsedValue, context))
    }

    isCollapsible(context: ResolveContextLike = {}): boolean {
      if (this.isCollapsibleValue === null) {
        return false
      }

      return Boolean(evaluateValue(this, this.isCollapsibleValue, context))
    }

    shouldPersistCollapsed(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.shouldPersistCollapsedValue, context))
    }
  }
}
