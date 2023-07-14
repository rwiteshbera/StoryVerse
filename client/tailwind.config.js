/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        first: "#5800FF",
        second: "#0096FF",
        third: "#00D7FF",
        fourth: "#72FFFF",
      },
    }
  },
  plugins: [],
};
