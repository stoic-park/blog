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
 const [headingTops, setHeadingTops] = useState<
  { id: string; top: number }[] | null
 >(null)

 // 헤딩 요소들의 위치를 계산하는 함수
 const updateTocPositions = useCallback(() => {
  if (!toc) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const headingTops = toc.map(({ id }) => {
   const el = document.getElementById(id)
   if (!el) {
    return { id, top: 0 }
   }
   const top = el.getBoundingClientRect().top + scrollTop
   return { id, top }
  })
  setHeadingTops(headingTops)
 }, [toc])

 // 스크롤 위치에 따라 현재 활성 섹션을 업데이트하는 함수
 const onScroll = useCallback(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (!headingTops) return

  const currentHeading = [...headingTops].reverse().find((headingTop) => {
   return scrollTop >= headingTop.top - 4
  })

  if (!currentHeading) {
   setActiveId(null)
   return
  }

  setActiveId(currentHeading.id)
 }, [headingTops])

 // 컴포넌트 마운트 시 헤딩 위치 계산
 useEffect(() => {
  updateTocPositions()

  // 스크롤 높이 변화 감지를 위한 타이머
  let prevScrollHeight = document.body.scrollHeight
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function checkScrollHeight() {
   const scrollHeight = document.body.scrollHeight
   if (prevScrollHeight !== scrollHeight) {
    updateTocPositions()
   }
   prevScrollHeight = scrollHeight
   timeoutId = setTimeout(checkScrollHeight, 250)
  }

  timeoutId = setTimeout(checkScrollHeight, 250)

  return () => {
   if (timeoutId) {
    clearTimeout(timeoutId)
   }
  }
 }, [updateTocPositions])

 // 스크롤 이벤트 리스너 등록
 useEffect(() => {
  window.addEventListener('scroll', onScroll)
  return () => {
   window.removeEventListener('scroll', onScroll)
  }
 }, [onScroll])

 // SSR을 위한 초기 스크롤 위치 확인
 useEffect(() => {
  onScroll()
 }, [onScroll])

 if (!toc || !headingTops) return null

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

/*
사용 예시:

// 부모 컨테이너에서 사용할 때
<div className="relative">
  <div className="prose max-w-4xl">
    <h1 id="introduction">소개</h1>
    <p>내용...</p>
    
    <h2 id="getting-started">시작하기</h2>
    <p>내용...</p>
    
    <h3 id="installation">설치</h3>
    <p>내용...</p>
    
    <h2 id="usage">사용법</h2>
    <p>내용...</p>
  </div>
  
  <TocSidebar 
    toc={[
      { id: 'introduction', text: '소개', level: 1 },
      { id: 'getting-started', text: '시작하기', level: 2 },
      { id: 'installation', text: '설치', level: 3 },
      { id: 'usage', text: '사용법', level: 2 }
    ]} 
  />
</div>

주요 기능:
1. 부모 컨테이너 오른쪽에 고정 배치
2. 현재 읽고 있는 섹션 자동 하이라이트
3. 독립적인 스크롤 영역 (긴 ToC 목록 처리)
4. 부드러운 스크롤 네비게이션
5. 반응형 디자인 (1365px 이하에서 숨김)
6. 다크모드 지원
*/
