import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/post/utils'
import { baseUrl } from 'app/sitemap'
import { SeriesNavigation } from 'app/components/CustomComponents/SeriesNavigation'
import { extractTocFromMdx } from 'app/post/utils'
import DemoPdfBox from '../../components/CustomComponents/DemoPdfBox'
import Giscus from 'app/components/CustomComponents/Giscus'
// import { TocSidebar } from 'app/components/CustomComponents/ToCSiderbar'

export async function generateStaticParams() {
 let posts = getBlogPosts()

 return posts.map((post) => ({
  slug: post.slug,
 }))
}

export function generateMetadata({ params }) {
 let post = getBlogPosts().find((post) => post.slug === params.slug)
 if (!post) {
  return
 }

 let {
  title,
  publishedAt: publishedTime,
  summary: description,
  image,
 } = post.metadata
 let ogImage = image
  ? image
  : `${baseUrl}/og?title=${encodeURIComponent(title)}`

 return {
  title,
  description,
  openGraph: {
   title,
   description,
   type: 'article',
   publishedTime,
   url: `${baseUrl}/blog/${post.slug}`,
   images: [
    {
     url: ogImage,
    },
   ],
  },
  twitter: {
   card: 'summary_large_image',
   title,
   description,
   images: [ogImage],
  },
 }
}

export default function Blog({ params }) {
 let post = getBlogPosts().find((post) => post.slug === params.slug)

 if (!post) {
  notFound()
 }

 // 목차 데이터 추출
 //  const toc = extractTocFromMdx(post.content)
 //  console.log(toc, 'toc')

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <div className="post-layout">
    <div className="post-content">
     <div className="post-main">
      <section>
       {/* JSON-LD */}
       <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
         __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.metadata.title,
          datePublished: post.metadata.publishedAt,
          dateModified: post.metadata.publishedAt,
          description: post.metadata.summary,
          image: post.metadata.image
           ? `${baseUrl}${post.metadata.image}`
           : `/og?title=${encodeURIComponent(post.metadata.title)}`,
          url: `${baseUrl}/blog/${post.slug}`,
          author: {
           '@type': 'Person',
           name: 'Stoic Park',
          },
         }),
        }}
       />
       <h1 className="title font-bold text-4xl md:text-5xl tracking-tight mb-6 text-black dark:text-white">
        {post.metadata.title}
       </h1>
       {/* ToC Sidebar */}
       {/* {toc.length > 0 && <TocSidebar toc={toc} />} */}

       {/* post content */}
       <div className="flex items-center mb-8 text-gray-600 dark:text-gray-400">
        <span className="text-sm">Stoic Park</span>
        <span className="mx-2">·</span>
        <time className="text-sm" dateTime={post.metadata.publishedAt}>
         {formatDate(post.metadata.publishedAt)}
        </time>
       </div>

       <article className="prose dark:prose-invert max-w-none prose-lg">
        <SeriesNavigation post={post} />
        <CustomMDX source={post.content} components={{ DemoPdfBox }} />
        <Giscus />
       </article>
      </section>
     </div>
    </div>
   </div>
  </div>
 )
}
