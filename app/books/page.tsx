import { Metadata } from 'next'
import Link from 'next/link'
import { getBooks } from './utils'

export const metadata: Metadata = {
 title: '서재 | 개발 서적 리뷰',
 description: '개발 관련 서적을 읽고 정리한 내용들입니다.',
}

export default async function BooksPage() {
 const books = await getBooks()

 return (
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl">
   <section>
    <h1 className="font-bold text-2xl mb-8 tracking-tighter">서재</h1>
    <div className="prose prose-neutral dark:prose-invert">
     <p className="text-neutral-600 dark:text-neutral-400 mb-8">
      개발 관련 서적을 읽고 정리한 내용들입니다. 각 서적의 핵심 내용과 개인적인
      인사이트를 짧게 정리해두었습니다.
     </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     {books.map((book) => (
      <Link
       key={book.slug}
       href={`/books/${book.slug}`}
       className="group block p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
      >
       <div className="space-y-2">
        <h2 className="font-semibold text-lg group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
         {book.title}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
         {book.author}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
         {book.date}
        </p>
        {book.excerpt && (
         <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {book.excerpt}
         </p>
        )}
       </div>
      </Link>
     ))}
    </div>

    {books.length === 0 && (
     <div className="text-center py-12">
      <p className="text-neutral-600 dark:text-neutral-400">
       아직 정리된 서적이 없습니다.
      </p>
     </div>
    )}
   </section>
  </div>
 )
}
