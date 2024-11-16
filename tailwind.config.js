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
        lightMode: '#FFFFFF',
        lightModeHover: '#dfe1e3',
        backgroundImage: {
          'custom-pattern':
            "url('https://r4.wallpaperflare.com/wallpaper/792/639/808/pattern-monochrome-telegram-logo-cats-hd-wallpaper-18d68d4880c0cc48c07ce18e38a244ba.jpg')"
        }
      }
    }
  },
  plugins: []
}
