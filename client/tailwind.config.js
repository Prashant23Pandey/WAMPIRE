/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pure: '#000000',
        obsidian: {
          950: '#030304',
          900: '#070709',
          850: '#0c0c10',
          800: '#111116',
          700: '#1b1b22',
          600: '#272732',
        },
        brand: {
          pink: {
            50: '#fff1f6',
            100: '#ffe4ee',
            200: '#fecddf',
            300: '#fea3c5',
            400: '#fb6fa3',
            500: '#FF007F', // Neon Cyber Pink
            600: '#e60072',
            700: '#c2005e',
            800: '#9f024e',
            900: '#830743',
            950: '#4c0023',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Syne"', '"Playfair Display"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-pink': '0 0 25px -3px rgba(255, 0, 127, 0.45)',
        'glow-pink-sm': '0 0 15px -2px rgba(255, 0, 127, 0.35)',
        'glow-pink-lg': '0 0 50px -5px rgba(255, 0, 127, 0.6)',
        'card-light': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
