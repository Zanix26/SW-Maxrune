/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          800: '#1F2A44', // Stelle sicher, dass gray-800 definiert ist
        },
      },
    },
  },
  plugins: [],
};