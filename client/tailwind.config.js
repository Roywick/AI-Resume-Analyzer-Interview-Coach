/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1420',
          panel: '#161B26',
          line: '#232A3B',
        },
        paper: {
          DEFAULT: '#F7F8FA',
          panel: '#FFFFFF',
          line: '#E3E6EC',
        },
        scan: {
          DEFAULT: '#22D3EE',
          soft: '#22D3EE1A',
          strong: '#0891B2',
        },
        flag: {
          DEFAULT: '#F5A623',
          soft: '#F5A6231A',
          strong: '#C97C0C',
        },
        ok: {
          DEFAULT: '#34D399',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(104%)' },
          '100%': { transform: 'translateY(-4%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        scanline: 'scanline 3.2s cubic-bezier(0.65,0,0.35,1) infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34,211,238,0.35)',
      },
    },
  },
  plugins: [],
};
