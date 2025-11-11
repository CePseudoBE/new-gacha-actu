/**
 * Middleware guest
 * Redirige les utilisateurs authentifiés (empêche l'accès aux pages login/register si déjà connecté)
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser } = useAuth()

  // Tenter de récupérer l'utilisateur si pas déjà fait
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // Si authentifié, rediriger vers l'admin
  if (isAuthenticated.value) {
    return navigateTo('/admin')
  }
})
