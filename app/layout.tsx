import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { themeControl } from '../utils/themeControl'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'blog, stoic-park',
    template: '%s | blog, stoic-park',
  },
  description: 'blog, stoic-park.',
  openGraph: {
    title: 'blog, stoic-park',
    description: 'blog, stoic-park',
    url: baseUrl,
    siteName: 'stoic-park blog',
    locale: 'en_US',
    type: 'website',
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
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black h-full',
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: `(${themeControl.toString()})()` }}
        />
      </head>
      <body className="antialiased min-h-screen max-w-3xl mx-4 lg:mx-auto flex flex-col h-full">
        <main className="flex flex-col flex-1 px-2 md:px-0">
          <div className="relative w-full h-12 mb-8">
            <div className="absolute inset-0 blur-xl opacity-50"></div>
            <div className="relative z-10 w-full h-full"></div>
          </div>
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
