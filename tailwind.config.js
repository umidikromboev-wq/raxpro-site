/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // RAXPRO brand — vivid azure blue + white (from Instagram logo gradient #00A2EB → #0166B3)
        navy: { 900: '#052a4d', 800: '#073a68', 700: '#0a5296', 600: '#0a66b8' },
        sky: { 800: '#014e91', 700: '#0166b3', 600: '#0a86d8', 500: '#00a2eb', 400: '#26b8f2', 300: '#7dd4f7', 200: '#bce7fb' },
        ink: '#0c2438',
        slate: { 700: '#2f4257', 600: '#42566b', 500: '#607388', 400: '#8ea1b5', 300: '#c2d3e2' },
        cloud: { 50: '#f2f8fd', 100: '#e8f2fb', 200: '#d7e7f5', 300: '#c2d9ee' },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        display: ['var(--font-unbounded)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(5,42,77,.04), 0 10px 30px -14px rgba(10,102,184,.20)',
        'card-hover': '0 14px 46px -16px rgba(10,134,216,.38)',
        band: '0 24px 60px -22px rgba(1,102,179,.55)',
        glow: '0 8px 30px -8px rgba(0,162,235,.5)',
      },
      borderRadius: { xl2: '1.25rem' },
      backgroundImage: {
        'brand-grad': 'linear-gradient(140deg, #26b8f2 0%, #0a86d8 45%, #0166b3 100%)',
      },
      keyframes: {
        fadeup: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: { fadeup: 'fadeup .7s cubic-bezier(.16,1,.3,1) both' },
    },
  },
  plugins: [],
};
