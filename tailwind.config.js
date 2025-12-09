/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Coşkun Yayçı Baklava - Logo Teması (Teal + Gold)
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // Logo ana teal rengi
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#d4a017', // Altın vurgu
          700: '#b8860b',
          800: '#996515',
          900: '#7a5210',
        },
        cream: {
          50: '#fefdfb',
          100: '#fef8f0',
          200: '#fcf1e4',
          300: '#f9e8d5',
          400: '#f5dcc0',
          500: '#f0cda6',
          600: '#e3b481',
          700: '#d4955c',
          800: '#b57640',
          900: '#925e33',
        },
      },
      fontFamily: {
        sans: ["'Inter'", 'system-ui', 'sans-serif'],
        serif: ["'Playfair Display'", 'Georgia', 'serif'],
        display: ["'Playfair Display'", 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
