import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    // Utiliser $fetch de Nuxt au lieu de ky pour bénéficier des optimisations SSR
    fetch: (url: string, options?: any) => {
      // SSR: Capturer les cookies de la requête initiale et les transmettre
      const headers: HeadersInit = { ...options?.headers }

      if (import.meta.server) {
        // Récupérer les headers de la requête SSR
        const event = useRequestEvent()
        const cookieHeader = event?.node.req.headers.cookie

        // Transmettre le cookie au backend
        if (cookieHeader) {
          headers.cookie = cookieHeader
        }
      }

      return $fetch(url, {
        ...options,
        headers,
        // Important: envoyer les credentials (cookies) pour les sessions côté client
        credentials: 'include',
      })
    },
  })

  return {
    provide: {
      api: tuyau,
    },
  }
})
