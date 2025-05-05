'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export default function Giscus() {
 const ref = useRef<HTMLDivElement>(null)
 const { resolvedTheme } = useTheme()

 // https://github.com/giscus/giscus/tree/main/styles/themes
 const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

 const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO!
 const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID!
 const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY!
 const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!

 useEffect(() => {
  if (!ref.current || ref.current.hasChildNodes()) return

  const scriptElem = document.createElement('script')
  scriptElem.src = 'https://giscus.app/client.js'
  scriptElem.async = true
  scriptElem.crossOrigin = 'anonymous'

  scriptElem.setAttribute('data-repo', REPO)
  scriptElem.setAttribute('data-repo-id', REPO_ID)
  scriptElem.setAttribute('data-category', CATEGORY)
  scriptElem.setAttribute('data-category-id', CATEGORY_ID)
  scriptElem.setAttribute('data-mapping', 'pathname')
  scriptElem.setAttribute('data-strict', '0')
  scriptElem.setAttribute('data-reactions-enabled', '1')
  scriptElem.setAttribute('data-emit-metadata', '0')
  scriptElem.setAttribute('data-input-position', 'top')
  scriptElem.setAttribute('data-theme', theme)
  scriptElem.setAttribute('data-lang', 'ko')
  scriptElem.setAttribute('crossorigin', 'anonymous')

  ref.current.appendChild(scriptElem)
 }, [theme, REPO, REPO_ID, CATEGORY, CATEGORY_ID])

 // https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#isetconfigmessage
 useEffect(() => {
  const iframe = document.querySelector<HTMLIFrameElement>(
   'iframe.giscus-frame',
  )
  iframe?.contentWindow?.postMessage(
   { giscus: { setConfig: { theme } } },
   'https://giscus.app',
  )
 }, [theme])

 return <section ref={ref} />
}
