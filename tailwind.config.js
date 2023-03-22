/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary-100': '#2C9CDB',
        'primary-200': '#1d7aae',
      },
      textColor: {
        'primary': '#313131',
        'secondary': '#919191',
      }
    },
  },
  plugins: [],
}
