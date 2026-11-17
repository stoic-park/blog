/**
 * @jest-environment node
 */
import { GET } from 'app/rss/route'

jest.mock('app/lib/posts', () => ({
 ...jest.requireActual('app/lib/posts'),
 getBlogPosts: () => [
  {
   slug: 'a-and-b',
   content: '',
   metadata: {
    title: 'A & B <C>',
    summary: `"quoted" 'single'`,
    publishedAt: '2026-11-17',
    category: 'frontend',
   },
  },
 ],
}))

describe('GET /rss', () => {
 it('escapes XML special characters in item fields', async () => {
  const body = await (await GET()).text()
  expect(body).toContain('<title>A &amp; B &lt;C&gt;</title>')
  expect(body).toContain(
   '<description>&quot;quoted&quot; &apos;single&apos;</description>',
  )
  expect(body).not.toContain('A & B <C>')
  expect(body).toContain('<category>Dev/프론트엔드</category>')
 })

 it('serves an RSS content type', async () => {
  const res = await GET()
  expect(res.headers.get('Content-Type')).toBe(
   'application/rss+xml; charset=utf-8',
  )
 })
})
