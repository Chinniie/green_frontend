/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ เช็คบรรทัดนี้ให้ดี ต้องมี /src/ นำหน้า
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}