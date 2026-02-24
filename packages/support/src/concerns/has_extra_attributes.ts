import { evaluateValue } from '../mixins/helpers.js'
import type { Constructor, ResolveContextLike, Resolvable } from '../types.js'

export type ExtraAttributes = Record<string, unknown>

function mergeAttributes(base: ExtraAttributes, incoming: ExtraAttributes): ExtraAttributes {
  const next = {
    ...base,
    ...incoming,
  }

  if (typeof base.class === 'string' || typeof incoming.class === 'string') {
    next.class = [base.class, incoming.class].filter(Boolean).join(' ')
  }

  return next
}

export function HasExtraAttributes<TBase extends Constructor>(Base: TBase) {
  return class HasExtraAttributesMixin extends Base {
    public extraAttributesValue: Array<Resolvable<ExtraAttributes>> = []

    extraAttributes(attributes: Resolvable<ExtraAttributes>, merge = false): this {
      if (merge) {
        this.extraAttributesValue.push(attributes)
      } else {
        this.extraAttributesValue = [attributes]
      }

      return this
    }

    getExtraAttributes(context: ResolveContextLike = {}): ExtraAttributes {
      return this.extraAttributesValue.reduce<ExtraAttributes>((attributes, extraAttributes) => {
        const resolvedAttributes = evaluateValue(this, extraAttributes, context)

        return mergeAttributes(attributes, resolvedAttributes)
      }, {})
    }
  }
}
