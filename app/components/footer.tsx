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
            className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            RSS
          </a>
          <Link
            href="https://github.com/stoic-park/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            GitHub
          </Link>
        </div>
        <p className="text-xs tracking-widest uppercase opacity-60">
          © {new Date().getFullYear()} Stoic Park
        </p>
      </div>
    </footer>
  )
}
