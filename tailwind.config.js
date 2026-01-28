/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#ede7dc',
          300: '#e0d5c7',
          400: '#d4c5b0',
          500: '#c4b5a0',
          600: '#a89178',
          700: '#8b7355',
          800: '#6b5744',
          900: '#3e2f23',
        },
        warm: {
          50: '#faf8f5',
          100: '#f5f1e8',
          200: '#ede7dc',
          300: '#e0d5c7',
          400: '#d4c5b0',
          500: '#c4b5a0',
          600: '#a89178',
          700: '#8b7355',
          800: '#6b5744',
          900: '#4a3a2a',
        },
        brown: {
          50: '#f7f5f3',
          100: '#ede8e3',
          200: '#ddd4ca',
          300: '#c9baaa',
          400: '#b39d88',
          500: '#9d8570',
          600: '#8b7355',
          700: '#6b5744',
          800: '#4a3a2a',
          900: '#2c1f16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
