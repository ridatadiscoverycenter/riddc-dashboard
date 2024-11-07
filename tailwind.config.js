/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        "c-background": {
          light: "#f0fffb",
          dark: "#000F0F", 
          DEFAULT: "#f0fffb", 
        }
      }
    },
  },
  plugins: [],
};
