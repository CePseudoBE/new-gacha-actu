/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une authentification
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth()

  // Tenter de récupérer l'utilisateur si pas déjà fait
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // Si toujours pas authentifié, rediriger vers login
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    })
  }
})
