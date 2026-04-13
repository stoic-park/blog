import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from 'app/lib/posts'

type PostCardProps = {
  slug: string
  metadata: {
    title: string
    publishedAt: string
    summary: string
    image?: string
    tags?: string[]
    readingTime?: string
  }
}

export function PostCard({ slug, metadata }: PostCardProps) {
  return (
    <Link
      href={`/post/${slug}`}
      className="group grid md:grid-cols-12 gap-8 md:gap-12 items-stretch"
    >
      <div
        className={`relative md:col-span-4 w-full aspect-[1200/630] md:aspect-auto md:h-full overflow-hidden ${
          metadata.image ? 'bg-surface-low' : 'bg-[#1c1b1b]'
        }`}
      >
        {metadata.image ? (
          <Image
            src={metadata.image}
            alt={metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <img
            src={`/og?title=${encodeURIComponent(metadata.title)}${metadata.tags?.length ? `&tags=${encodeURIComponent(metadata.tags.join(','))}` : ''}`}
            alt={metadata.title}
            className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
          />
        )}
      </div>
      <div className="md:col-span-8">
        <div className="flex items-center flex-wrap gap-4 mb-3">
          {metadata.tags?.[0] && (
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">
              {metadata.tags[0].replace('#', '')}
            </span>
          )}
          <time className="text-[10px] tracking-widest uppercase text-on-surface-variant">
            {formatDate(metadata.publishedAt, false)}
          </time>
          {metadata.readingTime && (
            <span className="text-[10px] tracking-widest uppercase text-on-surface-variant">
              {metadata.readingTime}
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">
          {metadata.title}
        </h2>
        <p className="text-on-surface-variant leading-relaxed mb-6">
          {metadata.summary}
        </p>
        <span className="text-sm font-bold border-b-2 border-primary pb-0.5 group-hover:border-transparent transition-all">
          읽기 →
        </span>
      </div>
    </Link>
  )
}
