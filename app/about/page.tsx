import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'About',
  description: 'About me.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        About me.
      </h1>
    </section>
  )
}
