import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { slugify } from 'app/post/utils'
function Table({ data }) {
 let headers = data.headers.map((header, index) => (
  <th key={index} className="px-4 py-2 bg-gray-400 text-left font-semibold">
   {header}
  </th>
 ))
 let rows = data.rows.map((row, index) => (
  <tr key={index} className="border-b">
   {row.map((cell, cellIndex) => (
    <td key={cellIndex} className="px-4 py-2">
     {cell}
    </td>
   ))}
  </tr>
 ))

 return (
  <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
   <thead>
    <tr>{headers}</tr>
   </thead>
   <tbody>{rows}</tbody>
  </table>
 )
}

function CustomLink(props) {
 let href = props.href

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

function RoundedImage(props) {
 return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
 let codeHTML = highlight(children)
 return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function createHeading(level) {
 const Heading = ({ children }) => {
  let slug = slugify(children)
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

let components = {
 h1: createHeading(1),
 h2: createHeading(2),
 h3: createHeading(3),
 h4: createHeading(4),
 h5: createHeading(5),
 h6: createHeading(6),
 Image: RoundedImage,
 a: CustomLink,
 code: Code,
 Table,
}

export function CustomMDX(props) {
 return (
  <MDXRemote
   {...props}
   components={{ ...components, ...(props.components || {}) }}
  />
 )
}
