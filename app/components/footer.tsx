import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-32 py-12 bg-surface-low">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 max-w-4xl mx-auto gap-6">
        <span className="font-headline font-bold text-primary tracking-tighter text-lg">
          Stoic Park.
        </span>
        <div className="flex gap-8">
          <a
            href="/rss"
            className="text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            RSS
          </a>
          <Link
            href="https://github.com/stoic-park/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            GitHub
          </Link>
        </div>
        <p className="text-xs tracking-widest uppercase text-on-surface-variant">
          © {new Date().getFullYear()} Stoic Park
        </p>
      </div>
    </footer>
  )
}
