import type { Constructor } from '../types.js'

export function HasName<TBase extends Constructor>(Base: TBase) {
  return class HasNameMixin extends Base {
    public nameValue: string | null = null

    name(name: string): this {
      this.nameValue = name

      return this
    }

    getName(): string | null {
      return this.nameValue
    }
  }
}
