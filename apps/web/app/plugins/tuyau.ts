import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    // Utiliser $fetch de Nuxt au lieu de ky pour bénéficier des optimisations SSR
    fetcher: (url, options) => {
      return $fetch(url, options)
    },
  })

  return {
    provide: {
      api: tuyau,
    },
  }
})
