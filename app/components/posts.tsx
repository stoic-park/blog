import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/post/utils'

export function BlogPosts({ selectedTag }: { selectedTag?: string }) {
  let allBlogs = getBlogPosts()

  // 태그 필터링 추가
  if (selectedTag) {
    allBlogs = allBlogs.filter((post) =>
      post.metadata.tags?.includes(selectedTag),
    )
  }

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
            className="flex flex-col space-y-1 mb-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg p-2 px-4 transition-colors"
            href={`/post/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <div className="flex flex-row items-center">
                <p className="text-neutral-600 dark:text-neutral-400 w-48 shrink-0 tabular-nums mr-4">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {post.metadata.title}
                </p>
              </div>
              {/* {post.metadata.tags && (
                <div className="flex gap-2 mt-2 ml-52">
                  {post.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )} */}
            </div>
          </Link>
        ))}
    </div>
  )
}
