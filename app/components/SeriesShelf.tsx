import Link from 'next/link'
import { formatDate, getPostsByGroup, type Group } from 'app/lib/posts'

// 공개 편이 이 수 이상인 시리즈만 선반에 올린다. 1편짜리도 "연재 중"이라는 신호가 되므로 1.
export const SHELF_MIN_POSTS = 1

export function getSeriesInGroup(group: Group) {
 const bySeries = new Map<string, ReturnType<typeof getPostsByGroup>>()
 for (const post of getPostsByGroup(group)) {
  const name = post.metadata.series?.name
  if (!name) continue
  bySeries.set(name, [...(bySeries.get(name) ?? []), post])
 }
 return Array.from(bySeries.entries())
  .filter(([, posts]) => posts.length >= SHELF_MIN_POSTS)
  .map(([name, posts]) => {
   const ordered = [...posts].sort(
    (a, b) => (a.metadata.series?.order || 0) - (b.metadata.series?.order || 0),
   )
   const latest = posts.reduce((a, b) =>
    a.metadata.publishedAt > b.metadata.publishedAt ? a : b,
   )
   return { name, count: posts.length, first: ordered[0], latest }
  })
}

export function SeriesShelf({ group }: { group: Group }) {
 const series = getSeriesInGroup(group)
 if (series.length === 0) return null

 return (
  <section aria-labelledby={`series-${group}`} className="mb-16">
   <h2
    id={`series-${group}`}
    className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4"
   >
    Series
   </h2>
   <ul className="grid gap-4 sm:grid-cols-2">
    {series.map((s) => (
     <li key={s.name}>
      <Link
       href={`/post/${s.first.slug}`}
       className="block h-full border-l-2 border-primary bg-surface-low px-5 py-4 hover:bg-surface-high transition-colors"
      >
       <p className="font-headline font-bold tracking-tight break-keep mb-2">
        {s.name}
       </p>
       <p className="text-xs text-on-surface-variant tabular-nums">
        {s.count}편 · 최근 {formatDate(s.latest.metadata.publishedAt)}
       </p>
      </Link>
     </li>
    ))}
   </ul>
  </section>
 )
}
