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
          easy: 'var(--accent-easy)',
          medium: 'var(--accent-medium)',
          hard: 'var(--accent-hard)',
          expert: 'var(--accent-expert)',
          glow: 'var(--accent-glow)', // Keep for backward compat, but map to solid
          success: 'var(--success)',
        },
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'glass': 'var(--shadow-sm)',
        'glass-dark': 'var(--shadow-sm)',
        'glow': 'none',
        'hard': 'var(--shadow-hard)',
        'sm': 'var(--shadow-sm)',
        'inner-glass': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
}
