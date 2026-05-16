import type { Metadata } from 'next'
import { Fraunces, DM_Mono, DM_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Aletheia',
  description: 'Índice de integridad institucional · América Latina',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmMono.variable} ${dmSans.variable} h-full`}>
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  )
}
