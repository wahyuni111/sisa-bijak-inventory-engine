/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8EE',
          100: '#F5EED5',
          200: '#EBDCAE',
          300: '#DFC67F',
          400: '#D4AF37', // Refined Warm Culinary Gold
          500: '#C29B27',
          600: '#A17D1A',
          700: '#7E5F14',
          800: '#5F4611',
          900: '#45320F',
          accent: '#E5C158',
        },
        slate: {
          850: '#151F32',
          900: '#0F172A', // Deep Navy/Slate
          950: '#080D1A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px -5px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 30px -5px rgba(212, 175, 55, 0.35)',
        'crimson-glow': '0 0 20px -5px rgba(225, 29, 72, 0.25)',
      }
    },
  },
  plugins: [],
}
