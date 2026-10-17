import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { slugify, generateUniqueId } from 'app/lib/posts'
import { CodeBlock } from './CustomComponents/CodeBlock'
import { PreBlock } from './CustomComponents/PreBlock'
import {
 TipCallout,
 NoteCallout,
 WarningCallout,
 ErrorCallout,
 InfoCallout,
} from './CustomComponents/Callout'

function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
 let headers = data.headers.map((header: string, index: number) => (
  <th key={index} className="px-4 py-2 bg-gray-400 text-left font-semibold">
   {header}
  </th>
 ))
 let rows = data.rows.map((row: string[], index: number) => (
  <tr key={index} className="border-b">
   {row.map((cell: string, cellIndex: number) => (
    <td key={cellIndex} className="px-4 py-2">
     {cell}
    </td>
   ))}
  </tr>
 ))

 return (
  <div className="overflow-x-auto mx-auto">
   <div className="min-w-[600px]">
    <table className="mx-auto border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
     <thead>
      <tr>{headers}</tr>
     </thead>
     <tbody>{rows}</tbody>
    </table>
   </div>
  </div>
 )
}

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
 let href = props.href ?? ''

 if (href.startsWith('/')) {
  return (
   <Link href={href} {...props}>
    {props.children}
   </Link>
  )
 }

 if (href.startsWith('#')) {
  return <a {...props} />
 }

 return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: React.ComponentProps<typeof Image>) {
 return (
  <div className="w-full flex justify-center">
   <div
    className={`w-full ${Number(props.width) <= 600 ? 'max-w-[600px]' : ''}`}
   >
    <Image {...props} className="rounded-lg w-full h-auto" />
   </div>
  </div>
 )
}

// 헤딩 children(문자열·인라인 code·링크 등)에서 순수 텍스트 추출 — TOC 텍스트와 일치시키기 위함
export function getNodeText(node: React.ReactNode): string {
 if (node == null || typeof node === 'boolean') return ''
 if (typeof node === 'string' || typeof node === 'number') return String(node)
 if (Array.isArray(node)) return node.map(getNodeText).join('')
 if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
  return getNodeText(node.props.children)
 }
 return ''
}

// ponytail: 중복 헤딩 접미사(-1, -2)는 렌더 순서 = 문서 순서라는 가정에 의존. 어긋나면 rehype 플러그인으로 id 부여
function createHeading(level: number, existingIds: Set<string>) {
 const Heading = ({ children }: { children: React.ReactNode }) => {
  let slug = generateUniqueId(
   slugify(getNodeText(children).trim()),
   existingIds,
  )
  return React.createElement(
   `h${level}`,
   { id: slug },
   [
    React.createElement('a', {
     href: `#${slug}`,
     key: `link-${slug}`,
     className: 'anchor',
    }),
   ],
   children,
  )
 }

 Heading.displayName = `Heading${level}`

 return Heading
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let components: Record<string, React.ComponentType<any>> = {
 Image: RoundedImage,
 a: CustomLink,
 code: CodeBlock,
 pre: PreBlock,
 Tip: TipCallout,
 Note: NoteCallout,
 Warning: WarningCallout,
 Error: ErrorCallout,
 Info: InfoCallout,
 Table,
}

// 렌더마다 새 Set — 페이지 간 id 상태 공유 방지
function createHeadings() {
 const ids = new Set<string>()
 return Object.fromEntries(
  [1, 2, 3, 4, 5, 6].map((level) => [`h${level}`, createHeading(level, ids)]),
 )
}

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
 return (
  <MDXRemote
   {...props}
   components={{
    ...createHeadings(),
    ...components,
    ...(props.components || {}),
   }}
   options={{ blockJS: false }}
  />
 )
}
