import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    // Utiliser $fetch de Nuxt au lieu de ky pour bénéficier des optimisations SSR
    fetch: (url: string, options?: any) => {
      return $fetch(url, {
        ...options,
        // Important: envoyer les credentials (cookies) pour les sessions
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
