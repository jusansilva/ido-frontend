/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#200D00',
        secondary: '#E5E8FF',
        text: '#2A2A2A',
        background: '#F8F6F6',
        error: '#FF5A5F',
        success: '#00C48C',
        dark: {
          primary: '#E5E8FF',
          secondary: '#200D00',
          text: '#F8F6F6',
          background: '#2A2A2A',
        }
      },
    },
  },
  plugins: [],
}