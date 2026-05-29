import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  devServer: {
    port: 5102,
    host: '0.0.0.0',
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@ts-rest/core',
        '@zodios/core',
      ],
    },
    server: {
      allowedHosts: ['kindred.deth.dev', '.deth.dev'],
    },
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
    'shadcn-nuxt'
  ],

  supabase: {
    types: false,
    redirect: false,
    clientOptions: {
      db: { schema: 'kindred' },
    },
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/register', '/ui-kit'],
    },
  },

  css: ['~/assets/css/main.css'],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  // Nuxt 4 preference
  future: {
    compatibilityVersion: 4,
  },

  // Environment variables
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://kapi.deth.dev/api/v1'
    }
  },

  // Mobile-first viewport optimization
  app: {
    head: {
      title: 'Kindred',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      meta: [
        { name: 'theme-color', content: '#fff7ed' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Kindred' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },

  // PWA configuration
  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      type: 'module',
    },
    manifest: {
      name: 'Kindred',
      short_name: 'Kindred',
      theme_color: '#fff7ed',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})
