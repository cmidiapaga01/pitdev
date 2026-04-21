'use client'

import { BookingProvider } from './BookingContext'
import BookingSearchBar from './BookingSearchBar'
import StickyDatePicker from './StickyDatePicker'

export default function BookingSection({
  hideLocation = true,
}: {
  hideLocation?: boolean
}) {
  return (
    <BookingProvider hideLocation={hideLocation}>
      <StickyDatePicker />
      <BookingSearchBar hideLocation={hideLocation} hotelName="PitPet Store" />
    </BookingProvider>
  )
}
