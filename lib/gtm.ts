// Universal tracking utilities for GTM / GA4 / Meta Pixel / CAPI

import { EVENTS } from './events'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

/**
 * Generate unique event ID (important for Meta deduplication)
 */
const generateEventId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'evt_' + Math.random().toString(36).substring(2) + Date.now()
}

type GtmEventData = Record<string, unknown> & {
  event_id?: string
}

/**
 * Push event to dataLayer
 */
export const gtmEvent = (eventName: string, eventData?: GtmEventData) => {
  if (typeof window === 'undefined') return

  const providedEventId = typeof eventData?.event_id === 'string' ? eventData.event_id : undefined
  const eventId = providedEventId || generateEventId()

  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({
    event: eventName,
    event_name: eventName,
    event_id: eventId,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    ...eventData,
  })

  return eventId
}

/**
 * Track WhatsApp click
 */
export const trackWhatsAppClick = (
  context:
    | string
    | {
        source: string
        hotelName?: string
        event_id?: string
        ctaLabel?: string
      },
) => {
  const source = typeof context === 'string' ? context : context.source
  const hotelName = typeof context === 'string' ? undefined : context.hotelName
  const eventId = typeof context === 'string' ? undefined : context.event_id
  const ctaLabel = typeof context === 'string' ? undefined : context.ctaLabel

  return gtmEvent(EVENTS.WHATSAPP_CLICK, {
    source,
    location: source,
    cta_label: ctaLabel,
    hotel_name: hotelName,
    funnel_stage: 'intent',
    event_id: eventId,
  })
}

export const trackBookingCtaClick = (context: {
  source: string
  ctaLabel: string
  hasDates: boolean
  hasGuests: boolean
  location?: string
}) => {
  return gtmEvent(EVENTS.BOOKING_CTA_CLICK, {
    source: context.source,
    cta_label: context.ctaLabel,
    has_dates: context.hasDates,
    has_guests: context.hasGuests,
    location: context.location,
    funnel_stage: 'intent',
  })
}

export const trackCalendarOpen = (context: {
  triggerType: 'initial' | 'applied'
  hasDates: boolean
}) => {
  return gtmEvent(EVENTS.CALENDAR_OPEN, {
    trigger_type: context.triggerType,
    has_dates: context.hasDates,
    funnel_stage: 'consideration',
  })
}

export const trackCalendarApply = (context: { hasDates: boolean; daysCount: number }) => {
  return gtmEvent(EVENTS.CALENDAR_APPLY, {
    has_dates: context.hasDates,
    days_count: context.daysCount,
    funnel_stage: 'intent',
  })
}

export const trackGuestsInteraction = (context: {
  action:
    | 'room_add'
    | 'room_remove'
    | 'adults_increase'
    | 'adults_decrease'
    | 'children_increase'
    | 'children_decrease'
  rooms: number
  adults: number
  children: number
}) => {
  return gtmEvent(EVENTS.GUESTS_INTERACTION, {
    action: context.action,
    rooms: context.rooms,
    adults: context.adults,
    children: context.children,
    funnel_stage: 'consideration',
  })
}

export const trackRedirectWhatsAppView = (context: {
  source: string
  hotel?: string
  entrada?: string
  saida?: string
}) => {
  return gtmEvent(EVENTS.REDIRECT_WHATSAPP_VIEW, {
    source: context.source,
    hotel_name: context.hotel,
    entrada: context.entrada,
    saida: context.saida,
    funnel_stage: 'conversion',
  })
}

/**
 * Track form submit
 */
export const trackFormSubmit = (formName: string, formData?: Record<string, unknown>) => {
  gtmEvent(EVENTS.FORM_SUBMIT, {
    form_name: formName,
    funnel_stage: 'conversion',
    ...formData,
  })
}

/**
 * Track hotel view
 */
export const trackHotelView = (hotelName: string, hotelUrl: string) => {
  gtmEvent(EVENTS.HOTEL_VIEW, {
    hotel_name: hotelName,
    hotel_url: hotelUrl,
    funnel_stage: 'consideration',
  })
}

/**
 * Track search interaction
 */
export const trackSearch = (location?: string, dates?: unknown, guests?: number) => {
  gtmEvent(EVENTS.SEARCH_INTERACTION, {
    location,
    dates,
    guests,
    funnel_stage: 'intent',
  })
}

/**
 * Track SPA page view
 */
export const trackPageView = (url: string, title: string) => {
  gtmEvent(EVENTS.PAGE_VIEW, {
    page_path: url,
    page_title: title,
  })
}

export { generateEventId }
