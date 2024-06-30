const { nextui } = require("@nextui-org/react")

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        clampLogo: "clamp(5rem, 20vw, 380px)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0a0013",
            primary: "#00ADB5",
          },
        },
        light: {
          colors: {
            primary: "#ff8c00",
          },
        },
      },
    }),
  ],
}
