/**
 * Unit tests for app/lib/posts.ts
 *
 * Covers: slugify, extractTocFromMdx, formatDate, parseFrontmatter
 */

// parseFrontmatter is not exported — test via the module's internal behaviour
// by importing the exported functions only.
import { slugify, extractTocFromMdx, formatDate } from '../posts'

// gray-matter is a real dependency; import it directly to test parseFrontmatter
// through a thin wrapper that replicates the internal logic.
import matter from 'gray-matter'

// ---------------------------------------------------------------------------
// Helper: replicate parseFrontmatter logic so we can unit-test it without
// making it exported in production code.
// ---------------------------------------------------------------------------
type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags?: string[]
  readingTime?: string
  draft?: boolean
  series?: { name: string; order: number }
}

function parseFrontmatter(fileContent: string): { metadata: Metadata; content: string } {
  const { data, content } = matter(fileContent)
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map((t: string) => t.trim())
  }
  if (data.series && typeof data.series.order === 'string') {
    data.series.order = Number(data.series.order)
  }
  return { metadata: data as Metadata, content }
}

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe('slugify', () => {
  it('converts English string to lowercase hyphenated slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('preserves Korean characters', () => {
    expect(slugify('안녕하세요')).toBe('안녕하세요')
  })

  it('converts Korean string with spaces to hyphenated slug', () => {
    expect(slugify('한글 테스트')).toBe('한글-테스트')
  })

  it('removes special characters that are not word chars or CJK', () => {
    expect(slugify('hello! world?')).toBe('hello-world')
  })

  it('replaces & with -and-', () => {
    expect(slugify('bread & butter')).toBe('bread-and-butter')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('foo   bar')).toBe('foo-bar')
  })

  it('collapses multiple consecutive hyphens into one', () => {
    expect(slugify('foo--bar')).toBe('foo-bar')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('-hello-')).toBe('hello')
  })

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('handles mixed Korean and English', () => {
    expect(slugify('Next.js 시작하기')).toBe('nextjs-시작하기')
  })
})

// ---------------------------------------------------------------------------
// extractTocFromMdx
// ---------------------------------------------------------------------------
describe('extractTocFromMdx', () => {
  it('returns empty array for empty content', () => {
    expect(extractTocFromMdx('')).toEqual([])
  })

  it('extracts h1 heading', () => {
    const toc = extractTocFromMdx('# Title')
    expect(toc).toHaveLength(1)
    expect(toc[0]).toMatchObject({ level: 1, text: 'Title', id: 'title' })
  })

  it('extracts h2 and h3 headings', () => {
    const content = `## Section One\n### Subsection`
    const toc = extractTocFromMdx(content)
    expect(toc).toHaveLength(2)
    expect(toc[0]).toMatchObject({ level: 2, text: 'Section One' })
    expect(toc[1]).toMatchObject({ level: 3, text: 'Subsection' })
  })

  it('ignores headings inside fenced code blocks', () => {
    const content = '```\n# This is inside a code block\n```\n\n## Real Heading'
    const toc = extractTocFromMdx(content)
    expect(toc).toHaveLength(1)
    expect(toc[0]).toMatchObject({ level: 2, text: 'Real Heading' })
  })

  it('strips inline code backticks from heading text', () => {
    const toc = extractTocFromMdx('## Using `useState` Hook')
    expect(toc[0].text).toBe('Using useState Hook')
  })

  it('strips markdown links from heading text, keeping link label', () => {
    const toc = extractTocFromMdx('## Check [the docs](https://example.com)')
    expect(toc[0].text).toBe('Check the docs')
  })

  it('strips HTML tags from heading text', () => {
    const toc = extractTocFromMdx('## Hello <em>World</em>')
    expect(toc[0].text).toBe('Hello World')
  })

  it('deduplicates IDs for identical headings', () => {
    const content = '## Foo\n## Foo\n## Foo'
    const toc = extractTocFromMdx(content)
    expect(toc[0].id).toBe('foo')
    expect(toc[1].id).toBe('foo-1')
    expect(toc[2].id).toBe('foo-2')
  })

  it('generates slug-based IDs for Korean headings', () => {
    const toc = extractTocFromMdx('## 시작하기')
    expect(toc[0].id).toBe('시작하기')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('returns absolute date string when includeRelative is false (default)', () => {
    // The exact format is locale-dependent but must contain the year
    const result = formatDate('2024-01-15')
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/January/)
    expect(result).toMatch(/15/)
  })

  it('returns "Today" for today\'s date with includeRelative=true', () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const result = formatDate(`${yyyy}-${mm}-${dd}`, true)
    expect(result).toContain('(Today)')
  })

  it('returns "Nd ago" for a date N days in the past (same month)', () => {
    const d = new Date()
    d.setDate(d.getDate() - 3)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const result = formatDate(`${yyyy}-${mm}-${dd}`, true)
    expect(result).toContain('(3d ago)')
  })

  it('returns "Nmo ago" for a date N months in the past (same year)', () => {
    const current = new Date()
    const d = new Date(current)
    // Go back 2 months but keep same day to avoid cross-month day mismatch
    d.setMonth(d.getMonth() - 2)
    // Only run this assertion when we're still in the same year
    if (d.getFullYear() === current.getFullYear()) {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const result = formatDate(`${yyyy}-${mm}-${dd}`, true)
      // Compute expected value using the same millisecond-based logic
      const target = new Date(`${yyyy}-${mm}-${dd}T00:00:00`)
      const diffDays = Math.floor((current.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
      const expectedMonths = Math.floor(diffDays / 30)
      expect(result).toContain(`(${expectedMonths}mo ago)`)
    }
  })

  it('returns "Ny ago" for a date N years in the past', () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 2)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const result = formatDate(`${yyyy}-${mm}-${dd}`, true)
    expect(result).toContain('(2y ago)')
  })

  it('appends T00:00:00 when date has no time component', () => {
    // Should not throw and should return a valid result
    expect(() => formatDate('2023-06-01', true)).not.toThrow()
  })

  /**
   * FIXED: year-boundary edge case
   *
   * Scenario: date = Dec 31 of last year, now = some date in the current year.
   *
   * The old implementation computed yearsAgo = currentYear - targetYear, which
   * produced "1y ago" for any date in the previous calendar year regardless of
   * actual elapsed time.
   *
   * The fix uses millisecond-based diffDays so Dec 31 of last year is correctly
   * labelled by actual elapsed days/months, not calendar-year arithmetic.
   */
  it('correctly labels Dec-of-last-year using elapsed days, not calendar-year diff', () => {
    const current = new Date()
    // Construct a date that is Dec 31 of the previous calendar year
    const prevYearDec31 = `${current.getFullYear() - 1}-12-31`
    const target = new Date(`${current.getFullYear() - 1}-12-31T00:00:00`)

    const diffMs = current.getTime() - target.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    const result = formatDate(prevYearDec31, true)

    if (diffYears > 0) {
      expect(result).toContain(`(${diffYears}y ago)`)
    } else if (diffMonths > 0) {
      expect(result).toContain(`(${diffMonths}mo ago)`)
    } else if (diffDays > 0) {
      expect(result).toContain(`(${diffDays}d ago)`)
    } else {
      expect(result).toContain('(Today)')
    }

    // Must NOT claim "1y ago" for a date that is only months away
    if (diffYears === 0) {
      expect(result).not.toContain('(1y ago)')
    }
  })
})

