/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          950: '#0B1A15',
          900: '#10241E',
          800: '#173229'
        },
        paper: '#FBF6EC',
        marigold: '#E8A33D',
        stamp: '#C1443C',
        sage: '#7FA98F'
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      keyframes: {
        stampDown: {
          '0%': { transform: 'scale(2.2) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(-12deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' }
        },
        riseIn: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        stamp: 'stampDown 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) forwards',
        riseIn: 'riseIn 0.5s ease-out forwards',
        marquee: 'marquee 30s linear infinite'
      }
    }
  },
  plugins: []
};
