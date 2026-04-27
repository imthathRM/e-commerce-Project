/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fd',
          100: '#cce1fb',
          400: '#66a3f4',
          500: '#0A192F', // Navy Blue
          600: '#081426',
          700: '#060f1c',
          900: '#020509',
        },
        secondary: {
          50: '#effefb',
          100: '#cdfff3',
          400: '#64FFDA', // Light Green / Teal
          500: '#20eebc',
          600: '#15cd9f',
          900: '#064232',
        },
        surface: {
          light: '#ffffff',
          dark: '#112240',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
