import { COLOR_SHADES } from './types.js'
import type { ColorInput, ColorScale } from './types.js'

const PALETTE_CONSTANTS: Record<(typeof COLOR_SHADES)[number], [number, number]> = {
  50: [0.97717647058824, 0.01395454545455],
  100: [0.95035294117647, 0.03272727272727],
  200: [0.90547058823529, 0.06318181818182],
  300: [0.84047058823529, 0.10604545454546],
  400: [0.75352941176471, 0.15027272727273],
  500: [0.68270588235294, 0.17009090909091],
  600: [0.59782352941176, 0.16913636363636],
  700: [0.51494117647059, 0.14940909090909],
  800: [0.44611764705882, 0.12331818181818],
  900: [0.39458823529412, 0.09963636363636],
  950: [0.27788235294118, 0.07136363636364],
}

function isColorScale(value: ColorInput): value is ColorScale {
  return typeof value === 'object' && value !== null
}

function parseHexChannels(color: string): [number, number, number] | null {
  const hex = color.slice(1)

  if (/^[\da-f]{3}$/i.test(hex)) {
    const expandedHex = hex
      .split('')
      .map((channel) => channel.repeat(2))
      .join('')

    return [
      Number.parseInt(expandedHex.slice(0, 2), 16),
      Number.parseInt(expandedHex.slice(2, 4), 16),
      Number.parseInt(expandedHex.slice(4, 6), 16),
    ]
  }

  if (/^[\da-f]{6}$/i.test(hex)) {
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ]
  }

  return null
}

function parseChannelList(channelList: string): [number, number, number] | null {
  const channels = channelList.split(',')

  if (channels.length !== 3 || channels.some((channel) => channel.length === 0)) {
    return null
  }

  const parsedChannels = channels.map((channel) => Number(channel))

  if (parsedChannels.some((channel) => !Number.isFinite(channel))) {
    return null
  }

  return parsedChannels as [number, number, number]
}

export function convertToOklch(color: string): string {
  if (color.startsWith('oklch(')) {
    return color
  }

  const normalizedColor = color.replace(/\s+/g, '')

  let channels: [number, number, number] | null = null

  if (normalizedColor.startsWith('#')) {
    channels = parseHexChannels(normalizedColor)
  } else if (normalizedColor.startsWith('rgb(') && normalizedColor.endsWith(')')) {
    channels = parseChannelList(normalizedColor.slice(4, -1))
  } else {
    channels = parseChannelList(normalizedColor)
  }

  if (
    !channels ||
    channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)
  ) {
    throw new Error(`Invalid color provided: ${color}`)
  }

  let [red, green, blue] = channels

  red /= 255
  green /= 255
  blue /= 255

  red = red <= 0.04045 ? red / 12.92 : ((red + 0.055) / 1.055) ** 2.4
  green = green <= 0.04045 ? green / 12.92 : ((green + 0.055) / 1.055) ** 2.4
  blue = blue <= 0.04045 ? blue / 12.92 : ((blue + 0.055) / 1.055) ** 2.4

  const long = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue
  const medium = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue
  const short = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue

  const longCubeRoot = long ** (1 / 3)
  const mediumCubeRoot = medium ** (1 / 3)
  const shortCubeRoot = short ** (1 / 3)

  const lightness =
    0.2104542553 * longCubeRoot + 0.793617785 * mediumCubeRoot - 0.0040720468 * shortCubeRoot
  const opponentA =
    1.9779984951 * longCubeRoot - 2.428592205 * mediumCubeRoot + 0.4505937099 * shortCubeRoot
  const opponentB =
    0.0259040371 * longCubeRoot + 0.7827717662 * mediumCubeRoot - 0.808675766 * shortCubeRoot

  const chroma = Math.sqrt(opponentA ** 2 + opponentB ** 2)
  let hue = (Math.atan2(opponentB, opponentA) * 180) / Math.PI

  if (hue < 0) {
    hue += 360
  }

  return `oklch(${Number(lightness.toFixed(3))} ${Number(chroma.toFixed(3))} ${Number(hue.toFixed(3))})`
}

export function generatePalette(color: string): ColorScale {
  const oklchColor = convertToOklch(color)
  const [, , chroma, hue] = oklchColor.match(/oklch\(([^\s]+)\s+([^\s]+)\s+([^\s\)]+)\)/) ?? []
  const parsedChroma = chroma ? Number(chroma) : Number.NaN
  const parsedHue = hue ? Number(hue) : Number.NaN

  if (!Number.isFinite(parsedChroma) || !Number.isFinite(parsedHue)) {
    throw new Error(`Invalid color provided: ${color}`)
  }

  const isAchromatic = parsedChroma < 0.03

  return COLOR_SHADES.reduce<ColorScale>((palette, shade) => {
    const [lightness, targetChroma] = PALETTE_CONSTANTS[shade]
    const shadeChroma = isAchromatic ? 0 : targetChroma

    palette[shade] = `oklch(${lightness} ${shadeChroma} ${parsedHue})`

    return palette
  }, {} as ColorScale)
}

export function normalizeColor(color: ColorInput): ColorScale {
  if (isColorScale(color)) {
    return COLOR_SHADES.reduce<ColorScale>((palette, shade) => {
      palette[shade] = convertToOklch(color[shade])

      return palette
    }, {} as ColorScale)
  }

  return generatePalette(color)
}

export function isLightColor(color: string): boolean {
  const oklchColor = convertToOklch(color)
  const [, lightness] = oklchColor.match(/oklch\(([^\s]+)/) ?? []

  return Number.parseFloat(lightness) >= 0.65
}
