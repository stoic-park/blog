import { render, screen } from '@testing-library/react'
import { Navbar } from '../nav'
import { ThemeSwitch } from '../themeSwitch'
// import mockRouter from 'next-router-mock'
import { usePathname } from 'next/navigation'

// ThemeSwitch 컴포넌트를 목(mock)으로 대체
jest.mock('../themeSwitch', () => ({
  ThemeSwitch: jest.fn(() => (
    <div data-testid="theme-switch">Theme Switch</div>
  )),
}))

// next/router를 next-router-mock으로 대체
// jest.mock('next/router', () => require('next-router-mock'))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(), // usePathnamedmf jest mock 함수로 설정
}))

const navItems = {
  '/': { name: 'Home' },
  '/post': { name: 'Post' },
  '/about': { name: 'About' },
}

describe('Navbar', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 목을 초기화
    jest.clearAllMocks()
    // mockRouter.setCurrentUrl('/')
  })

  test('renders all navigation links', () => {
    render(<Navbar />)

    // 블로그 링크 확인
    const blogLink = screen.getByText('Post')
    expect(blogLink).toBeInTheDocument()
    expect(blogLink.closest('a')).toHaveAttribute('href', '/post')
  })

  test('renders ThemeSwitch component', () => {
    render(<Navbar />)

    // ThemeSwitch 컴포넌트가 렌더링되었는지 확인
    expect(screen.getByTestId('theme-switch')).toBeInTheDocument()
    expect(ThemeSwitch).toHaveBeenCalled()
  })

  // test.each(Object.entries(navItems))(
  //   '%s 경로에서는 %s 링크가 활성화되어야 한다',
  //   (url, { name }) => {
  //     // mockRouter.setCurrentUrl(url) // 현재 URL 설정
  //     render(<Navbar />) // Navbar 렌더링

  //     const link = screen.getByRole('link', { name }) // 링크 검색
  //     expect(link).toHaveAttribute('aria-current', 'page') // 현재 경로인지 확인
  //   },
  // )

  test.each(Object.entries(navItems))(
    '%s 경로에서는 %s 링크가 활성화되어야 한다',
    (url, { name }) => {
      ;(usePathname as jest.Mock).mockReturnValue(url) // ✅ 현재 경로를 모킹
      render(<Navbar />) // ✅ Navbar 렌더링
      const link = screen.getByRole('link', { name }) // ✅ 링크 찾기
      expect(link).toHaveAttribute('aria-current', 'page') // ✅ 현재 경로인지 확인
    },
  )
})
