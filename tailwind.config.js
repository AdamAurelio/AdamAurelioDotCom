/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Navy-tinted neutrals — cool paper in light mode, deep navy ink in dark.
        navy: {
          50: "#F7F9FC",
          100: "#EDF1F7",
          200: "#DCE4EF",
          300: "#C2CFE0",
          400: "#9AAEC7",
          500: "#7189A8",
          600: "#526A8C",
          700: "#3D5271",
          800: "#2B3D57",
          900: "#1D2B40",
          950: "#111A2B",
        },
        // Brass/gold — the warm signature accent (community, human touches,
        // highlights). Classic pairing with navy; keeps the site from going cold.
        gold: {
          50: "#FBF6EC",
          100: "#F6EAD0",
          200: "#EDD5A1",
          300: "#E2BC6F",
          400: "#D5A345",
          500: "#C58B2A",
          600: "#A56F1F",
          700: "#85581D",
          800: "#68451D",
          900: "#55391C",
        },
        // `teal` (Tailwind built-in) is the primary/professional accent — links, CTAs.
        // teal-700 reads well on cool paper, teal-300 on navy ink.
      },
      fontFamily: {
        // Warm editorial serif for display/headings.
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Book Antiqua",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        // Humanist system sans for body/UI.
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        // Mono for small technical kickers / labels — a quiet nod to the engineer.
        mono: [
          "ui-monospace",
          "SF Mono",
          "SFMono-Regular",
          "Cascadia Code",
          "Segoe UI Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
