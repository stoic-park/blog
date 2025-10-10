import './global.css'

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { EnvDebug } from './components/EnvDebug'
import { baseUrl } from './sitemap'
import { themeControl } from '../utils/themeControl'

export const metadata: Metadata = {
 metadataBase: new URL(baseUrl),
 title: {
  default: '박성택 개발 블로그',
  template: '%s | Stoic Park Blog',
 },
 description:
  '박성택의 개발 블로그입니다. 웹 개발, JavaScript, React, Next.js 관련 기술 포스트를 공유합니다.',
 icons: {
  icon: '/favicon/favicon-16x16.png',
  shortcut: '/favicon/favicon-16x16.png',
  apple: '/favicon/apple-touch-icon.png',
 },
 openGraph: {
  title: '박성택 개발 블로그',
  description:
   '박성택의 개발 블로그입니다. 웹 개발, JavaScript, React, Next.js 관련 기술 포스트를 공유합니다.',
  url: baseUrl,
  siteName: '박성택 개발 블로그',
  locale: 'ko_KR',
  type: 'website',
  images: [
   {
    url: `${baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
   },
  ],
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
 keywords: [
  '박성택',
  '박성택 개발 블로그',
  'stoic-park',
  'frontend',
  '프론트엔드',
  '개발 블로그',
  '웹 개발',
  'JavaScript',
  'React',
  'Next.js',
 ],
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
   <body className="antialiased min-h-screen  lg:mx-auto flex flex-col h-full">
    {/* Navbar 컨테이너 */}
    <div className="mx-auto w-full max-w-screen-xxl px-4 sm:px-6 lg:px-8 py-4">
     <Navbar />
    </div>

    {/* 장식용 상단 여백/블러 */}
    <div className="relative w-full h-12 mb-8">
     <div className="absolute inset-0 blur-xl opacity-50"></div>
     <div className="relative z-10 w-full h-full"></div>
    </div>

    <main className="flex flex-col flex-1">
     {/* 전역 컨테이너: 페이지는 이 안에서 각자 최대폭을 추가로 제어 */}
     <div className="mx-auto w-full max-w-screen-xl sm:px-6 lg:px-8 flex-1 flex flex-col">
      {children}
     </div>

     <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-4">
      <Footer />
     </div>
     <Analytics />
     <SpeedInsights />
     <EnvDebug />
    </main>
   </body>
  </html>
 )
}
