export const EVENTS = {
  PAGE_VIEW: 'page_view',
  HOTEL_VIEW: 'hotel_view',
  SEARCH_INTERACTION: 'search_interaction',
  FORM_SUBMIT: 'form_submit',
  WHATSAPP_CLICK: 'whatsapp_click',
  BOOKING_CTA_CLICK: 'booking_cta_click',
  CALENDAR_OPEN: 'calendar_open',
  CALENDAR_APPLY: 'calendar_apply',
  GUESTS_INTERACTION: 'guests_interaction',
  REDIRECT_WHATSAPP_VIEW: 'redirect_whatsapp_view',
  PACKAGE_CLICK: 'package_click',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]
