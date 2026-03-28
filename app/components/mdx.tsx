import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { slugify } from 'app/lib/posts'
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
  <div className="w-full overflow-x-auto">
   <div className="min-w-[600px] w-full">
    <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
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
   <div className={`w-full ${Number(props.width) <= 600 ? 'max-w-[600px]' : ''}`}>
    <Image {...props} className="rounded-lg w-full h-auto" />
   </div>
  </div>
 )
}

function createHeading(level: number) {
 const Heading = ({ children }: { children: React.ReactNode }) => {
  let slug = slugify(String(children))
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
 h1: createHeading(1),
 h2: createHeading(2),
 h3: createHeading(3),
 h4: createHeading(4),
 h5: createHeading(5),
 h6: createHeading(6),
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

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
 return (
  <MDXRemote
   {...props}
   components={{ ...components, ...(props.components || {}) }}
   options={{ blockJS: false }}
  />
 )
}
