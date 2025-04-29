import fs from 'fs'
import path from 'path'

type Metadata = {
 title: string
 publishedAt: string
 summary: string
 image?: string
 tags?: string[]
 readingTime?: string
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
 return getMDXData(path.join(process.cwd(), 'posts'))
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
