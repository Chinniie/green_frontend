/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",   // เขียว energy
        dark: "#0f172a",      // dashboard dark
      }
    },
  },
  plugins: [],
};