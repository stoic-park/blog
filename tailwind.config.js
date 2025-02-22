/** @type {import('tailwindcss').Config} */
module.exports = {
  // dark mode 수동으로 지정하기!
  // class 명을 바꿀 수 있도록 해주면 dark mode 컨트롤을 할 수 있다.
  darkMode: 'selector',
  content: ['./(app|src)/**/*.{js,ts,jsx,tsx,mdx}'],
}