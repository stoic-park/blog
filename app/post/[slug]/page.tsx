import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import Link from 'next/link'
import {
 CATEGORY_LABELS,
 GROUP_LABELS,
 formatDate,
 getBlogPosts,
 groupOf,
} from 'app/lib/posts'
import { GROUP_ACCENT_TEXT } from 'app/components/PostCard'
import { baseUrl } from 'app/sitemap'
import { SeriesNavigation } from 'app/components/CustomComponents/SeriesNavigation'
import { extractTocFromMdx } from 'app/lib/posts'
import dynamic from 'next/dynamic'
const DemoPdfBox = dynamic(
 () => import('../../components/CustomComponents/DemoPdfBox'),
 { ssr: false },
)
import Giscus from 'app/components/CustomComponents/Giscus'
import { TocSidebar } from 'app/components/CustomComponents/ToCSiderbar'

interface PostPageProps {
 params: { slug: string }
}

export async function generateStaticParams() {
 let posts = getBlogPosts()

 return posts.map((post) => ({
  slug: post.slug,
 }))
}

export function generateMetadata({ params }: PostPageProps) {
 let post = getBlogPosts().find((post) => post.slug === params.slug)
 if (!post) {
  return
 }

 let {
  title,
  publishedAt: publishedTime,
  summary: description,
  image,
  tags,
 } = post.metadata
 let ogImage = image
  ? image
  : `${baseUrl}/og?title=${encodeURIComponent(title)}${tags?.length ? `&tags=${encodeURIComponent(tags.join(','))}` : ''}`

 return {
  title,
  description,
  openGraph: {
   title,
   description,
   type: 'article',
   publishedTime,
   url: `${baseUrl}/post/${post.slug}`,
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

export default function Blog({ params }: PostPageProps) {
 let post = getBlogPosts().find((post) => post.slug === params.slug)

 if (!post) {
  notFound()
 }

 // 목차 데이터 추출
 const toc = extractTocFromMdx(post.content)

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
           ? post.metadata.image.startsWith('http')
             ? post.metadata.image
             : `${baseUrl}${post.metadata.image}`
           : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
          url: `${baseUrl}/post/${post.slug}`,
          author: {
           '@type': 'Person',
           name: 'Stoic Park',
          },
         }),
        }}
       />
       <nav
        aria-label="분류"
        className={`mb-4 text-[10px] font-bold tracking-[0.2em] uppercase ${GROUP_ACCENT_TEXT[groupOf(post.metadata.category)]}`}
       >
        <Link href={`/${groupOf(post.metadata.category)}`} className="hover:underline underline-offset-4">
         {GROUP_LABELS[groupOf(post.metadata.category)]}
        </Link>
        <span className="mx-2 text-outline" aria-hidden="true">/</span>
        <Link
         href={`/${groupOf(post.metadata.category)}?category=${post.metadata.category}`}
         className="hover:underline underline-offset-4"
        >
         {CATEGORY_LABELS[post.metadata.category]}
        </Link>
       </nav>
       <h1 className="title font-bold text-4xl md:text-5xl tracking-tight mb-6 text-on-surface [text-wrap:balance]">
        {post.metadata.title}
       </h1>
       {/* ToC Sidebar */}
       {toc.length > 0 && <TocSidebar toc={toc} />}

       {/* post content */}
       <div className="flex items-center mb-8 text-on-surface-variant">
        <span className="text-sm">Stoic Park</span>
        <span className="mx-2">·</span>
        <time className="text-sm" dateTime={post.metadata.publishedAt}>
         {formatDate(post.metadata.publishedAt)}
        </time>
       </div>

       <article className="prose">
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
