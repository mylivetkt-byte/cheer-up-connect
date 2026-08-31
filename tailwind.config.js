/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          dark: '#0f172a'
        },
        pos: {
          header: '#1e293b',
          sidebar: '#0f172a',
          card: '#1e293b',
          accent: '#ef4444',
          highlight: '#3b82f6',
          panel: '#111827'
        }
      }
    },
  },
  plugins: [],
}
