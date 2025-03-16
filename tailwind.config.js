/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  plugins: [
    flowbite.plugin()
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
    },
  }
}