/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f1f4f9',
          100: '#dbe3ef',
          200: '#b8c8dd',
          300: '#8ea6c6',
          400: '#5f7fab',
          500: '#3f5f8c',
          600: '#2d4770',
          700: '#233a5c',
          800: '#1a2b45',
          900: '#101a2c',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f5ecce',
          200: '#ecd89e',
          300: '#e0bd68',
          400: '#d4a53f',
          500: '#c1902c',
          600: '#a17322',
          700: '#7d581e',
          800: '#66481f',
          900: '#573d1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
