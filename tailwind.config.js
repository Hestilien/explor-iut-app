/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true,
"optionalDependencies": false, "peerDependencies": false}] */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        MMI: "url('./assets/MMI.png')",
        TC: "url('./assets/TC.png')",
        GCCD: "url('./assets/GCCD.png')",
      },
      colors: {
        'blue-transparent': 'rgba(30, 58, 138, 0.9)',
        'red-transparent': 'rgba(185, 28, 28, 0.9)',
        'purple-transparent': 'rgba(107, 33, 168, 0.9)',
        'lime-transparent': 'rgba(101, 163, 13, 0.9)',
        'amber-transparent': 'rgba(234, 88, 12, 0.9)',
      },
    },
  },
  plugins: [],
};
