import { resolve } from '../resolve.js'
import type { Constructor, ResolveContext, ResolveContextLike, Resolvable } from '../types.js'
import { closureHasParameter } from './helpers.js'

export function EvaluatesClosures<TBase extends Constructor>(Base: TBase) {
  return class EvaluatesClosuresMixin extends Base {
    public resolveContext: ResolveContext = {}

    withContext(context: ResolveContextLike): this {
      this.resolveContext = {
        ...this.resolveContext,
        ...context,
      }

      return this
    }

    getResolveContext(): ResolveContext {
      return {
        ...this.resolveContext,
      }
    }

    evaluate<T>(value: Resolvable<T>, context: ResolveContextLike = {}): T {
      return resolve(value, {
        ...this.resolveContext,
        ...context,
      })
    }

    public evaluationValueIsFunctionAndHasParameter(
      value: unknown,
      parameterName: string,
    ): boolean {
      return closureHasParameter(value, parameterName)
    }
  }
}
