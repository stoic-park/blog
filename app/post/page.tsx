import { BlogPosts } from 'app/components/posts'
import { getBlogPosts } from './utils'

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
  )

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Post</h1>
      <div className="flex gap-2 flex-wrap mb-8">
        {allTags.map((tag) => (
          <a
            key={tag}
            href={searchParams.tag === tag ? '/post' : `/post?tag=${tag}`}
            className={`text-sm rounded-sm px-3 py-0.5 transition-colors ${
              searchParams.tag === tag
                ? 'bg-neutral-800 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-800'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {tag}
          </a>
        ))}
      </div>
      <div className="my-8">
        <BlogPosts selectedTag={searchParams.tag} />
      </div>
    </section>
  )
}
