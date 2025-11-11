import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    hooks: {
      beforeRequest: [
        (request) => {
          // SSR: Forward cookies from the original request
          if (process.server) {
            try {
              // Utiliser useRequestHeaders() pour récupérer les cookies
              const headers = useRequestHeaders(['cookie'])
              
              if (headers.cookie) {
                request.headers.set('cookie', headers.cookie)
                console.log('[Tuyau SSR] Cookie forwarded to API')
              } else {
                console.log('[Tuyau SSR] No cookie in request headers')
              }
            } catch (error) {
              console.error('[Tuyau SSR] Error forwarding cookies:', error)
            }
          }
        }
      ]
    },
    // Credentials pour le client-side
    credentials: 'include',
  })

  return {
    provide: {
      api: tuyau,
    },
  }
})
