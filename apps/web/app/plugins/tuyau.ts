import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'
import type { H3Event } from 'h3'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    fetch: (url: string, options?: any) => {
      const headers: Record<string, string> = { ...(options?.headers || {}) }

      if (process.server) {
        try {
          // Récupérer l'event depuis le contexte Nuxt (ssrContext)
          const event = nuxtApp.ssrContext?.event as H3Event | undefined

          if (event?.node?.req?.headers?.cookie) {
            const cookieHeader = event.node.req.headers.cookie
            headers['cookie'] = cookieHeader
            console.log('[Tuyau SSR] Cookie forwarded to:', url)
          } else {
            console.log('[Tuyau SSR] No cookie found for:', url)
          }
        } catch (error) {
          console.error('[Tuyau SSR] Error forwarding cookies:', error)
        }
      }

      return $fetch(url, {
        ...options,
        headers,
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
