import { resolve } from '../resolve.js'
import type { ResolveContextLike, Resolvable } from '../types.js'

export interface ClosureEvaluator {
  evaluate<T>(value: Resolvable<T>, context?: ResolveContextLike): T
}

export function evaluateValue<T>(
  target: unknown,
  value: Resolvable<T>,
  context: ResolveContextLike = {},
): T {
  if (typeof (target as ClosureEvaluator).evaluate === 'function') {
    return (target as ClosureEvaluator).evaluate(value, context)
  }

  return resolve(value, context)
}

function getFunctionParameterNames(value: Function): string[] {
  const source = value
    .toString()
    .replace(/\/\*.*?\*\//gs, '')
    .replace(/\/\/.*$/gm, '')

  const arrowMatch = source.match(/^(?:async\s*)?(?:\(([^)]*)\)|([^=()\s]+))\s*=>/)
  if (arrowMatch) {
    const raw = arrowMatch[1] ?? arrowMatch[2] ?? ''
    return raw
      .split(',')
      .map((segment) =>
        segment
          .trim()
          .replace(/=[\s\S]*$/, '')
          .trim(),
      )
      .filter(Boolean)
  }

  const functionMatch = source.match(/^[^(]*\(([^)]*)\)/)
  if (!functionMatch) {
    return []
  }

  return functionMatch[1]
    .split(',')
    .map((segment) =>
      segment
        .trim()
        .replace(/=[\s\S]*$/, '')
        .trim(),
    )
    .filter(Boolean)
}

export function closureHasParameter(value: unknown, parameterName: string): boolean {
  if (typeof value !== 'function') {
    return false
  }

  return getFunctionParameterNames(value).includes(parameterName)
}
