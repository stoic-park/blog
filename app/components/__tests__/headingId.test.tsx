import React from 'react'
import { getNodeText } from '../mdx'
import { extractTocFromMdx, slugify, generateUniqueId } from 'app/lib/posts'

jest.mock('next-mdx-remote/rsc', () => ({ MDXRemote: () => null }))
jest.mock('sugar-high', () => ({ highlight: (s: string) => s }))

describe('heading id matches TOC id', () => {
 it('handles inline code and duplicate headings', () => {
  const mdx =
   '### 가설 1: `display:none`이 scrollTop을 날린다\n\n## 정리\n\n## 정리'
  const tocIds = extractTocFromMdx(mdx).map((t) => t.id)

  // MDX가 헤딩 children으로 넘기는 형태
  const rendered = [
   ['가설 1: ', <code key="c">display:none</code>, '이 scrollTop을 날린다'],
   '정리',
   '정리',
  ]
  const ids = new Set<string>()
  const renderedIds = rendered.map((children) =>
   generateUniqueId(slugify(getNodeText(children).trim()), ids),
  )

  expect(renderedIds).toEqual(tocIds)
  expect(renderedIds[0]).not.toContain('object')
  expect(renderedIds[2]).toBe('정리-1')
 })
})
