import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export interface ActionLike {
  name: string
  [key: string]: unknown
}

function isActionLike(value: unknown): value is ActionLike {
  return typeof value === 'object' && value !== null && 'name' in value
}

function normalizeActions(resolved: unknown): ActionLike[] {
  if (Array.isArray(resolved)) {
    return resolved.filter(isActionLike)
  }

  if (isActionLike(resolved)) {
    return [resolved]
  }

  return []
}

function shouldCacheResolvedActions(
  actions: Array<Resolvable<ActionLike | ActionLike[] | null>>,
): boolean {
  return !actions.some((action) => typeof action === 'function')
}

export function HasActions<TBase extends Constructor>(Base: TBase) {
  return class HasActionsMixin extends Base {
    public cachedActions: Record<string, ActionLike> | null = null
    public registeredActions: Array<Resolvable<ActionLike | ActionLike[] | null>> = []
    public primaryAction: ActionLike | null = null

    registerActions(actions: Array<Resolvable<ActionLike | ActionLike[] | null>>): this {
      this.registeredActions = [...this.registeredActions, ...actions]
      this.cachedActions = null

      return this
    }

    action(action: ActionLike | null): this {
      this.primaryAction = action

      if (action) {
        this.registerActions([action])
      }

      return this
    }

    getAction(name?: string, context: ResolveContextLike = {}): ActionLike | null {
      if (!name) {
        return this.primaryAction
      }

      const actions = this.getActions(context)

      return actions[name] ?? null
    }

    getActions(context: ResolveContextLike = {}): Record<string, ActionLike> {
      const shouldCacheActions = shouldCacheResolvedActions(this.registeredActions)

      if (shouldCacheActions && this.cachedActions) {
        return this.cachedActions
      }

      const actions: Record<string, ActionLike> = {}

      for (const actionValue of this.registeredActions) {
        const resolved = evaluateValue(this, actionValue, context)

        for (const action of normalizeActions(resolved)) {
          actions[action.name] = this.prepareAction(action)
        }
      }

      if (shouldCacheActions) {
        this.cachedActions = actions
      }

      return actions
    }

    hasAction(name: string, context: ResolveContextLike = {}): boolean {
      return Object.hasOwn(this.getActions(context), name)
    }

    public prepareAction(action: ActionLike): ActionLike {
      return action
    }

    clearCachedActions(): void {
      this.cachedActions = null
    }
  }
}
