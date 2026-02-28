/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bee theme colors
        'bee-yellow': '#FFD700',
        'bee-yellow-dark': '#FFA500',
        'bee-black': '#1A1A1A',
        'bee-red': '#DC2626',
        'bee-red-dark': '#991B1B',
      },
    },
  },
  plugins: [],
}
