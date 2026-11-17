/**
 * @jest-environment node
 */
import fs from 'fs'
import path from 'path'

// Stoic Park 디자인 토큰 밖의 색·모서리를 막는다. 새 색이 필요하면 global.css 토큰으로 추가.
const FORBIDDEN_CLASS =
 /\b(?:[a-z-]+:)*(?:(?:text|bg|border|divide|ring|from|to|via)-(?:neutral|gray|blue)-\d{2,3}|text-black|bg-white|rounded-(?:sm|md|lg|xl|2xl))\b/
// global.css에서 토큰 정의(--*) 밖의 하드코딩 색
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(/

// 이유가 있는 예외만
const ALLOW = new Set([
 'app/og/route.tsx', // 이미지 생성(Satori)이라 CSS 변수를 못 씀
])

function walk(dir: string): string[] {
 return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p)
  return /\.(tsx|css)$/.test(e.name) ? [p] : []
 })
}

describe('design tokens', () => {
 const root = process.cwd()
 const files = walk(path.join(root, 'app'))
  .map((f) => path.relative(root, f))
  .filter((f) => !ALLOW.has(f))

 it('uses no off-token color or radius classes', () => {
  const hits = files.flatMap((f) =>
   fs
    .readFileSync(f, 'utf-8')
    .split('\n')
    .flatMap((line, i) => {
     const m = line.match(FORBIDDEN_CLASS)
     return m ? [`${f}:${i + 1} ${m[0]}`] : []
    }),
  )
  expect(hits).toEqual([])
 })

 it('keeps raw colors in global.css inside token definitions', () => {
  const hits = fs
   .readFileSync('app/global.css', 'utf-8')
   .split('\n')
   .flatMap((line, i) =>
    RAW_COLOR.test(line) && !/^\s*--/.test(line)
     ? [`app/global.css:${i + 1} ${line.trim()}`]
     : [],
   )
  expect(hits).toEqual([])
 })
})
