import { Metadata } from 'next'
import Link from 'next/link'
import { getBooks } from 'app/lib/books'

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
     <p className="text-on-surface-variant mb-8">
      개발 관련 서적을 읽고 정리한 내용들입니다. 각 서적의 핵심 내용과 개인적인
      인사이트를 짧게 정리해두었습니다.
     </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
     {books.map((book) => (
      <Link
       key={book.slug}
       href={`/books/${book.slug}`}
       className="group block p-6 border border-outline-variant hover:border-outline transition-colors"
      >
       <div className="space-y-2">
        <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
         {book.title}
        </h2>
        <p className="text-sm text-on-surface-variant">
         {book.author}
        </p>
        <p className="text-sm text-outline">
         {book.date}
        </p>
        {book.excerpt && (
         <p className="text-sm text-on-surface-variant line-clamp-2">
          {book.excerpt}
         </p>
        )}
       </div>
      </Link>
     ))}
    </div>

    {books.length === 0 && (
     <div className="text-center py-12">
      <p className="text-on-surface-variant">
       아직 정리된 서적이 없습니다.
      </p>
     </div>
    )}
   </section>
  </div>
 )
}
