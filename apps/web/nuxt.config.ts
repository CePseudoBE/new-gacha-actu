import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

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
      titleTemplate: '%s | Anime Gacha Pulse',
      title: 'Anime Gacha Pulse - L\'actualité des jeux Gacha par des passionnés',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Anime Gacha Pulse est LE site d\'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news sur Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !' },
        { name: 'keywords', content: 'gacha, jeux gacha, genshin impact, honkai star rail, fire emblem heroes, arknights, blue archive, epic seven, actualités gaming, guides jeux, tier list, événements gacha, bannières, pulls, héros' },
        { name: 'author', content: 'Équipe Anime Gacha Pulse' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Anime Gacha Pulse' },
        { property: 'og:title', content: 'Anime Gacha Pulse - L\'actualité des jeux Gacha par des passionnés' },
        { property: 'og:description', content: 'Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris. Par des fans, pour les fans.' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Anime Gacha Pulse - Actualités jeux Gacha' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Anime Gacha Pulse - L\'actualité des jeux Gacha' },
        { name: 'twitter:description', content: 'Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris' },
        { name: 'twitter:image', content: '/og-image.jpg' },
        { name: 'twitter:creator', content: '@animegachapulse' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://animegachapulse.com' }
      ]
    }
  },

  site: {
    url: 'https://animegachapulse.com',
    name: 'Anime Gacha Pulse'
  },

  image: {
    domains: ['images.unsplash.com', 'img.youtube.com']
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/seo'
  ]
});