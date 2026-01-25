/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Zen Old Mincho"', '"MS Mincho"', 'serif'],
        sans: ['"Zen Kaku Gothic New"', '"Yu Gothic"', 'sans-serif'],
      },
      colors: {
        'paper': '#f4f1ea', // Creamy rice paper
        'ink': '#2b2b2b',   // Sumi ink black
        'cinnabar': '#cd4435', // Seal red
        'indigo': '#2c4f7c', // Traditional indigo
      }
    },
  },
  plugins: [],
}
