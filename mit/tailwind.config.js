/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // extra small devices
        'sm': '640px', // small devices
        'md': '768px', // medium devices
        'lg': '1024px', // large devices
        'xl': '1280px', // extra large devices
      },
    },
  },
  plugins: [],
}

