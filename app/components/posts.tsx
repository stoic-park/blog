import { getBlogPosts } from 'app/lib/posts'
import { PostCard } from './PostCard'

export function BlogPosts({ selectedTag }: { selectedTag?: string }) {
 let allBlogs = getBlogPosts()

 if (selectedTag) {
  allBlogs = allBlogs.filter((post) =>
   post.metadata.tags?.includes(selectedTag),
  )
 }

 return (
  <div className="flex flex-col space-y-16 md:space-y-24">
   {allBlogs
    .sort((a, b) => {
     if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
     }
     return 1
    })
    .map((post) => (
     <PostCard key={post.slug} slug={post.slug} metadata={post.metadata} />
    ))}
  </div>
 )
}
