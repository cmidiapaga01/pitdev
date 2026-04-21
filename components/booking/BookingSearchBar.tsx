'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import LocationSelect from './LocationSelect'
import DateRangePicker from './DateRangePicker'
import PetWeightSelector from './PetWeightSelector'
import PriceBreakdown from './PriceBreakdown'
import { useBookingContext } from './BookingContext'
import { trackBookingCtaClick, trackWhatsAppClick } from '@/lib/gtm'
import { buildWhatsAppRedirectUrl } from '@/lib/whatsapp-redirect'
import styles from './BookingSearchBar.module.css'

interface Props {
  hideLocation?: boolean
  isLoading?: boolean
  hotelName?: string
}

export default function BookingSearchBar({
  hideLocation = false,
  isLoading = false,
  hotelName,
}: Props) {
  const router = useRouter()
  const { location, setLocation, dates, setDates, petWeight, setPetWeight, canSearch, handleSearch, pricing } =
    useBookingContext()

  // Nudge attention to pet weight selector after dates are selected
  const [highlightWeight, setHighlightWeight] = useState(false)

  useEffect(() => {
    const hasDates = Boolean(dates.from && dates.to)
    setHighlightWeight(hasDates)
  }, [dates.from, dates.to])

  // Scroll main DRP into view if dates are selected from sticky picker and DRP is off-screen
  useEffect(() => {
    if (dates.from && dates.to) {
      const mainDRP = document.querySelector('[aria-label="Buscar hospedagem"]')
      if (mainDRP) {
        const rect = mainDRP.getBoundingClientRect()
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          mainDRP.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }, [dates.from, dates.to])

  return (
    <section className={styles.booking} role="search" aria-label="Buscar hospedagem">
      <div className={styles.bookingInner}>
        <div className={styles.booking__container}>
          <div
            className={`${styles.booking__grid} ${
              hideLocation ? styles['booking__grid--no-location'] : ''
            }`}
          >
            {/* LOCATION */}
            {!hideLocation && (
              <div className={styles.booking__field}>
                <label htmlFor="location" className="sr-only">
                  Localização
                </label>
                <LocationSelect value={location} onChange={setLocation} />
              </div>
            )}

            {/* CHECK-IN / CHECK-OUT DATES */}
            <div className={styles.booking__field}>
              <p className={styles.booking__dateHint}>
                {dates.from && dates.to ? 'Datas selecionadas ✅' : 'Clique e selecione suas datas'}
              </p>
              <DateRangePicker value={dates} onChange={setDates} />
            </div>

            {/* PET WEIGHT */}
            <div className={styles.booking__field}>
              <PetWeightSelector value={petWeight} onChange={setPetWeight} highlight={highlightWeight} />
            </div>

            {/* SEARCH BUTTON */}
            <div className={styles.booking__actions}>
              <button
                id="booking-whatsapp-btn"
                type="button"
                onClick={() => {
                  if (dates.from && !dates.to) {
                    alert('Please select your check out date')
                    return
                  }
                  if (dates.from && dates.to && dates.from.getTime() === dates.to.getTime()) {
                    alert('Please select your check out date')
                    return
                  }
                  const eventId = trackBookingCtaClick({
                    source: 'booking_search',
                    ctaLabel: isLoading ? 'Buscando...' : 'Receber cotação',
                    hasDates: Boolean(dates.from && dates.to),
                    hasGuests: true,
                    location: location || hotelName || undefined,
                  })

                  trackWhatsAppClick({
                    source: 'booking_search',
                    hotelName: location || hotelName || undefined,
                    event_id: eventId,
                    ctaLabel: isLoading ? 'Buscando...' : 'Receber cotação',
                  })

                  handleSearch()
                  router.push(
                    buildWhatsAppRedirectUrl({
                      hotel: location || hotelName || undefined,
                      entrada: dates.from ? format(dates.from, 'dd/MM/yyyy') : undefined,
                      saida: dates.to ? format(dates.to, 'dd/MM/yyyy') : undefined,
                      message: pricing
                        ? `Porte: ${pricing.weightLabel} (${pricing.weightDetail}) — Total estimado: R$${pricing.subtotal}`
                        : undefined,
                      src: 'booking_search',
                      eventId,
                    }),
                  )
                }}
                disabled={!canSearch || isLoading}
                className={styles.booking__button}
                aria-label="Buscar hospedagem disponível"
                data-testid="search-button"
              >
                {isLoading ? 'Buscando...' : 'Receber cotação'}
              </button>
            </div>
          </div>

          {/* REAL-TIME PRICE BREAKDOWN */}
          {pricing && <PriceBreakdown pricing={pricing} />}
        </div>
      </div>
    </section>
  )
}
