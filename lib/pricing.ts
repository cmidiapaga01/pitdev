import { getDay, addDays, differenceInCalendarDays } from 'date-fns'

// ─── Configuration ────────────────────────────────────────────────────────────

export const WEIGHT_TIERS = [
  { label: 'Pequeno', detail: 'até 10 kg', surcharge: 0 },
  { label: 'Médio', detail: '10–20 kg', surcharge: 20 },
  { label: 'Grande', detail: '20–40 kg', surcharge: 35 },
  { label: 'Gigante', detail: 'acima de 40 kg', surcharge: 55 },
] as const

export const BASE_PRICE = {
  weekday: 85,  // Mon–Thu (R$/night)
  weekend: 110, // Fri–Sun (R$/night)
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if the night starting on `date` is a weekend night (Fri/Sat/Sun). */
export function isWeekendNight(date: Date): boolean {
  const day = getDay(date)
  return day === 5 || day === 6 || day === 0 // Fri, Sat, Sun
}

/** Returns true if any night in the range [from, to) falls on a weekend. */
export function rangeIncludesWeekend(from: Date, to: Date): boolean {
  const nights = differenceInCalendarDays(to, from)
  return Array.from({ length: nights }, (_, i) => addDays(from, i)).some(isWeekendNight)
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type MinStayResult =
  | { valid: true }
  | { valid: false; message: string }

/**
 * Validates minimum stay rules:
 * - At least 3 nights by default
 * - 2 nights allowed only if the range includes a weekend night
 */
export function validateMinStay(from: Date, to: Date): MinStayResult {
  const nights = differenceInCalendarDays(to, from)

  if (nights < 2) {
    return { valid: false, message: 'Mínimo de 2 noites' }
  }
  if (nights === 2 && !rangeIncludesWeekend(from, to)) {
    return {
      valid: false,
      message: '2 noites só com fim de semana incluso (sex, sáb ou dom)',
    }
  }
  return { valid: true }
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export interface NightBreakdown {
  date: Date
  isWeekend: boolean
  basePrice: number
  surcharge: number
  total: number
}

export interface PriceSummary {
  nights: NightBreakdown[]
  weightLabel: string
  weightDetail: string
  subtotal: number
}

/**
 * Calculates per-night pricing for a stay.
 * Each night is priced individually (weekday vs weekend rate + weight surcharge).
 */
export function calculatePricing(
  from: Date,
  to: Date,
  weightTierIndex: number,
): PriceSummary {
  const nightCount = differenceInCalendarDays(to, from)
  const tier = WEIGHT_TIERS[weightTierIndex] ?? WEIGHT_TIERS[0]
  const surcharge = tier.surcharge

  const nights: NightBreakdown[] = Array.from({ length: nightCount }, (_, i) => {
    const date = addDays(from, i)
    const weekend = isWeekendNight(date)
    const base = weekend ? BASE_PRICE.weekend : BASE_PRICE.weekday
    return {
      date,
      isWeekend: weekend,
      basePrice: base,
      surcharge,
      total: base + surcharge,
    }
  })

  return {
    nights,
    weightLabel: tier.label,
    weightDetail: tier.detail,
    subtotal: nights.reduce((sum, n) => sum + n.total, 0),
  }
}

/**
 * Returns a function usable as react-day-picker `disabled` prop to enforce
 * minimum stay when a check-in date is already selected.
 */
export function buildDisabledDays(from: Date) {
  return (date: Date): boolean => {
    const nights = differenceInCalendarDays(date, from)
    if (nights <= 0) return true
    if (nights === 1) return true
    if (nights === 2 && !rangeIncludesWeekend(from, date)) return true
    return false
  }
}
