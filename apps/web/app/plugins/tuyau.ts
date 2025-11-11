import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Capturer les headers SSR AU MOMENT de l'initialisation du plugin
  let ssrCookie: string | undefined

  if (process.server) {
    try {
      const headers = useRequestHeaders(['cookie'])
      ssrCookie = headers.cookie
      console.log('[Tuyau Plugin] SSR Cookie captured:', ssrCookie ? 'YES' : 'NO')
    } catch (error) {
      console.error('[Tuyau Plugin] Failed to capture SSR cookie:', error)
    }
  }

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    hooks: {
      beforeRequest: [
        (request) => {
          // SSR: Utiliser le cookie capturé lors de l'init
          if (process.server && ssrCookie) {
            request.headers.set('cookie', ssrCookie)
            console.log('[Tuyau Hook] Cookie forwarded')
          }
        }
      ]
    },
    credentials: 'include',
  })

  return {
    provide: {
      api: tuyau,
    },
  }
})
