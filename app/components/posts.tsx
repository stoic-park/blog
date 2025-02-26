import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/post/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg p-2 transition-colors"
            href={`/post/${post.slug}`}
          >
            <div className="w-full flex flex-row items-center">
              <p className="text-neutral-600 dark:text-neutral-400 w-50 shrink-0 tabular-nums mr-4">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-800">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
