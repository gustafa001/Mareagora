/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem', // px-5 em mobile
    },
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)"],
        dmSans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};
