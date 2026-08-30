/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Ativar dark mode baseado em classe CSS
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
        // Fira Code já é carregada no layout.tsx (--font-fira-code) mas não
        // tinha token no Tailwind ainda. Usada nos números "de instrumento"
        // do redesign (horas, alturas, coeficiente, score).
        tideMono: ["var(--font-fira-code)", "monospace"],
      },
      colors: {
        // Cores customizadas para tema escuro (opcional)
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
