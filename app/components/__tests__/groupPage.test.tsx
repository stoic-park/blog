import { render, screen } from '@testing-library/react'
import { GroupPage } from '../GroupPage'
import { getBlogPosts, groupOf } from 'app/lib/posts'

describe('GroupPage', () => {
  const posts = getBlogPosts()
  const titles = (group: 'dev' | 'domain') =>
    posts.filter((p) => groupOf(p.metadata.category) === group).map((p) => p.metadata.title)

  test('domain 그룹에는 domain 글만 나온다', () => {
    render(<GroupPage group="domain" searchParams={{}} />)
    for (const t of titles('domain')) expect(screen.getByText(t)).toBeInTheDocument()
    for (const t of titles('dev')) expect(screen.queryByText(t)).toBeNull()
  })

  test('카테고리가 하나뿐이면 칩 줄을 그리지 않는다', () => {
    render(<GroupPage group="domain" searchParams={{}} />)
    expect(screen.queryByRole('navigation', { name: '카테고리' })).toBeNull()
  })

  test('dev 그룹은 카테고리 칩과 선택 상태를 보여준다', () => {
    render(<GroupPage group="dev" searchParams={{ category: 'ai' }} />)
    const nav = screen.getByRole('navigation', { name: '카테고리' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'AI' })).toHaveAttribute('aria-current', 'page')
  })
})
