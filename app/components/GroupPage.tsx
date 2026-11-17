import Link from 'next/link'
import { BlogPosts } from 'app/components/posts'
import { SeriesShelf } from 'app/components/SeriesShelf'
import {
 CATEGORY_LABELS,
 GROUP_LABELS,
 getCategoriesInGroup,
 type Category,
 type Group,
} from 'app/lib/posts'

const GROUP_INTRO: Record<Group, string> = {
 dev: '프론트엔드 개발, AI 도구 활용, 회고를 기록합니다.',
 domain:
  '반도체 공정과 설비 데이터처럼, 일하면서 익힌 업무 도메인 지식을 정리합니다.',
}

const chipClass = (active: boolean) =>
 `px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${
  active
   ? 'bg-primary text-on-primary'
   : 'bg-surface-high text-on-surface-variant hover:bg-secondary-container'
 }`

export function GroupPage({
 group,
 searchParams,
}: {
 group: Group
 searchParams: { category?: string; tag?: string }
}) {
 const categories = getCategoriesInGroup(group)
 const selected = categories.find((c) => c === searchParams.category) as
  | Category
  | undefined
 const base = `/${group}`

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-4">
     {GROUP_LABELS[group]}
    </h1>
    <p className="text-on-surface-variant mb-12 break-keep">
     {GROUP_INTRO[group]}
    </p>
    {!selected && !searchParams.tag && <SeriesShelf group={group} />}
    {categories.length > 1 && (
     <nav aria-label="카테고리" className="flex gap-3 flex-wrap mb-8">
      <Link
       href={base}
       aria-current={!selected ? 'page' : undefined}
       className={chipClass(!selected)}
      >
       All
      </Link>
      {categories.map((c) => (
       <Link
        key={c}
        href={selected === c ? base : `${base}?category=${c}`}
        aria-current={selected === c ? 'page' : undefined}
        className={chipClass(selected === c)}
       >
        {CATEGORY_LABELS[c]}
       </Link>
      ))}
     </nav>
    )}
    <div className="my-8">
     <BlogPosts
      group={group}
      selectedCategory={selected}
      selectedTag={searchParams.tag}
     />
    </div>
   </section>
  </div>
 )
}
