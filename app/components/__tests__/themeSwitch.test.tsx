import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitch } from '../themeSwitch';
import '@testing-library/jest-dom';

describe('ThemeSwitch', () => {
    const mockMatchMedia = (matches: boolean) => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches,
                media: query,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            })),
        });
    };

    beforeEach(() => {
        // localStorage 초기화
        localStorage.clear();
        // DOM 초기화
        document.documentElement.classList.remove('dark');
    });

    test('시스템이 다크모드일 때 초기 테마가 dark로 설정됨', () => {
        mockMatchMedia(true); // 시스템 다크모드 설정
        render(<ThemeSwitch />);
        
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('시스템이 라이트모드일 때 초기 테마가 light로 설정됨', () => {
        mockMatchMedia(false); // 시스템 라이트모드 설정
        render(<ThemeSwitch />);
        
        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    test('localStorage에 dark 테마가 저장되어 있을 때', () => {
        localStorage.setItem('theme', 'dark');
        render(<ThemeSwitch />);
        
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('localStorage에 light 테마가 저장되어 있을 때', () => {
        localStorage.setItem('theme', 'light');
        render(<ThemeSwitch />);
        
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    test('테마 토글 버튼 클릭 시 테마가 변경됨', () => {
        localStorage.setItem('theme', 'light');
        render(<ThemeSwitch />);
        
        const toggleButton = screen.getByRole('button');
        
        // light -> dark
        fireEvent.click(toggleButton);
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        
        // dark -> light
        fireEvent.click(toggleButton);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
}); 