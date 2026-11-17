import Link from 'next/link'
import { getBlogPosts } from 'app/lib/posts'

type Post = {
 metadata: {
  title: string
  series?: {
   name: string
   order: number
  }
 }
 slug: string
}

export function SeriesNavigation({ post }: { post: Post }) {
 const series = post.metadata.series
 if (!series) return null

 const seriesPosts = getBlogPosts()
  .filter((p) => p.metadata.series?.name === series.name)
  .sort((a, b) => (a.metadata.series?.order || 0) - (b.metadata.series?.order || 0))

 const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug)
 const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
 const nextPost =
  currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

 return (
  <aside
   aria-label="시리즈"
   className="not-prose my-10 border-l-2 border-primary bg-surface-low px-6 py-6"
  >
   <div className="flex items-baseline justify-between gap-4 mb-4">
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">
     Series
    </div>
    <div className="text-[10px] font-bold tracking-[0.2em] text-outline tabular-nums">
     {currentIndex + 1} / {seriesPosts.length}
    </div>
   </div>
   <div className="font-headline font-bold text-lg tracking-tight mb-4 break-keep">
    {series.name}
   </div>
   <ol className={`space-y-2 ${prevPost || nextPost ? 'mb-6' : ''}`}>
    {seriesPosts.map((p, index) => {
     const current = p.slug === post.slug
     return (
      <li key={p.slug} className="flex gap-3 text-sm break-keep">
       <span className="tabular-nums text-outline">{index + 1}.</span>
       {current ? (
        <span aria-current="page" className="font-bold text-on-surface">
         {p.metadata.title}
        </span>
       ) : (
        <Link
         href={`/post/${p.slug}`}
         className="text-on-surface-variant hover:text-primary transition-colors"
        >
         {p.metadata.title}
        </Link>
       )}
      </li>
     )
    })}
   </ol>
   {(prevPost || nextPost) && (
    <div className="flex justify-between gap-4 text-sm border-t border-outline-variant pt-4">
     {prevPost ? (
      <Link
       href={`/post/${prevPost.slug}`}
       rel="prev"
       className="text-on-surface-variant hover:text-primary transition-colors"
      >
       ← 이전 편
      </Link>
     ) : (
      <span />
     )}
     {nextPost && (
      <Link
       href={`/post/${nextPost.slug}`}
       rel="next"
       className="text-on-surface-variant hover:text-primary transition-colors"
      >
       다음 편 →
      </Link>
     )}
    </div>
   )}
  </aside>
 )
}
