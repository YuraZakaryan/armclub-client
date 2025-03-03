/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  darkMode: 'false',
  theme: {
    extend: {
      screens: {
        // min-width
        'mobile-min-s': { min: '320px' },
        'mobile-min-m': { min: '375px' },
        'mobile-min-l': { min: '425px' },
        'mobile-min-xl': { min: '577px' },
        'tablet-min': { min: '768px' },
        'laptop-min': { min: '1024px' },
        'laptop-min-m': { min: '1280px' },
        'laptop-min-l': { min: '1440px' },
        'desktop-min': { min: '2560px' },

        // max-width
        'mobile-max-s': { max: '320px' },
        'mobile-max-m': { max: '375px' },
        'mobile-max-l': { max: '425px' },
        'mobile-max-xl': { max: '577px' },
        'tablet-max': { max: '768px' },
        'laptop-max': { max: '1024px' },
        'laptop-max-m': { max: '1280px' },
        'laptop-max-l': { max: '1440px' },
        'desktop-max': { max: '2560px' },
      },
    },
  },
  plugins: [],
};
