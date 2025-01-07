/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        tokyodark: {
          bg: '#1a1b26', // Background
          dark: '#11121D', // Darker background
          darker: '#13141c', // Even darker
          comment: '#565f89', // Comments/secondary text
          text: '#A0A8CD', // Main text
          blue: '#7aa2f7', // Accent blue
          cyan: '#7dcfff', // Cyan
          green: '#9ece6a', // Green
          magenta: '#bb9af7', // Magenta
          red: '#f7768e', // Red
          yellow: '#e0af68', // Yellow/Warning
          border: '#3b4261', // Borders
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
