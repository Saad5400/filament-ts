import { Configurable } from './mixins/configurable.js'
import { EvaluatesClosures } from './mixins/evaluates_closures.js'
import type { ResolveContextLike } from './types.js'

class BaseComponent {}

export class Component extends Configurable(EvaluatesClosures(BaseComponent)) {
  constructor(context: ResolveContextLike = {}) {
    super()

    if (Object.keys(context).length > 0) {
      this.withContext(context)
    }
  }

  static make<TInstance, TArgs extends unknown[]>(
    this: new (...args: TArgs) => TInstance,
    ...args: TArgs
  ): TInstance {
    const instance = new this(...args)

    if (typeof (instance as { configure?: () => void }).configure === 'function') {
      ;(instance as { configure: () => void }).configure()
    }

    return instance
  }
}
