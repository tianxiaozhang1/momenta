/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    theme: {
      extend: {
        colors: {
          'black-rgba': 'rgba(0,0,0,0.3)'
        },
      }
    }
  }
  