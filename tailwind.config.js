/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080C14',
          card: '#111827',
          border: '#1E293B',
          accent: '#F59E0B',
          cyan: '#06B6D4'
        }
      }
    }
  },
  plugins: [],
}
