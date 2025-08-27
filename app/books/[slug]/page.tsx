import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBookBySlug, getBooks } from '../utils'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface BookPageProps {
 params: {
  slug: string
 }
}

export async function generateMetadata({
 params,
}: BookPageProps): Promise<Metadata> {
 const book = await getBookBySlug(params.slug)

 if (!book) {
  return {
   title: '서적을 찾을 수 없습니다',
  }
 }

 return {
  title: `${book.title} | 서재`,
  description: book.excerpt || `${book.title} 서적 리뷰입니다.`,
 }
}

export async function generateStaticParams() {
 const books = await getBooks()
 return books.map((book) => ({
  slug: book.slug,
 }))
}

export default async function BookPage({ params }: BookPageProps) {
 const book = await getBookBySlug(params.slug)

 if (!book) {
  notFound()
 }

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <div className="mb-8">
     <h1 className="font-bold text-3xl mb-4 tracking-tighter">{book.title}</h1>
     <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
      <span>저자: {book.author}</span>
      <span>•</span>
      <span>{book.date}</span>
     </div>
    </div>

    <div className="prose prose-neutral dark:prose-invert max-w-none">
     <MDXRemote source={book.content} />
    </div>
   </section>
  </div>
 )
}
