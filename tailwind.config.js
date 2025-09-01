/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f8f1',
          100: '#e6f2e2',
          200: '#cce5c7',
          300: '#a3d0a1',
          400: '#7cb342',
          500: '#5a9c2d',
          600: '#2d5016',
          700: '#244112',
          800: '#1d340e',
          900: '#17270c',
        },
        accent: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ff6f00',
          600: '#e65100',
          700: '#bf360c',
          800: '#8e0000',
          900: '#4e0000',
        },
        forest: '#2D5016',
        fresh: '#7CB342',
        amber: '#FF6F00',
        earth: {
          50: '#faf7f0',
          100: '#f5f1e8',
          200: '#e8dcc6',
          300: '#d6c4a4',
          400: '#c4a882',
          500: '#a68860',
          600: '#8b6f48',
          700: '#6d5638',
          800: '#4f3f2a',
          900: '#32281c',
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      }
    },
  },
  plugins: [],
}