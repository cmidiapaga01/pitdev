'use client'

import { useState, useEffect } from 'react'
import type { Guests } from '@/types/booking'

interface Room {
  id: number
  adults: number
  children: number
}

interface UseGuestsSelectorProps {
  value: Guests
  onChange: (guests: Guests) => void
}

export function useGuestsSelector({ value, onChange }: UseGuestsSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, adults: value.adults, children: value.children },
  ])

  useEffect(() => {
    const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
    const totalChildren = rooms.reduce((s, r) => s + r.children, 0)
    onChange({ adults: totalAdults, children: totalChildren })
  }, [rooms])

  const addRoom = () => {
    setRooms((prev) => [...prev, { id: Date.now(), adults: 1, children: 0 }])
  }

  const removeRoom = (id: number) => {
    if (rooms.length <= 1) return
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  const update = (id: number, key: 'adults' | 'children', delta: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newValue = r[key] + delta
          if (key === 'adults' && newValue < 1) return r // Adults cannot be less than 1
          if (key === 'children' && newValue < 0) return r // Children cannot be less than 0
          return { ...r, [key]: newValue }
        }
        return r
      }),
    )
  }

  return {
    rooms,
    addRoom,
    removeRoom,
    update,
  }
}
