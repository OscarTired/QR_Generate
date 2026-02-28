/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#0d0d1a',
          panel: '#0f1020',
          cyan: '#00f5ff',
          'cyan-dim': '#00c8d4',
          magenta: '#ff00ff',
          'magenta-dim': '#cc00cc',
          yellow: '#ffff00',
          green: '#00ff88',
          blue: '#0044ff',
          'border': '#00f5ff33',
          'border-bright': '#00f5ff88',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'Courier New', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan': 'scanline 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glitch': 'glitch 3s infinite',
        'flicker': 'flicker 5s infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'border-flow': 'borderFlow 4s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'data-stream': 'dataStream 2s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(1.4)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', clipPath: 'none' },
          '91%': { transform: 'translate(-2px, 1px)', clipPath: 'inset(20% 0 60% 0)' },
          '92%': { transform: 'translate(2px, -1px)', clipPath: 'inset(60% 0 10% 0)' },
          '93%': { transform: 'translate(0)', clipPath: 'none' },
          '95%': { transform: 'translate(1px, 2px)', clipPath: 'inset(40% 0 40% 0)' },
          '96%': { transform: 'translate(-1px, -2px)', clipPath: 'inset(0% 0 80% 0)' },
          '97%': { transform: 'translate(0)', clipPath: 'none' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.4' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.2' },
          '99%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderFlow: {
          '0%, 100%': { borderColor: '#00f5ff88' },
          '50%': { borderColor: '#ff00ff88' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(0%)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f5ff, 0 0 20px #00f5ff44, 0 0 40px #00f5ff22',
        'neon-magenta': '0 0 5px #ff00ff, 0 0 20px #ff00ff44, 0 0 40px #ff00ff22',
        'neon-green': '0 0 5px #00ff88, 0 0 20px #00ff8844',
        'panel': 'inset 0 0 30px #00f5ff0a, 0 0 20px #00f5ff11',
      },
    },
  },
  plugins: [],
}
