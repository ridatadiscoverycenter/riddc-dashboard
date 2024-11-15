/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        header: "var(--font-header)",
        main: "var(--font-main)",
        accent: "var(--font-accent)",
      },
      colors: {
        'c-background': {
          light: '#f0fffb',
          dark: '#000F0F',
          DEFAULT: '#f0fffb',
        },
      },
    },
  },
  plugins: [],
};
