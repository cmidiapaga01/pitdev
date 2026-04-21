'use client'

import React from 'react'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { addDays, differenceInCalendarDays, format, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from '@/types/booking'
import { getClimateData, type ClimateIcon } from '@/lib/climate'

export interface ClimateDay {
  key: string
  dayLabel: string
  weekdayShort: string
  icon: ClimateIcon
  temp: number | string
}

interface UseDateRangePickerProps {
  value: DateRange
  onChange: (dates: DateRange) => void
}

export interface Formatters {
  formatCaption: (date: Date) => string
  formatWeekdayName: (date: Date) => string
  formatRangeLabel: (date: Date) => string
  formatWeekRangeLabel: (from: Date, to: Date) => string
}

export function useDateRangePicker({ value, onChange }: UseDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange>({
    from: value.from ?? null,
    to: value.to ?? null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = startOfToday()
  const isApplied = value.from !== null && value.to !== null

  useEffect(() => {
    setDraft({ from: value.from ?? null, to: value.to ?? null })
  }, [value])

  const daysCount = useMemo(() => {
    if (!isApplied || !value.from || !value.to) return 0
    try {
      return differenceInCalendarDays(value.to, value.from) + 1
    } catch {
      return 0
    }
  }, [isApplied, value])

  /**
   * Climate preview (máx 5 dias)
   * Agora usando engine dinâmica determinística
   */
  const climateDays = useMemo((): ClimateDay[] => {
    if (!isApplied || !value.from) return []

    try {
      const count = Math.min(daysCount, 5)

      return Array.from({ length: count }).map((_, i) => {
        const date = addDays(value.from as Date, i)
        const climate = getClimateData(date)

        return {
          key: date.toISOString(),
          dayLabel: format(date, 'd'),
          weekdayShort: format(date, 'EEE', { locale: ptBR }).replace('.', '').toUpperCase(),
          icon: climate.icon,
          temp: climate.tempMax,
        }
      })
    } catch (err) {
      console.error('Error calculating climate days:', err)
      return []
    }
  }, [isApplied, daysCount, value])

  const formatters: Formatters = useMemo(
    () => ({
      formatCaption: (date: Date) => {
        try {
          return format(date, 'MMMM yyyy', { locale: ptBR })
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        } catch {
          return format(date, 'MMMM yyyy')
        }
      },

      formatWeekdayName: (date: Date) => {
        try {
          return format(date, 'EEEEE', { locale: ptBR }).toUpperCase()
        } catch {
          return format(date, 'EEEEE').toUpperCase()
        }
      },

      formatRangeLabel: (date: Date) => {
        try {
          const txt = format(date, 'MMM d', { locale: ptBR })
          return txt.charAt(0).toUpperCase() + txt.slice(1)
        } catch {
          return format(date, 'MMM d')
        }
      },

      formatWeekRangeLabel: (from: Date, to: Date) => {
        try {
          const start = format(from, 'EEEE', { locale: ptBR })
          const end = format(to, 'EEEE', { locale: ptBR })
          const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
          return start === end ? cap(start) : `${cap(start)} à ${cap(end)}`
        } catch {
          return `${format(from, 'EEEE')} à ${format(to, 'EEEE')}`
        }
      },
    }),
    [],
  )

  const handleOpen = useCallback(() => {
    setDraft({ from: value.from ?? null, to: value.to ?? null })
    setIsOpen(true)
    setError(null)
  }, [value])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  const handleApply = useCallback(async () => {
    try {
      setIsLoading(true)
      onChange({ from: draft.from ?? null, to: draft.to ?? null })
      setIsOpen(false)
    } catch (err) {
      setError('Erro ao aplicar datas. Tente novamente.')
      console.error('Date apply error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [draft, onChange])

  const handleClear = useCallback(() => {
    const newDates = { from: null, to: null }
    setDraft(newDates)
    onChange(newDates)
    setIsOpen(false)
  }, [onChange])

  const handleSelect = useCallback((range: { from?: Date; to?: Date } | undefined) => {
    setDraft({ from: range?.from ?? null, to: range?.to ?? null })
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
      if (e.key === 'Enter' && isOpen && draft.from && draft.to) {
        handleApply()
      }
    },
    [isOpen, draft, handleClose, handleApply],
  )

  return {
    isOpen,
    draft,
    today,
    isApplied,
    isLoading,
    error,
    daysCount,
    climateDays,
    formatters,
    handleOpen,
    handleClose,
    handleApply,
    handleClear,
    handleSelect,
    handleKeyDown,
  }
}
