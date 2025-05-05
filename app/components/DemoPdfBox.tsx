'use client'

import { useRef, useState, useEffect } from 'react'
import { usePdfDownload } from 'app/hooks/usePdfDownload'

export default function DemoPdfBox() {
 const ref = useRef<HTMLDivElement>(null)
 const [isClient, setIsClient] = useState(false)
 const { download, loading } = usePdfDownload({
  ref,
  filename: 'demo.pdf',
 })

 useEffect(() => {
  setIsClient(true)
 }, [])

 if (!isClient) {
  return (
   <div className="p-6 bg-white rounded shadow-md text-center">
    <p className="text-gray-500">PDF 다운로드 기능을 로딩 중입니다...</p>
   </div>
  )
 }

 return (
  <div className="space-y-4">
   <div ref={ref} className="p-6 bg-white rounded shadow-md text-center">
    <h2 className="text-xl font-semibold">이 박스를 PDF로 저장할 수 있어요!</h2>
    <p className="text-gray-500">스타일, 폰트, 배경 모두 캡처됩니다.</p>
   </div>
   <button
    onClick={download}
    disabled={loading}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
   >
    {loading ? '생성 중...' : 'PDF로 저장하기'}
   </button>
  </div>
 )
}
