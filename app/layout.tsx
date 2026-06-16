import type { Metadata } from 'next'
import {Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import './ui/globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Infusio — Control Panel',
  description:
    'Panel de control unificado para gestionar tus apps de Shipping, Payments, Buyer y Seller.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ClerkProvider>
          {children}
          {process.env.NODE_ENV === 'production'} 
          {/* && <Analytics /> */}
        </ClerkProvider>
      </body>
    </html>
  )
}
