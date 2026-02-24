import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export interface StateCast {
  get(value: unknown): unknown
  set?(value: unknown): unknown
}

type StateHydratedHook = (state: unknown) => void
type StateUpdatedHook = (state: unknown, oldState: unknown) => void
type BeforeStateDehydratedHook = (state: unknown) => unknown

export function HasState<TBase extends Constructor>(Base: TBase) {
  return class HasStateMixin extends Base {
    public stateValue: unknown = undefined
    public defaultStateValue: Resolvable<unknown> | null = null
    public hasDefaultStateValue = false
    public statePathValue: string | null = null

    public afterStateHydratedHook: StateHydratedHook | null = null
    public afterStateUpdatedHooks: StateUpdatedHook[] = []
    public beforeStateDehydratedHook: BeforeStateDehydratedHook | null = null

    public isDehydratedValue: Resolvable<boolean | null> | null = null
    public isDehydratedWhenHiddenValue: Resolvable<boolean> = false

    public stateCastsValue: Array<Resolvable<StateCast>> = []

    state(state: unknown): this {
      const oldState = this.stateValue
      this.stateValue = state

      this.callAfterStateUpdated({
        oldState,
      })

      return this
    }

    getState(context: ResolveContextLike = {}): unknown {
      if (this.stateValue !== undefined) {
        return this.stateValue
      }

      if (!this.hasDefaultStateValue || this.defaultStateValue === null) {
        return undefined
      }

      return evaluateValue(this, this.defaultStateValue, context)
    }

    default(state: Resolvable<unknown>): this {
      this.defaultStateValue = state
      this.hasDefaultStateValue = true

      return this
    }

    statePath(path: string): this {
      this.statePathValue = path

      return this
    }

    getStatePath(): string | null {
      return this.statePathValue
    }

    hasStatePath(): boolean {
      return Boolean(this.statePathValue)
    }

    stateCast(cast: Resolvable<StateCast>): this {
      this.stateCastsValue.push(cast)

      return this
    }

    getStateCasts(context: ResolveContextLike = {}): StateCast[] {
      return this.stateCastsValue.map((cast) => evaluateValue(this, cast, context))
    }

    afterStateHydrated(callback: StateHydratedHook | null): this {
      this.afterStateHydratedHook = callback

      return this
    }

    callAfterStateHydrated(context: ResolveContextLike = {}): this {
      if (this.afterStateHydratedHook === null) {
        return this
      }

      this.afterStateHydratedHook(this.getState(context))

      return this
    }

    afterStateUpdated(callback: StateUpdatedHook | null): this {
      if (!callback) {
        this.afterStateUpdatedHooks = []

        return this
      }

      this.afterStateUpdatedHooks.push(callback)

      return this
    }

    clearAfterStateUpdatedHooks(): this {
      this.afterStateUpdatedHooks = []

      return this
    }

    callAfterStateUpdated(
      metadata: {
        oldState?: unknown
      } = {},
      context: ResolveContextLike = {},
    ): this {
      if (this.afterStateUpdatedHooks.length === 0) {
        return this
      }

      const state = this.getState(context)
      const oldState = metadata.oldState

      for (const hook of this.afterStateUpdatedHooks) {
        hook(state, oldState)
      }

      return this
    }

    beforeStateDehydrated(callback: BeforeStateDehydratedHook | null): this {
      this.beforeStateDehydratedHook = callback

      return this
    }

    callBeforeStateDehydrated(context: ResolveContextLike = {}): unknown {
      const state = this.getState(context)

      if (this.beforeStateDehydratedHook === null) {
        return state
      }

      return this.beforeStateDehydratedHook(state)
    }

    dehydrated(condition: Resolvable<boolean | null> = true): this {
      this.isDehydratedValue = condition

      return this
    }

    dehydratedWhenHidden(condition: Resolvable<boolean> = true): this {
      this.isDehydratedWhenHiddenValue = condition

      return this
    }

    isDehydrated(context: ResolveContextLike = {}): boolean {
      if (this.isDehydratedValue === null) {
        return true
      }

      return Boolean(evaluateValue(this, this.isDehydratedValue, context) ?? true)
    }

    isDehydratedWhenHidden(context: ResolveContextLike = {}): boolean {
      return Boolean(evaluateValue(this, this.isDehydratedWhenHiddenValue, context))
    }

    getStateToDehydrate(context: ResolveContextLike = {}): unknown {
      let state = this.callBeforeStateDehydrated(context)

      for (const cast of this.getStateCasts(context)) {
        state = cast.get(state)
      }

      return state
    }

    hydrateState(state: unknown, context: ResolveContextLike = {}): this {
      let nextState = state

      for (const cast of [...this.getStateCasts(context)].reverse()) {
        if (typeof cast.set === 'function') {
          nextState = cast.set(nextState)
        }
      }

      this.stateValue = nextState
      this.callAfterStateHydrated(context)

      return this
    }

    dehydrateState(context: ResolveContextLike = {}): unknown {
      if (!this.isDehydrated(context)) {
        return undefined
      }

      const state = this.getStateToDehydrate(context)

      if (!this.hasStatePath()) {
        return state
      }

      return {
        [this.statePathValue as string]: state,
      }
    }
  }
}
