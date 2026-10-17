import { BlogPosts } from 'app/components/posts'
import { CATEGORIES, CATEGORY_LABELS, getBlogPosts } from 'app/lib/posts'
import Link from 'next/link'

export const metadata = {
 title: 'Post',
 description: 'post.',
}

const chipClass = (active: boolean) =>
 `px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
  active
   ? 'bg-primary text-on-primary'
   : 'bg-surface-high text-on-surface-variant hover:bg-secondary-container'
 }`

export default function Page({
 searchParams,
}: {
 searchParams: { category?: string; tag?: string }
}) {
 const allPosts = getBlogPosts()
 // 글이 있는 카테고리만 탭으로 노출 (빈 탭 방지)
 const categories = CATEGORIES.filter((c) =>
  allPosts.some((post) => post.metadata.category === c),
 )
 const selected = searchParams.category

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-12">
     Post
    </h1>
    <div className="flex gap-3 flex-wrap mb-8">
     <Link href="/post" className={chipClass(!selected && !searchParams.tag)}>
      All
     </Link>
     {categories.map((c) => (
      <Link
       key={c}
       href={selected === c ? '/post' : `/post?category=${c}`}
       className={chipClass(selected === c)}
      >
       {CATEGORY_LABELS[c]}
      </Link>
     ))}
    </div>
    <div className="my-8">
     <BlogPosts selectedCategory={selected} selectedTag={searchParams.tag} />
    </div>
   </section>
  </div>
 )
}
