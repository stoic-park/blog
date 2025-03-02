'use client'

import Link from 'next/link'
// import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { ThemeSwitch } from './themeSwitch'

const navItems = {
  '/': {
    name: 'Home',
  },
  '/post': {
    name: 'Post',
  },
  '/about': {
    name: 'About',
  },
}

export function Navbar() {
  // const { pathname } = useRouter() // 현재 경로 가져오기
  const pathname = usePathname() // App router 를 사용하는 버전에서는 page 기반의 useRouter를 쓰지 않아!

  return (
    <aside className="mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg">Stoic Park</div>
          <div className="flex flex-row items-center">
            <nav
              className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
              id="nav"
              aria-label="내비게이션"
            >
              <div className="flex flex-row space-x-0 pr-10">
                {Object.entries(navItems).map(([path, { name }]) => {
                  const isActive = pathname === path // 현재 경로 확인

                  return (
                    <Link
                      key={path}
                      href={path}
                      className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                      aria-current={isActive ? 'page' : undefined} // 현재 페이지라면 aria-current 적용
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
      </div>
    </aside>
  )
}
