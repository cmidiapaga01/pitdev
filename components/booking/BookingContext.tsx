'use client'

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import type { DateRange, Guests, BookingSearchParams } from '@/types/booking'

interface BookingState {
  location: string
  setLocation: (v: string) => void
  dates: DateRange
  setDates: (d: DateRange) => void
  guests: Guests
  setGuests: (g: Guests) => void
  canSearch: boolean
  handleSearch: () => void
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
  const [guests, setGuests] = useState<Guests>({ adults: 1, children: 0 })

  const canSearch = useMemo(() => {
    if (hideLocation) return Boolean(dates.from && dates.to)
    return Boolean(location && dates.from && dates.to)
  }, [hideLocation, location, dates])

  const handleSearch = useCallback(() => {
    if (!canSearch) return
    onSearch?.({ location, dates, guests })
  }, [canSearch, onSearch, location, dates, guests])

  const value = useMemo(
    () => ({
      location,
      setLocation,
      dates,
      setDates,
      guests,
      setGuests,
      canSearch,
      handleSearch,
    }),
    [location, dates, guests, canSearch, handleSearch],
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
