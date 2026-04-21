interface WhatsAppRedirectOptions {
  phone?: string
  hotel?: string
  entrada?: string
  saida?: string
  adults?: number
  children?: number
  message?: string
  src?: string
  eventId?: string
}

export function buildWhatsAppRedirectUrl({
  phone,
  hotel,
  entrada,
  saida,
  adults,
  children,
  message,
  src,
  eventId,
}: WhatsAppRedirectOptions = {}) {
  const params = new URLSearchParams()

  if (phone) {
    params.set('phone', phone)
  }

  if (hotel) {
    params.set('hotel', hotel)
  }

  if (entrada) {
    params.set('entrada', entrada)
  }

  if (saida) {
    params.set('saida', saida)
  }

  if (typeof adults === 'number') {
    params.set('adults', String(adults))
  }

  if (typeof children === 'number') {
    params.set('children', String(children))
  }

  if (message) {
    params.set('message', message)
  }

  if (src) {
    params.set('src', src)
  }

  if (eventId) {
    params.set('event_id', eventId)
  }

  const query = params.toString()
  return query ? `/redirect?${query}` : '/redirect'
}
