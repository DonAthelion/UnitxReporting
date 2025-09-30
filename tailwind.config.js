/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        unitx: {
          pink:  "#ff4fbf",   // rosa UnitX
          teal:  "#48c9b0",   // turquesa UnitX
          dark:  "#0b0c10",   // fondo base
          ink:   "#12151a",   // cards
          sand:  "#e7d3a1"    // opcional (playa/acento)
        }
      },
      boxShadow: {
        unitx: "0 10px 25px rgba(72,201,176,0.25)" // glow turquesa
      }
    }
  },
  plugins: [],
}
