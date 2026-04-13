import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Metadata = {
 title: string
 publishedAt: string
 summary: string
 image?: string
 tags?: string[]
 readingTime?: string
 draft?: boolean
 series?: {
  name: string
  order: number
 }
}

function extractFirstImage(content: string): string | undefined {
  // 코드 블록 제외
  const withoutCode = content.replace(/```[\s\S]*?```/g, '')
  // Markdown 이미지: ![alt](url)
  const md = withoutCode.match(/!\[[^\]]*\]\(([^)\s]+)/)
  if (md) return md[1]
  // JSX Image/img: src="..." or src='...'
  const jsx = withoutCode.match(/<(?:Image|img)[^>]*\s+src=["']([^"']+)["']/)
  if (jsx) return jsx[1]
  return undefined
}

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent)
  // tags가 문자열이면 배열로 변환
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map((t: string) => t.trim())
  }
  // series.order 숫자 보장
  if (data.series && typeof data.series.order === 'string') {
    data.series.order = Number(data.series.order)
  }
  // frontmatter에 image가 없으면 본문 첫 이미지 사용
  if (!data.image) {
    const firstImage = extractFirstImage(content)
    if (firstImage) data.image = firstImage
  }
  return { metadata: data as Metadata, content }
}

function getMDXFiles(dir: string) {
 return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
 let rawContent = fs.readFileSync(filePath, 'utf-8')
 return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
 let mdxFiles = getMDXFiles(dir)
 return mdxFiles.map((file) => {
  let { metadata, content } = readMDXFile(path.join(dir, file))
  let slug = path.basename(file, path.extname(file))

  return {
   metadata,
   slug,
   content,
  }
 })
}

export function getBlogPosts() {
 const posts = getMDXData(path.join(process.cwd(), 'posts'))

 // 프로덕션 환경에서는 draft: true인 포스트를 필터링
 if (process.env.NODE_ENV === 'production') {
  return posts.filter((post) => !post.metadata.draft)
 }

 return posts
}

export function formatDate(date: string, includeRelative = false) {
 let currentDate = new Date()
 if (!date.includes('T')) {
  date = `${date}T00:00:00`
 }
 let targetDate = new Date(date)

 const diffMs = currentDate.getTime() - targetDate.getTime()
 const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
 const diffMonths = Math.floor(diffDays / 30)
 const diffYears = Math.floor(diffDays / 365)

 let formattedDate = ''

 if (diffYears > 0) {
  formattedDate = `${diffYears}y ago`
 } else if (diffMonths > 0) {
  formattedDate = `${diffMonths}mo ago`
 } else if (diffDays > 0) {
  formattedDate = `${diffDays}d ago`
 } else {
  formattedDate = 'Today'
 }

 let fullDate = targetDate.toLocaleString('en-us', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
 })

 if (!includeRelative) {
  return fullDate
 }

 return `${fullDate} (${formattedDate})`
}

interface TocItem {
 level: number
 text: string
 id: string
}

// 개선된 slugify 함수
export function slugify(str: string) {
 return str
  .toString()
  .toLowerCase()
  .trim()
  .replace(/[\s\u3000]+/g, '-') // 일반 공백과 전각 공백 처리
  .replace(/&/g, '-and-')
  .replace(/[^\w\-\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff가-힣]+/g, '') // 한중일 문자 허용
  .replace(/\-\-+/g, '-')
  .replace(/^-+|-+$/g, '') // 시작과 끝의 하이픈 제거
}

// ID 중복 방지를 위한 함수
function generateUniqueId(baseId: string, existingIds: Set<string>): string {
 let uniqueId = baseId
 let counter = 1

 while (existingIds.has(uniqueId)) {
  uniqueId = `${baseId}-${counter}`
  counter++
 }

 existingIds.add(uniqueId)
 return uniqueId
}

// 개선된 TOC 추출 함수
export function extractTocFromMdx(mdxContent: string): TocItem[] {
 const headingRegex = /^(#{1,6})\s+(.*)$/gm
 const toc: TocItem[] = []
 const existingIds = new Set<string>()
 let match

 // 코드 블록 내용 임시 제거
 const contentWithoutCodeBlocks = mdxContent.replace(/```[\s\S]*?```/g, '')

 while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
  const level = match[1].length
  const text = match[2]
   .trim()
   .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Markdown 링크 텍스트만 추출
   .replace(/`([^`]+)`/g, '$1') // 인라인 코드 텍스트만 추출
   .replace(/<[^>]+>/g, '') // HTML 태그 제거

  const baseId = slugify(text)
  const id = generateUniqueId(baseId, existingIds)

  toc.push({ level, text, id })
 }

 return toc
}
