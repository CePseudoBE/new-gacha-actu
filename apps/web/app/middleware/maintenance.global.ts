/**
 * Middleware global pour vérifier le mode maintenance
 * Redirige vers la page de maintenance si activé (sauf pour admin)
 */

// Cache pour éviter trop d'appels API (5 secondes)
let maintenanceCache: { isEnabled: boolean; timestamp: number } | null = null
const CACHE_DURATION = 5000 // 5 secondes

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip pour la page de maintenance elle-même et les routes admin
  if (to.path === '/maintenance' || to.path.startsWith('/admin')) {
    return
  }

  // Vérifier le cache d'abord
  const now = Date.now()
  if (maintenanceCache && now - maintenanceCache.timestamp < CACHE_DURATION) {
    if (maintenanceCache.isEnabled) {
      return navigateTo('/maintenance')
    }
    return
  }

  // Check maintenance status (SSR + client)
  try {
    const api = useApi()
    const { data } = await api.api.maintenance.status.$get()

    const isEnabled = data?.data?.isEnabled || false

    // Mettre à jour le cache
    maintenanceCache = {
      isEnabled,
      timestamp: now,
    }

    if (isEnabled) {
      return navigateTo('/maintenance')
    }
  } catch (error) {
    // En cas d'erreur API, on laisse passer (le site reste accessible)
    console.error('Maintenance check error:', error)
    // Cache une réponse négative pour éviter de spammer l'API
    maintenanceCache = {
      isEnabled: false,
      timestamp: now,
    }
  }
})
