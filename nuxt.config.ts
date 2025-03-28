import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'nuxt-file-storage',
    '@nuxt/eslint',
    'nuxt-easy-lightbox',
    '@sidebase/nuxt-auth',
    '@nuxtjs/i18n',
    'vue-yandex-maps/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fileStorage: {
    mount: '/home/$USR/development/nuxt-file-storage/server/files',
  },
  fonts: {
    families: [
      {
        name: 'My Latin Font',
        provider: 'google',
        weights: [400, 700],
        subsets: ['latin'],
      },
      {
        name: 'My Cyrillic Font',
        provider: 'google',
        weights: [400, 700],
        subsets: ['cyrillic'],
      },
      {
        name: 'Noto Sans Armenian',
        provider: 'google',
        weights: [400, 700],
        subsets: ['armenian'],
      },
    ],
  },
  yandexMaps: {
    apikey: process.env.YANDEX_API_KEY || 'your-api-key',
  },
  auth: {
    isEnabled: true,
    baseURL: process.env.NUXT_AUTH_ORIGIN || 'http://localhost:3000/api/auth',
    provider: {
      type: 'authjs',
      trustHost: true,
    },
    sessionRefresh: {
      enablePeriodically: 30000,
      enableOnWindowFocus: true,
    },
  },
  routeRules: {
    '*': {
      appMiddleware: ['redirect-admin'],
    },
  },
  i18n: {
    lazy: true,
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json',
        name: 'English',
      },
      {
        code: 'am',
        iso: 'am-AM',
        file: 'am-AM.json',
        name: 'Armenian',
      },
      {
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.json',
        name: 'Russian',
      },
    ],
    defaultLocale: 'am',
  },
  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      NUXT_SITE_URL: process.env.NUXT_SITE_URL,
      NUXT_API_BASE_URL: process.env.NUXT_API_BASE_URL,
      NUXT_AUTH_ORIGIN: process.env.NUXT_AUTH_ORIGIN,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      YANDEX_API_KEY: process.env.YANDEX_API_KEY,
      TAWK_PROPERTY_ID: process.env.TAWK_PROPERTY_ID,
      TAWK_WIDGET_ID: process.env.TAWK_WIDGET_ID,
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  plugins: ['~/plugins/mask.ts', '~/plugins/vue-draggable-next.client.ts'],
});
