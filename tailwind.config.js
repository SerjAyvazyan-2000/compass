/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/***/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#041542",
        "main-blue": "#3870FF",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        roboto: ["var(--font-roboto)"],
      },
      boxShadow: {
        "header-shadow": "0px -1px 11.9px 0px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        "desktop-big": { max: "1800px" },
        "desktop-max": { min: "1300px" },
        "desktop-lg": { max: "1200px" },
        desktop: { min: "1100px" },
        tablet: { max: "1023px" },
        "tablet-sm": { max: "768px" },
        mobile: { max: "815px" },
        "mobile-md": { max: "500px" },
        "mobile-sm": { max: "374px" },
        "mobile-min": { max: "359px" },
      },
      keyframes: {
        "fade-in-opacity": {
          from: { opacity: "0.5" },
          to: { opacity: "1" },
        },
        "fade-out-opacity": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "opacity-in": "fade-in-opacity 1s ease forwards",
        "opacity-out": "fade-out-opacity 1s ease forwards",
      },
    },
  },
  plugins: [],
};
