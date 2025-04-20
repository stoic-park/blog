import Link from 'next/link'
import { getBlogPosts } from 'app/post/utils'

type Post = {
 metadata: {
  title: string
  publishedAt: string
  summary: string
  image?: string
  series?: {
   name: string
   order: number
  }
 }
 slug: string
 content: string
}

export function SeriesNavigation({ post }: { post: Post }) {
 if (!post.metadata.series) return null

 const allPosts = getBlogPosts()
 const seriesPosts = allPosts
  .filter((p) => p.metadata.series?.name === post.metadata.series?.name)
  .sort(
   (a, b) => (a.metadata.series?.order || 0) - (b.metadata.series?.order || 0),
  )

 const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug)
 const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
 const nextPost =
  currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

 return (
  <div className="my-8 p-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
   <h2 className="text-2xl font-bold mb-10 text-neutral-900 dark:text-neutral-100">
    {post.metadata.series.name}
   </h2>
   <div className="flex flex-col space-y-3">
    {seriesPosts.map((p, index) => (
     <Link
      key={p.slug}
      href={`/post/${p.slug}`}
      className={`flex items-center no-underline ${
       p.slug === post.slug
        ? 'text-blue-500 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded'
        : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100'
      }`}
      style={{ textDecoration: 'none' }}
     >
      <span className="mr-3">{index + 1}.</span>
      {p.metadata.title}
     </Link>
    ))}
   </div>
   <div className="flex items-center justify-center gap-8 mt-6">
    {prevPost ? (
     <Link
      href={`/post/${prevPost.slug}`}
      className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all"
     >
      ←
     </Link>
    ) : (
     <span className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-300 dark:text-neutral-600 cursor-not-allowed opacity-50">
      ←
     </span>
    )}
    <span className="text-sm text-neutral-500 dark:text-neutral-400">
     {currentIndex + 1}/{seriesPosts.length}
    </span>
    {nextPost ? (
     <Link
      href={`/post/${nextPost.slug}`}
      className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all"
     >
      →
     </Link>
    ) : (
     <span className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-300 dark:text-neutral-600 cursor-not-allowed opacity-50">
      →
     </span>
    )}
   </div>
  </div>
 )
}
