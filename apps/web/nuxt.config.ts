import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css", "vue-sonner/style.css"],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3333',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://gachapulse.com'
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "@",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      extensions: ['.vue'],
      pathPrefix: false,
    }
  ],

  app: {
    head: {
      titleTemplate: '%s | GachaPulse',
      title: 'GachaPulse - L\'actualité des jeux Gacha par des passionnés',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'GachaPulse est LE site d\'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news sur Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !' },
        { name: 'keywords', content: 'gacha, jeux gacha, genshin impact, honkai star rail, fire emblem heroes, arknights, blue archive, epic seven, actualités gaming, guides jeux, tier list, événements gacha, bannières, pulls, héros' },
        { name: 'author', content: 'Équipe GachaPulse' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'GachaPulse' },
        { property: 'og:title', content: 'GachaPulse - L\'actualité des jeux Gacha par des passionnés' },
        { property: 'og:description', content: 'Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris. Par des fans, pour les fans.' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'GachaPulse - Actualités jeux Gacha' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'GachaPulse - L\'actualité des jeux Gacha' },
        { name: 'twitter:description', content: 'Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris' },
        { name: 'twitter:image', content: '/og-image.jpg' },
        { name: 'twitter:creator', content: '@gachapulse' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://gachapulse.com' }
      ]
    }
  },

  site: {
    url: 'https://gachapulse.com',
    name: 'GachaPulse'
  },

  sitemap: {
    enabled: true,
    cacheMaxAgeSeconds: 3600, // 1 heure
    sources: [
      '/api/__sitemap__/urls'
    ]
  },

  image: {
    // Désactiver optimisations d'images en dev si trop lent
    ...(process.env.NODE_ENV === 'development' && {
      provider: 'none'
    }),
    domains: ['images.unsplash.com', 'img.youtube.com']
  },

  // Optimisation Nitro pour Windows (gain majeur sur temps de build)
  // Ref: https://github.com/nuxt/nuxt/discussions/26739
  nitro: {
    experimental: {
      legacyExternals: true // Réduit build time de ~60min à ~2min sur Windows
    },
    minify: true,
    sourceMap: false // Désactiver source maps en prod pour accélérer
  },

  experimental: {
    // Améliore les performances de navigation
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/seo'
  ]
});