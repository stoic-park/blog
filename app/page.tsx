import { redirect } from 'next/navigation'

// 홈 -> 포스트 리다이렉트
export default function Page() {
 redirect('/post')
}
