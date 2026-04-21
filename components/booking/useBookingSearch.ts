'use client'

import { useState, useMemo } from 'react'
import type { BookingSearchParams, DateRange, Guests } from '@/types/booking'

interface UseBookingSearchProps {
  onSearch?: (params: BookingSearchParams) => void
  hideLocation?: boolean
}

export function useBookingSearch({ onSearch, hideLocation }: UseBookingSearchProps) {
  const [location, setLocation] = useState('')
  const [dates, setDates] = useState<DateRange>({
    from: null,
    to: null,
  })
  const [guests, setGuests] = useState<Guests>({ adults: 1, children: 0 })

  const canSearch = useMemo(() => {
    if (hideLocation) return dates.from && dates.to
    return location && dates.from && dates.to
  }, [hideLocation, location, dates])

  const handleSearch = () => {
    if (!canSearch) return
    onSearch?.({ location, dates, guests })
  }

  return {
    location,
    setLocation,
    dates,
    setDates,
    guests,
    setGuests,
    canSearch,
    handleSearch,
  }
}
