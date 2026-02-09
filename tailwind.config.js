/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Times New Roman"', 'serif'],
        kanji: ['"Noto Serif JP"', '"Hiragino Mincho ProN"', 'serif'],
        sans: ['"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        // Light/Dark mode dynamic colors
        'paper': 'var(--bg-primary)',
        'ink': 'var(--text-primary)',
        'cinnabar': 'var(--error)',
        // Re-map indigo to accent for consistency, or keep as var(--accent)
        'indigo': 'var(--accent)',

        // Glass effects - dynamic
        'glass': 'var(--bg-glass)',

        // Accent colors
        'accent': {
          DEFAULT: 'var(--accent)',
          glow: 'var(--accent-glow)',
          success: 'var(--success)',
        },
      },
      backdropBlur: {
        'glass': '12px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'inner-glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
