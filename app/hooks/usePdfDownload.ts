import { RefObject, useCallback, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const usePdfDownload = <T extends HTMLElement>({
 ref,
 filename = 'document.pdf',
 onBeforeDownload,
}: {
 ref: RefObject<T>
 filename?: string
 onBeforeDownload?: () => Promise<void> | void
}) => {
 const [loading, setLoading] = useState(false)

 const download = useCallback(async () => {
  if (!ref.current || typeof window === 'undefined') return

  try {
   setLoading(true)

   // 다운로드 전 실행할 작업이 있다면 실행
   if (onBeforeDownload) {
    await onBeforeDownload()
   }

   // 고해상도 대응을 위한 scale 설정
   const scale = window.devicePixelRatio
   const canvas = await html2canvas(ref.current, {
    scale,
    useCORS: true,
    logging: false,
   })

   // PDF 생성
   const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
   })

   // 이미지 크기 계산
   const imgWidth = 210 // A4 width in mm
   const imgHeight = (canvas.height * imgWidth) / canvas.width

   // PDF에 이미지 추가
   pdf.addImage(
    canvas.toDataURL('image/jpeg', 1.0),
    'JPEG',
    0,
    0,
    imgWidth,
    imgHeight,
   )

   // PDF 저장
   pdf.save(filename)
  } catch (error) {
   console.error('PDF 다운로드 중 오류 발생:', error)
   throw error
  } finally {
   setLoading(false)
  }
 }, [ref, filename, onBeforeDownload])

 return { download, loading }
}
