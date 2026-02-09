/**
 * Common utility functions
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `fid-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        ;(clonedObj as any)[key] = deepClone((obj as any)[key])
      }
    }
    return clonedObj
  }
  return obj
}
