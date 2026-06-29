/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        Background: '#FAFAF8',
        surface: '#FFFFFF',
        border: 'E5E3DC',
        'text-primary': '#1F1E1B',
        'text-secondary': '#6B6960',
        'text-muted': '#9A988E',
        accent: '#185FA5',
        'accent-hover': '#0C447C',
      },
    },
  },
  plugins: [],
}

