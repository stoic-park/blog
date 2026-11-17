import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BlogPosts } from 'app/components/posts'
import {
 CATEGORIES,
 GROUPS,
 GROUP_LABELS,
 groupOf,
 type Category,
} from 'app/lib/posts'

export const metadata = {
 title: 'Archive',
 description: '전체 글 목록.',
}

// /post는 전체 아카이브(태그 링크가 여기로 옴). 카테고리 필터는 그룹 페이지로 보낸다.
export default function Page({
 searchParams,
}: {
 searchParams: { category?: string; tag?: string }
}) {
 const { category, tag } = searchParams
 if (category === 'domain') redirect('/domain')
 if (CATEGORIES.includes(category as Category)) {
  redirect(`/${groupOf(category as Category)}?category=${category}`)
 }

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-4">
     Archive
    </h1>
    <p className="text-on-surface-variant mb-12">
     {tag ? (
      <>
       <span className="text-on-surface">{tag}</span> 태그가 붙은 글
      </>
     ) : (
      '모든 글을 최신순으로 모았습니다.'
     )}
    </p>
    <nav aria-label="그룹" className="flex gap-3 flex-wrap mb-8">
     {GROUPS.map((g) => (
      <Link
       key={g}
       href={`/${g}`}
       className="px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-surface-high text-on-surface-variant hover:bg-secondary-container transition-colors"
      >
       {GROUP_LABELS[g]} →
      </Link>
     ))}
    </nav>
    <div className="my-8">
     <BlogPosts selectedTag={tag} />
    </div>
   </section>
  </div>
 )
}
