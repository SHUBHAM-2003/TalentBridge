/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E40AF', 600: '#1E3A8A', 700: '#1E3A8A' },
        secondary: { DEFAULT: '#0F172A' },
        accent: { DEFAULT: '#F59E0B' },
        success: '#10B981', warning: '#F59E0B', error: '#EF4444'
      },
      fontFamily: { heading: ['Plus Jakarta Sans', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out'
      }
    }
  },
  plugins: []
}
