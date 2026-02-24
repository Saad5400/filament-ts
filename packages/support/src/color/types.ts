import type { ResolveContextLike, Resolvable } from '../types.js'

export const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ColorShade = (typeof COLOR_SHADES)[number]

export type ColorScale = Record<ColorShade, string>

export type ColorInput = string | ColorScale

export type SemanticColorName = 'primary' | 'danger' | 'gray' | 'info' | 'success' | 'warning'

export type SemanticColors = Record<SemanticColorName, ColorScale>

export type ColorRegistration = Record<string, ColorInput>

export type ColorRegistrationResolvable = Resolvable<ColorRegistration>

export interface ColorContext extends ResolveContextLike {}
