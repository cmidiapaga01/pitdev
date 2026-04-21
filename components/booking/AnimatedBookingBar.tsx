'use client'

import { BookingProvider } from './BookingContext'
import BookingSearchBar from './BookingSearchBar'
import StickyDatePicker from './StickyDatePicker'
import styles from './AnimatedBookingBar.module.css'

interface Props {
  hideLocation?: boolean
  hotelName?: string
}

export default function AnimatedBookingBar({ hideLocation = false, hotelName }: Props) {
  return (
    <BookingProvider hideLocation={hideLocation}>
      <StickyDatePicker />
      <div className={styles.wrapper}>
        <BookingSearchBar hideLocation={hideLocation} hotelName={hotelName} />
      </div>
    </BookingProvider>
  )
}
