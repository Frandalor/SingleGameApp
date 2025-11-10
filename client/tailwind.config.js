/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myPrimary: '#0b090a',
        mySecondary: '#161a1d',
        accent1: '#660708',
        accent2: '#a4161a',
      },
    },
  },

  plugins: [daisyui],
};
