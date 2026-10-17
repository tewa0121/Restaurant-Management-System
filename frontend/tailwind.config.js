<<<<<<< Updated upstream
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Uncomment if your backend runs on another port (change 5000 to yours).
    // This forwards requests starting with /api to the backend.
    // proxy: {
    //   '/api': 'http://localhost:5000',
    // },
  },
})
=======
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
>>>>>>> Stashed changes
