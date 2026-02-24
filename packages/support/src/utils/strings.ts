function normalizeDelimiters(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function titleCase(value: string): string {
  return normalizeDelimiters(value)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function labelFromName(name: string): string {
  return titleCase(name)
}

export function slugify(value: string, separator = '-'): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  return normalized
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`\\${separator}+`, 'g'), separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '')
}

export function snakeCase(value: string): string {
  return slugify(normalizeDelimiters(value), '_')
}

export function kebabCase(value: string): string {
  return slugify(normalizeDelimiters(value), '-')
}

export function camelCase(value: string): string {
  const words = normalizeDelimiters(value).toLowerCase().split(' ').filter(Boolean)

  if (words.length === 0) {
    return ''
  }

  return (
    words[0] +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  )
}
