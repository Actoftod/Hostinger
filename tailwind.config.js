/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          DEFAULT: '#ccff00',
          dark: '#a8d100',
        },
      },
      fontFamily: {
        oswald: ['"Oswald"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-widest': '0.3em'
      }
    },
  },
  plugins: [],
}