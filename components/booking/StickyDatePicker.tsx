'use client'

import { useEffect, useState } from 'react'
import DateRangePicker from './DateRangePicker'
import styles from './StickyDatePicker.module.css'
import { useBookingContext } from './BookingContext'

export default function StickyDatePicker() {
  const [showSticky, setShowSticky] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { dates, setDates } = useBookingContext()

  // Scroll to main BookingSearchBar when dates are selected from sticky picker
  useEffect(() => {
    if (dates.from && dates.to && dates.from.getTime() !== dates.to.getTime()) {
      const mainDRP = document.querySelector('[aria-label="Buscar hospedagem"]')
      if (mainDRP) {
        const rect = mainDRP.getBoundingClientRect()
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          mainDRP.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }, [dates.from, dates.to])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setShowSticky(false)
      return
    }
    const bookingBar = document.querySelector('[aria-label="Buscar hospedagem"]')
    const handleScroll = () => {
      if (!bookingBar) return
      const rect = bookingBar.getBoundingClientRect()
      setShowSticky(rect.bottom < 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  if (!showSticky || !isMobile) return null

  return (
    <div className={styles.stickyDatePicker}>
      <DateRangePicker value={dates} onChange={setDates} onlyCheckInTrigger />
    </div>
  )
}
