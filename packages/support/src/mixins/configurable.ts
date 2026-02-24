import type { Constructor } from '../types.js'

const classConfigurators = new WeakMap<Function, Array<(instance: unknown) => void>>()

function getConfiguratorChain(target: Function): Array<(instance: unknown) => void> {
  const chain: Array<(instance: unknown) => void> = []

  let current: object | null = target
  while (current && current !== Function.prototype) {
    const ctor = current as Function
    const configurators = classConfigurators.get(ctor)

    if (configurators) {
      chain.unshift(...configurators)
    }

    current = Object.getPrototypeOf(current)
  }

  return chain
}

export function Configurable<TBase extends Constructor>(Base: TBase) {
  return class ConfigurableMixin extends Base {
    static configureUsing<TInstance>(
      this: Constructor<TInstance>,
      callback: (instance: TInstance) => void,
    ): void {
      const callbacks = classConfigurators.get(this) ?? []
      callbacks.push(callback as (instance: unknown) => void)
      classConfigurators.set(this, callbacks)
    }

    configure(): this {
      const callbacks = getConfiguratorChain(this.constructor)

      for (const callback of callbacks) {
        callback(this)
      }

      this.setUp()

      return this
    }

    public setUp(): void {}
  }
}
