import { Operation } from './enums/operation.js'

export type Constructor<T = object> = new (...args: any[]) => T

export interface ResolveContext {
  record?: unknown
  state?: unknown
  user?: unknown
  operation?: Operation | `${Operation}`
}

export type Resolvable<T, TContext extends ResolveContext = ResolveContext> =
  | T
  | ((context: TContext) => T)

export type ResolveContextLike = Partial<ResolveContext>
