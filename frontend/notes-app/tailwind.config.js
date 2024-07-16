/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example primary color
        blue: '#2563EB',    // Example hover blue color
      },
    },
  },
  plugins: [],
}
