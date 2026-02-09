/**
 * Common type utilities
 */

/**
 * Make specific keys of an object required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific keys of an object optional
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extract the return type of a function or async function
 */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : T extends (...args: any) => infer R
    ? R
    : any

/**
 * String literal type for union of string values
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & {})

/**
 * Nullable version of a type
 */
export type Nullable<T> = T | null

/**
 * Maybe type (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined
