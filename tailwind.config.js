/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF7FA',
          100: '#FDEEF3',
          200: '#FBDCE7',
          300: '#F1DCE4',
          400: '#E7A7BD',
          500: '#D9799A', // Primary Pink per PRD
          600: '#C95C7A', // Accent Pink per PRD
          700: '#A9405E',
          800: '#8A2E49',
          900: '#6E2037',
        },
        slate: {
          900: '#0F172A', // Main text per PRD
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
