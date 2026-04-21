'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import type { DateRange, PetWeight, BookingSearchParams } from '@/types/booking'
import { calculatePricing, type PriceSummary } from '@/lib/pricing'

interface BookingState {
  location: string
  setLocation: (v: string) => void
  dates: DateRange
  setDates: (d: DateRange) => void
  petWeight: PetWeight
  setPetWeight: (w: PetWeight) => void
  canSearch: boolean
  handleSearch: () => void
  pricing: PriceSummary | null
}

const BookingContext = createContext<BookingState | null>(null)

export function BookingProvider({
  children,
  onSearch,
  hideLocation = false,
}: {
  children: React.ReactNode
  onSearch?: (params: BookingSearchParams) => void
  hideLocation?: boolean
}) {
  const [location, setLocation] = useState('')
  const [dates, setDates] = useState<DateRange>({ from: null, to: null })
  const [petWeight, setPetWeight] = useState<PetWeight>({ tier: 0 })

  const canSearch = useMemo(() => {
    if (hideLocation) return Boolean(dates.from && dates.to)
    return Boolean(location && dates.from && dates.to)
  }, [hideLocation, location, dates])

  const pricing = useMemo<PriceSummary | null>(() => {
    if (!dates.from || !dates.to) return null
    return calculatePricing(dates.from, dates.to, petWeight.tier)
  }, [dates.from, dates.to, petWeight.tier])

  const handleSearch = useCallback(() => {
    if (!canSearch) return
    onSearch?.({ location, dates, petWeight })
  }, [canSearch, onSearch, location, dates, petWeight])

  const value = useMemo(
    () => ({
      location,
      setLocation,
      dates,
      setDates,
      petWeight,
      setPetWeight,
      canSearch,
      handleSearch,
      pricing,
    }),
    [location, dates, petWeight, canSearch, handleSearch, pricing],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBookingContext() {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBookingContext must be used within a BookingProvider')
  }
  return ctx
}
