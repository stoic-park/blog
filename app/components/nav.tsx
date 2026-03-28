'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeSwitch } from './themeSwitch'

// 개발 환경에서만 서재 탭 표시
const getNavItems = () => {
 const baseItems = {
  '/post': {
   name: 'Post',
  },
  '/about': {
   name: 'About',
  },
 }

 // 환경 변수 디버깅
 //  console.log('NODE_ENV:', process.env.NODE_ENV)
 //  console.log('NEXT_PUBLIC_SHOW_BOOKS:', process.env.NEXT_PUBLIC_SHOW_BOOKS)

 // 개발 환경에서만 Books 탭 표시
 if (process.env.NODE_ENV === 'development') {
  return {
   ...baseItems,
   '/books': {
    name: 'Books',
   },
  }
 }

 //  console.log('Books 탭이 숨겨집니다 (프로덕션 환경)')
 return baseItems
}

export function Navbar() {
 const pathname = usePathname()

 return (
  <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
   <div className="flex justify-between items-center px-4 sm:px-8 h-16 max-w-4xl mx-auto w-full">
    <Link href="/" className="font-headline font-bold tracking-tighter text-primary text-xl active:scale-95 transition-transform">
     Stoic Park
    </Link>
    <div className="flex items-center gap-2">
     <nav className="flex flex-row items-center" id="nav" aria-label="내비게이션">
      <div className="flex flex-row">
       {Object.entries(getNavItems()).map(([path, { name }]) => {
        const isActive = pathname === path
        return (
         <Link
          key={path}
          href={path}
          aria-current={isActive ? 'page' : undefined}
          className={`
            px-3 py-1 mx-1 text-sm font-headline font-medium tracking-tight transition-colors
            ${isActive
              ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
              : 'text-on-surface/60 hover:text-primary'
            }
          `}
         >
          {name}
         </Link>
        )
       })}
      </div>
     </nav>
     <ThemeSwitch />
    </div>
   </div>
  </header>
 )
}
