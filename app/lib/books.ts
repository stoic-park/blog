import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const booksDirectory = path.join(process.cwd(), 'posts/books')

export interface Book {
 slug: string
 title: string
 author: string
 date: string
 excerpt?: string
 content: string
}

export async function getBooks(): Promise<Book[]> {
 // books 디렉토리가 존재하지 않으면 빈 배열 반환
 if (!fs.existsSync(booksDirectory)) {
  return []
 }

 const fileNames = fs.readdirSync(booksDirectory)
 const allBooksData = fileNames
  .filter((fileName) => fileName.endsWith('.mdx'))
  .map((fileName) => {
   const slug = fileName.replace(/\.mdx$/, '')
   const fullPath = path.join(booksDirectory, fileName)
   const fileContents = fs.readFileSync(fullPath, 'utf8')
   const { data, content } = matter(fileContents)

   return {
    slug,
    title: data.title || slug,
    author: data.author || 'Unknown',
    date: data.date || '',
    excerpt: data.excerpt || '',
    content,
   }
  })

 // 날짜순으로 정렬 (최신순)
 return allBooksData.sort((a, b) => {
  if (a.date < b.date) return 1
  if (a.date > b.date) return -1
  return 0
 })
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
 try {
  const fullPath = path.join(booksDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
   slug,
   title: data.title || slug,
   author: data.author || 'Unknown',
   date: data.date || '',
   excerpt: data.excerpt || '',
   content,
  }
 } catch (error) {
  return null
 }
}
