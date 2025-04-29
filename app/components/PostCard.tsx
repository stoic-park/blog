import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from 'app/post/utils'

type PostCardProps = {
 slug: string
 metadata: {
  title: string
  publishedAt: string
  summary: string
  image?: string
  readingTime?: string
 }
}

export function PostCard({ slug, metadata }: PostCardProps) {
 return (
  <Link
   href={`/post/${slug}`}
   className="flex bg-white dark:bg-neutral-900 rounded-xl overflow-hidden hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
  >
   {metadata.image && (
    <div className="relative w-72 h-48">
     <Image
      src={metadata.image}
      alt={metadata.title}
      fill
      className="object-cover"
     />
    </div>
   )}
   <div className="flex flex-col p-6 flex-1">
    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
     {metadata.title}
    </h2>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
     {metadata.summary}
    </p>
    <div className="mt-auto flex items-center text-sm text-neutral-600 dark:text-neutral-400">
     <span>{formatDate(metadata.publishedAt, false)}</span>
     <span className="mx-2">·</span>
     <span>{metadata.readingTime}</span>
    </div>
   </div>
  </Link>
 )
}
