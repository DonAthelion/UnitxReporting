/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        unitx: {
          // You can tweak these to your exact UnitX palette
          pink: "#ff4fbf",
          green: "#48c9b0",
          dark: "#101214",
          slate: "#1b1f23"
        }
      },
      boxShadow: {
        "unitx": "0 10px 25px rgba(72,201,176,0.25)"
      }
    },
  },
  plugins: [],
}
