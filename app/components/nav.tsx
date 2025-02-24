import Link from 'next/link'
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
  return (
    <aside className="mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg">Stoic Park</div>
          <div className="flex flex-row items-center">
            <nav
              className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
              id="nav"
            >
              <div className="flex flex-row space-x-0 pr-10">
                {Object.entries(navItems).map(([path, { name }]) => {
                  return (
                    <Link
                      key={path}
                      href={path}
                      className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
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
