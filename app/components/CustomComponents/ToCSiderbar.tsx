'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface TocItem {
 id: string
 text: string
 level: number
}

interface TocSidebarProps {
 toc: TocItem[]
}

export const TocSidebar: React.FC<TocSidebarProps> = ({ toc }) => {
 const [activeId, setActiveId] = useState<string | null>(null)
 // Intersection Observer를 사용한 헤딩 감지
 const observerCallback = useCallback(
  (entries: IntersectionObserverEntry[]) => {
   entries.forEach((entry) => {
    if (entry.isIntersecting) {
     setActiveId(entry.target.id)
    }
   })
  },
  [],
 )

 // 헤딩 요소들에 대한 Observer 설정
 useEffect(() => {
  if (!toc) return

  const observer = new IntersectionObserver(observerCallback, {
   rootMargin: '-20% 0px -35% 0px',
   threshold: [0, 1],
  })

  const elements = toc
   .map(({ id }) => document.getElementById(id))
   .filter((element): element is HTMLElement => element !== null)
  elements.forEach((element) => observer.observe(element))

  return () => {
   elements.forEach((element) => observer.unobserve(element))
   observer.disconnect()
  }
 }, [toc, observerCallback])

 // ResizeObserver를 사용한 컨텐츠 크기 변화 감지
 useEffect(() => {
  if (!toc) return

  const resizeObserver = new ResizeObserver(() => {
   const elements = toc
    .map(({ id }) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null)
   elements.forEach((element) => {
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.3) {
     setActiveId(element.id)
    }
   })
  })

  document.body.querySelectorAll('article').forEach((element) => {
   resizeObserver.observe(element)
  })

  return () => {
   resizeObserver.disconnect()
  }
 }, [toc])

 if (!toc) return null

 return (
  <div className="toc-wrapper">
   <div className="toc-positioner">
    <nav className="toc-sidebar">
     <ul className="toc-list">
      {toc.map((item) => (
       <li
        key={item.id}
        className={`toc-item ${activeId === item.id ? 'toc-item-active' : ''}`}
        style={{ marginLeft: (item.level - 1) * 16 }}
       >
        <a
         href={`#${item.id}`}
         className="toc-link"
         onClick={(e) => {
          e.preventDefault()
          const element = document.getElementById(item.id)
          if (element) {
           element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
           })
          }
         }}
        >
         {item.text}
        </a>
       </li>
      ))}
     </ul>
    </nav>
   </div>
  </div>
 )
}
