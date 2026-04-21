'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    __ag26GtmLoaded?: boolean
  }
}

const GTM_ID = 'GTM-NW3M7RQT'

function loadTagManager() {
  if (window.__ag26GtmLoaded) {
    return
  }

  window.__ag26GtmLoaded = true
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  script.id = 'gtm-script'
  document.head.appendChild(script)
}

export default function DeferredTagManager() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    const controller = new AbortController()
    const options = {
      passive: true,
      signal: controller.signal,
    }

    const handleInteraction = () => {
      controller.abort()
      loadTagManager()
    }

    window.addEventListener('pointerdown', handleInteraction, options)
    window.addEventListener('keydown', handleInteraction, options)
    window.addEventListener('touchstart', handleInteraction, options)

    return () => controller.abort()
  }, [])

  return null
}
