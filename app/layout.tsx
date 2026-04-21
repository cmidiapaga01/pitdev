import * as React from 'react'
import type { Metadata, Viewport } from 'next'
import { Nunito, Fredoka } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: true,
  variable: '--font-nunito',
  fallback: ['system-ui', 'arial'],
})

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-fredoka',
  fallback: ['Comic Sans MS', 'cursive'],
})

const baseUrl = 'https://pitpetstore.com.br'

export const metadata: Metadata = {
  metadataBase: new globalThis.URL(baseUrl),
  title: {
    default: 'PitPet Store — Hotel e Creche para Cães',
    template: '%s | PitPet Store',
  },
  description:
    'PitPet Store — Hotel, creche e banho & tosa para o seu melhor amigo. Cuidado humanizado, 24h por dia, desde 2019.',
  keywords: [
    'hotel para cães',
    'creche para cães',
    'banho e tosa',
    'hotel cachorro',
    'pitpet',
    'hospedagem pet',
    'daycare cão',
  ],
  authors: [{ name: 'PitPet Store', url: baseUrl }],
  creator: 'PitPet Store',
  publisher: 'PitPet Store',
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'PitPet Store — Hotel e Creche para Cães',
    description: 'Hotel, creche e banho & tosa para o seu melhor amigo. Cuidado humanizado 24h.',
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName: 'PitPet Store',
    images: [
      {
        url: `${baseUrl}/assets/images/hero-1.jpg`,
        width: 1200,
        height: 630,
        alt: 'PitPet Store — Hotel para Cães',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitPet Store — Hotel e Creche para Cães',
    description: 'Hotel, creche e banho & tosa para o seu melhor amigo.',
    images: [`${baseUrl}/assets/images/hero-1.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f07070',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fredoka.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  )
}
