'use client'

import { useEffect, useState } from 'react'
import AnimatedBookingBar from './AnimatedBookingBar'
import styles from './StickyBookingBar.module.css'

interface Props {
  hideLocation?: boolean
  hotelName?: string
}

export default function StickyBookingBar({ hideLocation = false, hotelName }: Props) {
  const [showSticky, setShowSticky] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
      // If the bottom of the original bar is above the top of the viewport, show sticky
      setShowSticky(rect.bottom < 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  if (!showSticky || !isMobile) return null

  return (
    <div className={styles.stickyBookingBar}>
      <AnimatedBookingBar hideLocation={hideLocation} hotelName={hotelName} />
    </div>
  )
}
