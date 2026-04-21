/* =====================================================
   TYPES
===================================================== */

export const CLIMATE_ICONS = ['sun', 'cloud', 'rain'] as const

export type ClimateIcon = (typeof CLIMATE_ICONS)[number]

export interface ClimateData {
  icon: ClimateIcon
  tempMax: number
}

const FALLBACK_CLIMATE: ClimateData = {
  icon: 'sun',
  tempMax: 30,
}

/* =====================================================
   CONFIGURATION
===================================================== */

const BASE_TEMP_BY_MONTH: Record<number, number> = {
  1: 34,
  2: 33,
  3: 32,
  4: 30,
  5: 28,
  6: 27,
  7: 27,
  8: 29,
  9: 31,
  10: 32,
  11: 33,
  12: 34,
}

function getIconByProbability(rand: number): ClimateIcon {
  if (rand < 0.65) return 'sun'
  if (rand < 0.9) return 'rain'
  return 'rain'
}

/* =====================================================
   UTILITIES
===================================================== */

/**
 * Pseudo-random determinístico baseado em seed numérica.
 * Seguro para SSR (sempre retorna o mesmo valor para a mesma data).
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Gera seed única para cada data.
 */
function getSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
}

/**
 * Validação segura de data real.
 */
function isValidDate(date: Date): boolean {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

/* =====================================================
   CORE CLIMATE ENGINE
===================================================== */

export function getClimateData(date: Date): ClimateData {
  if (!isValidDate(date)) {
    return FALLBACK_CLIMATE
  }

  const month = date.getMonth() + 1
  const baseTemp = BASE_TEMP_BY_MONTH[month] ?? 30

  const seed = getSeed(date)

  const randIcon = seededRandom(seed)
  const randTemp = seededRandom(seed + 1)

  /**
   * Variação diária suave:
   * -2°C até +2°C
   */
  const variation = Math.floor(randTemp * 5) - 2

  /**
   * Pequena oscilação sazonal adicional
   * (evita que meses inteiros fiquem com mesma média exata)
   */
  const seasonalShift = Math.floor(seededRandom(seed + 2) * 2)

  const tempMax = baseTemp + variation + seasonalShift

  return {
    icon: getIconByProbability(randIcon),
    tempMax,
  }
}

/* =====================================================
   RANGE SUPPORT
===================================================== */

const MAX_RANGE_DAYS = 365

export function getClimateDataForRange(startDate: Date, endDate: Date): ClimateData[] {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return []
  }

  if (startDate > endDate) {
    return []
  }

  const results: ClimateData[] = []
  const current = new Date(startDate)
  let counter = 0

  while (current <= endDate) {
    results.push(getClimateData(current))

    current.setDate(current.getDate() + 1)
    counter++

    if (counter > MAX_RANGE_DAYS) {
      break
    }
  }

  return results
}
