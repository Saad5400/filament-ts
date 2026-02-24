import { Alignment } from '../enums/alignment.js'
import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

function resolveAlignment(value: string | Alignment | null): string | Alignment | null {
  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    return value
  }

  return Object.values(Alignment).includes(value as Alignment) ? (value as Alignment) : value
}

export function HasAlignment<TBase extends Constructor>(Base: TBase) {
  return class HasAlignmentMixin extends Base {
    public alignmentValue: Resolvable<string | Alignment | null> | null = null

    alignment(alignment: Resolvable<string | Alignment | null>): this {
      this.alignmentValue = alignment

      return this
    }

    alignStart(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Start : null,
      )
    }

    alignCenter(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Center : null,
      )
    }

    alignEnd(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.End : null,
      )
    }

    alignJustify(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Justify : null,
      )
    }

    alignBetween(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Between : null,
      )
    }

    alignLeft(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Left : null,
      )
    }

    alignRight(condition: Resolvable<boolean> = true): this {
      return this.alignment((context) =>
        evaluateValue(this, condition, context) ? Alignment.Right : null,
      )
    }

    getAlignment(context: ResolveContextLike = {}): string | Alignment | null {
      if (this.alignmentValue === null) {
        return null
      }

      return resolveAlignment(evaluateValue(this, this.alignmentValue, context))
    }
  }
}
