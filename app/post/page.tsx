import { BlogPosts } from 'app/components/posts'
import { getBlogPosts } from 'app/lib/posts'
import Link from 'next/link'

export const metadata = {
 title: 'Post',
 description: 'post.',
}

export default function Page({
 searchParams,
}: {
 searchParams: { tag?: string }
}) {
 const allPosts = getBlogPosts()
 const allTags = Array.from(
  new Set(allPosts.flatMap((post) => post.metadata.tags || [])),
 ).map((tag) => tag.replace('#', ''))

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-12">Post</h1>
    <div className="flex gap-3 flex-wrap mb-8">
     <Link
      href="/post"
      className={`px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
       !searchParams.tag
        ? 'bg-primary text-on-primary'
        : 'bg-surface-high text-on-surface-variant hover:bg-secondary-container'
      }`}
     >
      All
     </Link>
     {allTags.map((tag) => (
      <Link
       key={tag}
       href={
        searchParams.tag === tag
         ? '/post'
         : `/post?tag=${encodeURIComponent('#' + tag)}`
       }
       className={`px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
        searchParams.tag === '#' + tag
         ? 'bg-primary text-on-primary'
         : 'bg-surface-high text-on-surface-variant hover:bg-secondary-container'
       }`}
      >
       {tag}
      </Link>
     ))}
    </div>
    <div className="my-8">
     <BlogPosts selectedTag={searchParams.tag} />
    </div>
   </section>
  </div>
 )
}
