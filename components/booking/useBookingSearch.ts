'use client'

import { useState, useMemo } from 'react'
import type { BookingSearchParams, DateRange, PetWeight } from '@/types/booking'

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
  const [petWeight, setPetWeight] = useState<PetWeight>({ tier: 0 })

  const canSearch = useMemo(() => {
    if (hideLocation) return dates.from && dates.to
    return location && dates.from && dates.to
  }, [hideLocation, location, dates])

  const handleSearch = () => {
    if (!canSearch) return
    onSearch?.({ location, dates, petWeight })
  }

  return {
    location,
    setLocation,
    dates,
    setDates,
    petWeight,
    setPetWeight,
    canSearch,
    handleSearch,
  }
}
