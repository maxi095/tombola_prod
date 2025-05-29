/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",  // azul (bg-blue-600)
          light: "#3b82f6",    // hover
          dark: "#1d4ed8",
        },
        graySoft: "#f9fafb", // fondo claro para formularios
      },
      borderRadius: {
        xl: "1rem",
        md: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
