/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2f8f1f',
          dark: '#247217',
        },
        navy: '#0b1d3a',
      },
    },
  },
  plugins: [],
}