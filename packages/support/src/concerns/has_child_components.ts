import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export type ChildComponent = unknown
export type ChildComponentList = ChildComponent[]

export function HasChildComponents<TBase extends Constructor>(Base: TBase) {
  return class HasChildComponentsMixin extends Base {
    public childComponentsValue: Record<string, Resolvable<ChildComponentList>> = {}

    components(components: Resolvable<ChildComponentList>): this {
      return this.childComponents(components)
    }

    childComponents(components: Resolvable<ChildComponentList>, key = 'default'): this {
      this.childComponentsValue[key] = components

      return this
    }

    schema(components: Resolvable<ChildComponentList>): this {
      return this.components(components)
    }

    getChildComponents(key = 'default', context: ResolveContextLike = {}): ChildComponentList {
      const components = this.childComponentsValue[key]

      if (!components) {
        return []
      }

      return evaluateValue(this, components, context)
    }

    getDefaultChildComponents(context: ResolveContextLike = {}): ChildComponentList {
      return this.getChildComponents('default', context)
    }

    getChildSchemas(context: ResolveContextLike = {}): Record<string, ChildComponentList> {
      return Object.keys(this.childComponentsValue).reduce<Record<string, ChildComponentList>>(
        (result, key) => {
          result[key] = this.getChildComponents(key, context)

          return result
        },
        {},
      )
    }

    clearCachedDefaultChildSchemas(): void {
      // Included for API parity with upstream concerns.
    }
  }
}
