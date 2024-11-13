/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#050505',
        'secondary': '#FF007F',
        'tertiary': '#902D41',
      },
      fontFamily: {
        Anton: ['Anton', 'sans-serif'],
        WorkSans: ['Work Sans', 'sans-serif'],
      }
    },
    plugins: [],
  },
};
