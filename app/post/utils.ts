import fs from 'fs'
import path from 'path'

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

function parseFrontmatter(fileContent: string) {
 let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
 let match = frontmatterRegex.exec(fileContent)
 let frontMatterBlock = match![1]
 let content = fileContent.replace(frontmatterRegex, '').trim()
 let frontMatterLines = frontMatterBlock.trim().split('\n')
 let metadata: Partial<Metadata> = {}
 let currentKey: string | null = null
 let currentObject: any = null

 frontMatterLines.forEach((line) => {
  let trimmedLine = line.trim()
  if (!trimmedLine) return

  // Check if this is a nested object
  if (trimmedLine.endsWith(':') && !trimmedLine.includes(': ')) {
   currentKey = trimmedLine.slice(0, -1).trim()
   currentObject = {}
   metadata[currentKey] = currentObject
   return
  }

  // Handle nested object properties
  if (currentObject && line.startsWith(' ')) {
   let [key, ...valueArr] = trimmedLine.split(': ')
   let value = valueArr.join(': ').trim()
   value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
   currentObject[key.trim()] = isNaN(Number(value)) ? value : Number(value)
   return
  }

  // Reset nested object handling
  currentKey = null
  currentObject = null

  // Handle regular properties
  let [key, ...valueArr] = trimmedLine.split(': ')
  let value = valueArr.join(': ').trim()
  value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes

  if (key.trim() === 'tags') {
   metadata.tags = value.split(',').map((tag) => tag.trim())
  } else {
   metadata[key.trim()] = value
  }
 })

 return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
 return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
 let rawContent = fs.readFileSync(filePath, 'utf-8')
 return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
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

 let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
 let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
 let daysAgo = currentDate.getDate() - targetDate.getDate()

 let formattedDate = ''

 if (yearsAgo > 0) {
  formattedDate = `${yearsAgo}y ago`
 } else if (monthsAgo > 0) {
  formattedDate = `${monthsAgo}mo ago`
 } else if (daysAgo > 0) {
  formattedDate = `${daysAgo}d ago`
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
