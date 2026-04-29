/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"', 'Pretendard', '-apple-system',
          'BlinkMacSystemFont', 'system-ui', 'Roboto', '"Helvetica Neue"',
          '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"',
          '"Malgun Gothic"', 'sans-serif',
        ],
      },
      colors: {
        navy: {
          DEFAULT: '#0a0e1a',
          800: '#151b2b',
          900: '#0b101e',
          950: '#060913',
        },
      },
    },
  },
  plugins: [],
}
