/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        dashboard: "#0f172a", // 👈 เปลี่ยนชื่อ (กันชนกับ dark:)
      },
    },
  },

  plugins: [],
};