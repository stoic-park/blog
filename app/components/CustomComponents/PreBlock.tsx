'use client'
import { useState } from 'react'
import { highlight } from 'sugar-high'
import React from 'react'

function extractCodeString(children) {
 if (typeof children === 'string') return children
 if (Array.isArray(children)) return children.map(extractCodeString).join('')
 if (React.isValidElement(children) && 'props' in children) {
  return extractCodeString((children as React.ReactElement).props.children)
 }
 return ''
}

export function PreBlock({ children, ...props }) {
 const [copied, setCopied] = useState(false)
 const codeString = extractCodeString(children)
 const codeHTML = highlight(codeString)

 const handleCopy = async (e) => {
  e.stopPropagation()
  await navigator.clipboard.writeText(codeString)
  setCopied(true)
  setTimeout(() => setCopied(false), 1200)
 }

 return (
  <div className="relative group">
   <pre className="rounded-lg p-4 bg-neutral-900 text-white overflow-x-auto border-0">
    <code
     dangerouslySetInnerHTML={{ __html: codeHTML }}
     {...props}
     className={`pr-10 ${props.className || ''}`}
    />
   </pre>
   <button
    type="button"
    onClick={handleCopy}
    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 z-10"
    tabIndex={-1}
    aria-label="Copy code"
   >
    {copied ? 'Copied!' : 'Copy'}
   </button>
  </div>
 )
}
