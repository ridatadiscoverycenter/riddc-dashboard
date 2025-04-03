/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        header: [
          'neue-haas-grotesk-display',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        body: [
          'neue-haas-grotesk-text',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        'c-background': {
          light: '#f0fffb',
          dark: '#000F0F',
          DEFAULT: '#f0fffb',
        },
        clear: {
          50: 'rgba(255,255,255,0.05)',
          100: 'rgba(255,255,255,0.1)',
          200: 'rgba(255,255,255,0.2)',
          300: 'rgba(255,255,255,0.3)',
          400: 'rgba(255,255,255,0.4)',
          500: 'rgba(255,255,255,0.5)',
          600: 'rgba(255,255,255,0.6)',
          700: 'rgba(255,255,255,0.7)',
          800: 'rgba(255,255,255,0.8)',
          900: 'rgba(255,255,255,0.9)',
          DEFAULT: 'rgba(255,255,255,0.5)',
        },
      },
    },
  },
  plugins: [],
};
