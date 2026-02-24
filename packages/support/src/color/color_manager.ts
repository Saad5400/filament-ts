import { evaluateValue } from '../mixins/helpers.js'
import type { ResolveContextLike } from '../types.js'
import { DEFAULT_SEMANTIC_COLORS } from './palettes.js'
import { normalizeColor } from './color.js'
import type {
  ColorInput,
  ColorRegistration,
  ColorRegistrationResolvable,
  ColorScale,
} from './types.js'

export class ColorManager {
  protected registrations: ColorRegistrationResolvable[] = []

  register(colors: ColorRegistrationResolvable): this {
    this.registrations.push(colors)

    return this
  }

  getColors(context: ResolveContextLike = {}): Record<string, ColorScale> {
    const result: Record<string, ColorScale> = {
      ...DEFAULT_SEMANTIC_COLORS,
    }

    for (const registration of this.registrations) {
      const resolved = evaluateValue(this, registration, context)
      for (const [name, color] of Object.entries(resolved)) {
        result[name] = normalizeColor(color)
      }
    }

    return result
  }

  getColor(name: string, context: ResolveContextLike = {}): ColorScale | null {
    return this.getColors(context)[name] ?? null
  }

  resolve(color: ColorInput): ColorScale {
    return normalizeColor(color)
  }
}
