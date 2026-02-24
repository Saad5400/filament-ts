import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export function CanOpenUrl<TBase extends Constructor>(Base: TBase) {
  return class CanOpenUrlMixin extends Base {
    public shouldOpenUrlInNewTabValue: Resolvable<boolean> = false
    public urlValue: Resolvable<string | null> | null = null

    openUrlInNewTab(condition: Resolvable<boolean> = true): this {
      this.shouldOpenUrlInNewTabValue = condition

      return this
    }

    url(url: Resolvable<string | null>, shouldOpenInNewTab: Resolvable<boolean> = false): this {
      this.openUrlInNewTab(shouldOpenInNewTab)
      this.urlValue = url

      return this
    }

    getUrl(context: ResolveContextLike = {}): string | null {
      if (this.urlValue === null) {
        return null
      }

      return evaluateValue(this, this.urlValue, context)
    }

    shouldOpenUrlInNewTab(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.shouldOpenUrlInNewTabValue, context))
    }

    hasStateBasedUrls(): boolean {
      return (
        this.urlValue !== null && typeof this.urlValue === 'function' && this.urlValue.length > 0
      )
    }
  }
}
