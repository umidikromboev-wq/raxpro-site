/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}","./components/**/*.{js,jsx}"],
  theme: { extend: {
    colors: {
      ink: { 950:'#0a0c10', 900:'#0f131a', 800:'#161c26', 700:'#1f2733', 600:'#2b3645' },
      steel: { 100:'#eef2f6', 200:'#dde5ed', 300:'#b9c6d4', 400:'#8a9bad' },
      orange: { 400:'#ff8a3d', 500:'#ff6a00', 600:'#e85d00' },
    },
    fontFamily: { sans:['system-ui','-apple-system','Segoe UI','sans-serif'] },
    keyframes: { fadeup:{ '0%':{opacity:'0',transform:'translateY(18px)'},'100%':{opacity:'1',transform:'none'} } },
    animation: { fadeup:'fadeup .6s cubic-bezier(.16,1,.3,1) both' },
  }},
  plugins: []
}
