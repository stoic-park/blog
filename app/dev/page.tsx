import { GroupPage } from 'app/components/GroupPage'

export const metadata = {
 title: 'Dev',
 description: '프론트엔드 개발, AI 도구 활용, 회고.',
}

export default function Page({
 searchParams,
}: {
 searchParams: { category?: string; tag?: string }
}) {
 return <GroupPage group="dev" searchParams={searchParams} />
}
