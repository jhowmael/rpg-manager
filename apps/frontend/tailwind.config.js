/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        rpg: {
          void: '#e8dcc8',
          dark: '#d9c9a8',
          panel: '#f5eed6',
          parchment: '#faf6eb',
          border: '#8b7355',
          'border-dark': '#5c4033',
          ink: '#3d2b1f',
          'ink-dark': '#2a1f14',
          'ink-dim': '#5c4033',
          'ink-faded': '#7a6348',
          gold: '#b8860b',
          'gold-light': '#d4a84b',
          'gold-dark': '#7a5c1e',
          forest: '#3d5c3a',
          'forest-dim': '#5c7a52',
          sea: '#4a6741',
          hp: '#8b2500',
          mana: '#2e5e4e',
        },
      },
      fontSize: {
        'pixel-xs': ['10px', { lineHeight: '1.8' }],
        'pixel-sm': ['12px', { lineHeight: '1.9' }],
        'pixel-md': ['14px', { lineHeight: '2' }],
        'pixel-lg': ['16px', { lineHeight: '2.1' }],
      },
      boxShadow: {
        pixel: '4px 4px 0px 0px #8b7355',
        'pixel-dark': '4px 4px 0px 0px #5c4033',
        'pixel-gold': '4px 4px 0px 0px #7a5c1e',
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
