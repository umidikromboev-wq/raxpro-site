/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // RAXPRO brand — derived from logo (navy shelf + gold accents)
        navy: { 900: '#0d2a4d', 800: '#123a63', 700: '#1e4e82', 600: '#2a5f9e' },
        sky: { 600: '#2e80c0', 500: '#3a90cf', 400: '#5aa8e0', 300: '#9ccbef' },
        gold: { 600: '#cf9a26', 500: '#e6b23c', 400: '#f0c65f', 300: '#f7dd9e' },
        ink: '#132234',
        slate: { 700: '#334155', 600: '#48566a', 500: '#64748b', 400: '#94a3b8', 300: '#cbd5e1' },
        cloud: { 50: '#f6f9fc', 100: '#eef3f9', 200: '#e2e9f2', 300: '#d3dde9' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,42,77,.04), 0 8px 24px -12px rgba(15,42,77,.14)',
        'card-hover': '0 10px 44px -14px rgba(30,78,130,.34)',
        band: '0 24px 60px -24px rgba(13,42,77,.45)',
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        fadeup: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: { fadeup: 'fadeup .7s cubic-bezier(.16,1,.3,1) both' },
    },
  },
  plugins: [],
};
