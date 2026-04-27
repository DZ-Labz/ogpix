import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ogpix-delta.vercel.app'

export const metadata: Metadata = {
  title: 'OGPix – Beautiful OG Image Generator',
  description: 'Generate stunning Open Graph images for your website in seconds. Pick a template, customize, and download.',
  openGraph: {
    title: 'OGPix – Beautiful OG Image Generator',
    description: 'Pick a template, customize, download. Works with any framework.',
    url: APP_URL,
    siteName: 'OGPix',
    images: [
      {
        url: `${APP_URL}/api/og?template=generic&title=OGPix&subtitle=Beautiful+OG+Image+Generator&theme=dark`,
        width: 1200,
        height: 630,
        alt: 'OGPix',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OGPix – Beautiful OG Image Generator',
    description: 'Pick a template, customize, download. Works with any framework.',
    images: [`${APP_URL}/api/og?template=generic&title=OGPix&subtitle=Beautiful+OG+Image+Generator&theme=dark`],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
