/**
 * Plugin pour gérer automatiquement les balises canonical
 * Génère une canonical pour chaque page basée sur l'URL courante
 */
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl

  // useHead avec une fonction pour rendre la canonical réactive
  useHead({
    link: [
      {
        rel: 'canonical',
        href: () => `${siteUrl}${route.path}`,
      },
    ],
  })
})
