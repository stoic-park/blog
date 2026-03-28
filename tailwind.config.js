/** @type {import('tailwindcss').Config} */
module.exports = {
  // dark mode 수동으로 지정하기!
  // class 명을 바꿀 수 있도록 해주면 dark mode 컨트롤을 할 수 있다.
  darkMode: 'selector',
  content: ['./(app|src)/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-low': 'var(--color-surface-low)',
        'surface-lowest': 'var(--color-surface-lowest)',
        'surface-high': 'var(--color-surface-high)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        'secondary-container': 'var(--color-secondary-container)',
      },
      fontFamily: {
        headline: ['var(--font-headline)'],
        body: ['var(--font-body)'],
      },
    },
  },
}
