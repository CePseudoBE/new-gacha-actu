/**
 * Middleware admin
 * Protège les routes qui nécessitent le rôle admin ou editor
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, canManageContent, fetchUser } = useAuth()

  // Tenter de récupérer l'utilisateur si pas déjà fait
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    })
  }

  // Si authentifié mais pas admin/editor, rediriger vers home avec erreur
  if (!canManageContent.value) {
    const toast = useToast()
    toast.error('Vous n\'avez pas les permissions nécessaires pour accéder à cette page')
    return navigateTo('/')
  }
})
