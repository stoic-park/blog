import { render, screen } from '@testing-library/react'

const fixture = [1, 2, 3].map((order) => ({
  slug: `s${order}`,
  content: '',
  metadata: {
    title: `편 ${order}`,
    category: 'semiconductor',
    publishedAt: `2026-11-0${order}`,
    summary: '',
    series: { name: '테스트 시리즈', order },
  },
}))

jest.mock('app/lib/posts', () => ({
  ...jest.requireActual('app/lib/posts'),
  getBlogPosts: () => fixture,
  getPostsByGroup: () => fixture,
}))

import { SeriesNavigation } from '../CustomComponents/SeriesNavigation'
import { getSeriesInGroup } from '../SeriesShelf'

describe('SeriesNavigation', () => {
  test('진행 표시와 현재 편 강조', () => {
    render(<SeriesNavigation post={fixture[1]} />)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('편 2')).toHaveAttribute('aria-current', 'page')
  })

  test('첫 편에는 이전 링크가 없다', () => {
    render(<SeriesNavigation post={fixture[0]} />)
    expect(screen.queryByText('← 이전 편')).toBeNull()
    expect(screen.getByText('다음 편 →')).toHaveAttribute('href', '/post/s2')
  })

  test('마지막 편에는 다음 링크가 없다', () => {
    render(<SeriesNavigation post={fixture[2]} />)
    expect(screen.queryByText('다음 편 →')).toBeNull()
    expect(screen.getByText('← 이전 편')).toHaveAttribute('href', '/post/s2')
  })

  test('시리즈가 아니면 아무것도 그리지 않는다', () => {
    const { container } = render(
      <SeriesNavigation post={{ slug: 'x', metadata: { title: 'x' } }} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('getSeriesInGroup', () => {
  test('시리즈별로 묶고 첫 편과 편 수를 반환', () => {
    const [s] = getSeriesInGroup('domain')
    expect(s.name).toBe('테스트 시리즈')
    expect(s.count).toBe(3)
    expect(s.first.slug).toBe('s1')
    expect(s.latest.slug).toBe('s3')
  })
})
