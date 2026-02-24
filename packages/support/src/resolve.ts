import type { ResolveContext, ResolveContextLike, Resolvable } from './types.js'

export function isResolvableClosure<T>(
  value: Resolvable<T>,
): value is (context: ResolveContext) => T {
  return typeof value === 'function'
}

export function resolve<T, TContext extends ResolveContext = ResolveContext>(
  value: Resolvable<T, TContext>,
  context: ResolveContextLike = {},
): T {
  if (typeof value !== 'function') {
    return value
  }

  return (value as (context: TContext) => T)(context as TContext)
}
