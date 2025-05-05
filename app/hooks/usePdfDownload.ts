import { RefObject, useRef, useState, useEffect, useCallback } from 'react'
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
 const jsPDFRef = useRef<jsPDF | null>(null)
 const [pixelRatio, setPixelRatio] = useState(window.devicePixelRatio)
 const [loading, setLoading] = useState(false)

 useEffect(() => {
  jsPDFRef.current = new jsPDF('p', 'mm', 'a4')
 }, [])

 useEffect(() => {
  const handleResize = () => {
   setPixelRatio(window.devicePixelRatio)
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
 }, [])

 const download = useCallback(async () => {
  if (!ref.current) return
  setLoading(true)

  try {
   await document.fonts.ready
   if (onBeforeDownload) await onBeforeDownload()

   const doc = jsPDFRef.current
   const element = ref.current

   // 컨텐츠의 실제 크기를 가져옵니다
   const width = element.offsetWidth
   const height = element.offsetHeight

   // A4 비율에 맞게 스케일을 계산합니다
   const A4_WIDTH_MM = 210
   const A4_HEIGHT_MM = 297
   const pxPerMm = 72 / 25.4

   // 컨텐츠의 비율을 유지하면서 A4에 맞게 스케일을 조정
   const scale =
    Math.min(
     (A4_WIDTH_MM * pxPerMm) / width,
     (A4_HEIGHT_MM * pxPerMm) / height,
    ) * 2 // 2배 해상도로 캡처

   const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
   })

   const imgWidth = canvas.width
   const imgHeight = canvas.height
   const pageHeight = A4_HEIGHT_MM * pxPerMm

   let remainingHeight = imgHeight
   let positionY = 0
   let pageNum = 0

   while (remainingHeight > 0) {
    const sliceHeight = Math.min(pageHeight, remainingHeight)

    const pageCanvas = document.createElement('canvas')
    const pageCtx = pageCanvas.getContext('2d')!

    pageCanvas.width = imgWidth
    pageCanvas.height = sliceHeight

    pageCtx.drawImage(
     canvas,
     0,
     positionY,
     imgWidth,
     sliceHeight,
     0,
     0,
     imgWidth,
     sliceHeight,
    )

    const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0)
    if (pageNum > 0) doc?.addPage()

    // PDF 페이지 크기를 컨텐츠에 맞게 조정
    const pdfWidth = A4_WIDTH_MM
    const pdfHeight = (sliceHeight / imgWidth) * pdfWidth

    doc?.addImage(
     pageImgData,
     'JPEG',
     0,
     0,
     pdfWidth,
     pdfHeight,
     undefined,
     'FAST',
    )

    remainingHeight -= sliceHeight
    positionY += sliceHeight
    pageNum++
   }

   doc?.save(filename)
  } finally {
   setLoading(false)
  }
 }, [ref, filename, onBeforeDownload])

 return { download, loading, zoom: 1 / pixelRatio }
}
