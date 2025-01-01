/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metropoliaOrange: '#ff5000',
        metropoliaGray: '#53565a',
        metropoliaRed: '#cb2228',
        metropoliaBlue: '#4046a8',
        metropoliaYellow: '#fff000',
        metropoliaPink: '#e384c4',
        metropoliaLightBlue: '#5db1e4',
        metropoliaGreen: '#3ba88f',
      },
      fontFamily: {
        title: ['Roboto Slab', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
