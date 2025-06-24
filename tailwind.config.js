/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        header: 'var(--font-inter)',
        main: 'var(--font-inter)',
      },
      colors: {
        'c-background': {
          light: '#f0fffb',
          dark: '#000F0F',
          DEFAULT: '#f0fffb',
        },
        header: {
          primary: '#598DAF',
          secondary: '#F2E7DC',
        },
      },
    },
  },
  plugins: [],
};
