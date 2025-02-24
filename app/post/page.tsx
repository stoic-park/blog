import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Post',
  description: 'post.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Post</h1>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
