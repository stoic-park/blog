'use client'

export function EnvDebug() {
 if (process.env.NODE_ENV === 'production') {
  return null // 프로덕션에서는 표시하지 않음
 }

 return (
  <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg border text-xs z-50">
   <h3 className="font-bold mb-2">환경 변수 디버깅</h3>
   <div>NODE_ENV: {process.env.NODE_ENV}</div>
   <div>NEXT_PUBLIC_SHOW_BOOKS: {process.env.NEXT_PUBLIC_SHOW_BOOKS}</div>
   <div>
    Books 탭 표시: {process.env.NODE_ENV === 'development' ? '예' : '아니오'}
   </div>
  </div>
 )
}
