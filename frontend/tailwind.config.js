/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF8F0',
          100: '#FFE8D6',
          200: '#FFD1AD',
          300: '#FFBA84',
          400: '#FFA35B',
          500: '#FF8C32',
          600: '#FF6B35', // Primary Zhi orange
          700: '#E55100',
          800: '#CC4400',
          900: '#802B00',
        },
        zhi: {
          dark: '#0F1419',
          darker: '#000000',
          text: '#FFFFFF',
          secondary: '#71767B',
          border: '#2F3336',
          hover: '#181B20',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        heartBeat: 'heartBeat 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
