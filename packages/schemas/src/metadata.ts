/**
 * Schema metadata utilities
 */

export interface RenderContext {
  [key: string]: any
}

/**
 * Check if a schema is visible based on its metadata
 */
export function isVisible(
  meta: Record<string, any> | undefined,
  context: RenderContext
): boolean {
  if (!meta) return true

  // Explicit hidden flag
  if (meta.hidden === true) return false

  // Conditional visibility function
  if (meta.visible && typeof meta.visible === 'function') {
    return meta.visible(context)
  }

  return true
}
