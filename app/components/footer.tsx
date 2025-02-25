import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mb-16">
      {/* <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">rss</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/vercel/next.js"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">github</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://vercel.com/templates/next.js/portfolio-starter-kit"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">view source</p>
          </a>
        </li>
      </ul> */}
      <div className="lg:sticky lg:top-20 flex justify-between items-center">
        <p className="mt-8 text-neutral-600 dark:text-neutral-300">
          Copyright © stoic-park
        </p>
        <p className="mt-8 text-neutral-600 dark:text-neutral-300">
          <Link
            key={'sourcecode'}
            href={'https://github.com/stoic-park/blog'}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center"
          >
            소스코드
          </Link>
        </p>
      </div>
    </footer>
  )
}
