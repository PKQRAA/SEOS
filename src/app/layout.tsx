import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEOS - Open Source Keyword Research Platform',
  description: 'Free and open source keyword research tool for SEO professionals and content creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
