/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'secondary': '#149141',
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