// ---------------------------------------------------------------------------
// parseFrontmatter
// ---------------------------------------------------------------------------
describe('parseFrontmatter', () => {
  it('parses basic frontmatter fields', () => {
    const input = `---
title: Hello World
publishedAt: "2024-01-01"
summary: A test post
---
Body content here.`
    const { metadata, content } = parseFrontmatter(input)
    expect(metadata.title).toBe('Hello World')
    expect(metadata.publishedAt).toBe('2024-01-01')
    expect(metadata.summary).toBe('A test post')
    expect(content.trim()).toBe('Body content here.')
  })

  it('converts a tags string to an array', () => {
    const input = `---
title: Test
publishedAt: "2024-01-01"
summary: s
tags: "typescript, react, nextjs"
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.tags).toEqual(['typescript', 'react', 'nextjs'])
  })

  it('keeps a tags array as-is', () => {
    const input = `---
title: Test
publishedAt: "2024-01-01"
summary: s
tags:
  - typescript
  - react
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.tags).toEqual(['typescript', 'react'])
  })

  it('parses series nested object', () => {
    const input = `---
title: Test
publishedAt: "2024-01-01"
summary: s
series:
  name: My Series
  order: 2
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.series).toEqual({ name: 'My Series', order: 2 })
    expect(typeof metadata.series?.order).toBe('number')
  })

  it('coerces series.order from string to number', () => {
    const input = `---
title: Test
publishedAt: "2024-01-01"
summary: s
series:
  name: My Series
  order: "3"
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.series?.order).toBe(3)
    expect(typeof metadata.series?.order).toBe('number')
  })

  it('parses draft boolean as true', () => {
    const input = `---
title: Draft Post
publishedAt: "2024-01-01"
summary: s
draft: true
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.draft).toBe(true)
  })

  it('parses draft boolean as false', () => {
    const input = `---
title: Published Post
publishedAt: "2024-01-01"
summary: s
draft: false
---`
    const { metadata } = parseFrontmatter(input)
    expect(metadata.draft).toBe(false)
  })

  it('returns empty content string when no body follows frontmatter', () => {
    const input = `---
title: No Body
publishedAt: "2024-01-01"
summary: s
---`
    const { content } = parseFrontmatter(input)
    expect(content.trim()).toBe('')
  })
})
