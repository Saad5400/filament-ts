export type IconResolver = (name: string) => string | null

export class IconManager {
  protected icons = new Map<string, string>()
  protected resolvers: IconResolver[] = []

  register(icons: Record<string, string>): this {
    for (const [alias, icon] of Object.entries(icons)) {
      this.icons.set(alias, icon)
    }

    return this
  }

  registerResolver(resolver: IconResolver): this {
    this.resolvers.push(resolver)

    return this
  }

  resolve(alias: string | string[]): string | null {
    const aliases = Array.isArray(alias) ? alias : [alias]

    for (const candidate of aliases) {
      const registered = this.icons.get(candidate)
      if (registered) {
        return registered
      }
    }

    for (const candidate of aliases) {
      for (const resolver of this.resolvers) {
        const resolved = resolver(candidate)
        if (resolved) {
          return resolved
        }
      }
    }

    const fallback = aliases[0]

    if (!fallback) {
      return null
    }

    if (fallback.startsWith('lucide:')) {
      return fallback
    }

    return `lucide:${fallback}`
  }
}
