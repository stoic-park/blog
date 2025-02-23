import { render, screen } from '@testing-library/react'
import { Navbar } from '../nav'
import { ThemeSwitch } from '../themeSwitch'

// ThemeSwitch 컴포넌트를 목(mock)으로 대체
jest.mock('../themeSwitch', () => ({
  ThemeSwitch: jest.fn(() => <div data-testid="theme-switch">Theme Switch</div>)
}))

describe('Navbar', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 목을 초기화
    jest.clearAllMocks()
  })

  test('renders all navigation links', () => {
    render(<Navbar />)
    
    // 홈 링크 확인
    const homeLink = screen.getByText('home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')

    // 블로그 링크 확인
    const blogLink = screen.getByText('blog')
    expect(blogLink).toBeInTheDocument()
    expect(blogLink.closest('a')).toHaveAttribute('href', '/blog')
  })

  test('renders ThemeSwitch component', () => {
    render(<Navbar />)
    
    // ThemeSwitch 컴포넌트가 렌더링되었는지 확인
    expect(screen.getByTestId('theme-switch')).toBeInTheDocument()
    expect(ThemeSwitch).toHaveBeenCalled()
  })

  test('applies correct styling classes', () => {
    render(<Navbar />)
    
    // aside 요소의 스타일링 확인
    const aside = screen.getByRole('complementary')
    expect(aside).toHaveClass('-ml-[8px]', 'mb-16', 'tracking-tight')

    // nav 요소의 스타일링 확인
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass(
      'flex',
      'flex-row',
      'items-start',
      'relative',
      'px-0',
      'pb-0',
      'fade',
      'md:overflow-auto'
    )
  })
}) 