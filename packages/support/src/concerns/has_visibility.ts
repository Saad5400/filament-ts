import { Operation } from '../enums/operation.js'
import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

type OperationInput = Operation | `${Operation}` | Array<Operation | `${Operation}`>

function operationMatches(
  current: ResolveContextLike['operation'],
  operations: OperationInput,
): boolean {
  if (!current) {
    return false
  }

  const currentValue = `${current}`

  return ([] as Array<Operation | `${Operation}`>)
    .concat(operations)
    .map((operation) => `${operation}`)
    .includes(currentValue)
}

export function HasVisibility<TBase extends Constructor>(Base: TBase) {
  return class HasVisibilityMixin extends Base {
    public isHiddenValue: Resolvable<boolean> = false
    public isVisibleValue: Resolvable<boolean> = true

    hidden(condition: Resolvable<boolean> = true): this {
      this.isHiddenValue = condition

      return this
    }

    hiddenOn(operations: OperationInput): this {
      return this.hidden((context) => operationMatches(context.operation, operations))
    }

    visible(condition: Resolvable<boolean> = true): this {
      this.isVisibleValue = condition

      return this
    }

    visibleOn(operations: OperationInput): this {
      return this.visible((context) => operationMatches(context.operation, operations))
    }

    isHidden(context: ResolveContextLike = {}): boolean {
      if (evaluateValue(this, this.isHiddenValue, context)) {
        return true
      }

      return !evaluateValue(this, this.isVisibleValue, context)
    }

    isVisible(context: ResolveContextLike = {}): boolean {
      return !this.isHidden(context)
    }
  }
}
