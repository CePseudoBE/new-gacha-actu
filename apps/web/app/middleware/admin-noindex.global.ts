/**
 * Middleware global pour ajouter noindex sur les pages admin
 * Empêche Google d'indexer les pages d'administration
 */
export default defineNuxtRouteMiddleware((to) => {
  // Si c'est une page admin ou maintenance
  if (to.path.startsWith('/admin') || to.path === '/maintenance') {
    useHead({
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    })
  }
})
