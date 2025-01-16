/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,jsx,ts,tsx}',
    './src/manager/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#191A21',
        line: '#44475a',
        foreground: '#282a36',
        comment: '#6272a4',
        cyan: '#8be9fd',
        green: '#50fa7b',
        orange: '#ffb86c',
        pink: '#e087ba',
        purple: '#bd93f9',
        red: '#ff5555',
        yellow: '#f1fa8c',
      },
    },
  },
  plugins: [],
};
