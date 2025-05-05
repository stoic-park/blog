'use client'

import { highlight } from 'sugar-high'

export function CodeBlock({ children, ...props }) {
 const codeString = typeof children === 'string' ? children : String(children)
 const codeHTML = highlight(codeString)
 return (
  <code
   dangerouslySetInnerHTML={{ __html: codeHTML }}
   {...props}
   className={`pr-10 ${props.className || ''}`}
  />
 )
}
