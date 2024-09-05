/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: ['active'],
      colors: {
        darkMode: '#1F2937',
        darkModeHover: '#4B5563',
        lightMode: '#FAF3E9',
        lightModeHover: '#c0bab1'
        // textdarkMode: 'text-black',
        // textlightMode: 'text-white'
      }
    }
  },
  plugins: []
}
