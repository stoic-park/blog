import { GroupPage } from 'app/components/GroupPage'

export const metadata = {
 title: 'Domain',
 description: '반도체 공정과 설비 데이터 등 업무 도메인 지식.',
}

export default function Page({
 searchParams,
}: {
 searchParams: { category?: string; tag?: string }
}) {
 return <GroupPage group="domain" searchParams={searchParams} />
}
