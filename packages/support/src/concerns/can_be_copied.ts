import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function CanBeCopied<TBase extends Constructor>(Base: TBase) {
  return class CanBeCopiedMixin extends Base {
    public isCopyableValue: Resolvable<boolean> = false
    public copyableStateValue: Resolvable<string | null> | null = null
    public copyMessageValue: Resolvable<string | null> | null = null
    public copyMessageDurationValue: Resolvable<number | null> | null = null

    copyable(condition: Resolvable<boolean> = true): this {
      this.isCopyableValue = condition

      return this
    }

    copyableState(state: Resolvable<string | null>): this {
      this.copyableStateValue = state

      return this
    }

    copyMessage(message: Resolvable<string | null>): this {
      this.copyMessageValue = message

      return this
    }

    copyMessageDuration(duration: Resolvable<number | null>): this {
      this.copyMessageDurationValue = duration

      return this
    }

    isCopyable(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.isCopyableValue, context))
    }

    getCopyableState(context: ResolveContextLike = {}): string | null {
      if (this.copyableStateValue === null) {
        return null
      }

      return evaluateValue(this, this.copyableStateValue, context)
    }

    getCopyMessage(context: ResolveContextLike = {}): string {
      if (this.copyMessageValue === null) {
        return 'Copied'
      }

      return evaluateValue(this, this.copyMessageValue, context) ?? 'Copied'
    }

    getCopyMessageDuration(context: ResolveContextLike = {}): number {
      if (this.copyMessageDurationValue === null) {
        return 2000
      }

      return evaluateValue(this, this.copyMessageDurationValue, context) ?? 2000
    }
  }
}
