/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myPrimary: '#0b090a',
        mySecondary: '#161a1d',
        accent1: '#1b2e2b',
        accent2: '#374f41',
      },
    },
  },

  plugins: [daisyui],
};
