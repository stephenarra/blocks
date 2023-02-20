/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="light"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
