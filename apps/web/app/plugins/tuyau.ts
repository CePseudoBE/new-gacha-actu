import { createTuyau } from '@tuyau/client'
import { api } from 'api/.adonisjs/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const tuyau = createTuyau({
    api,
    baseUrl: config.public.apiUrl,
    fetch: (url: string, options?: any) => {
      const headers: Record<string, string> = { ...(options?.headers || {}) }

      if (process.server) {
        try {
          const event = useRequestEvent()
          const cookieHeader = event?.node.req.headers.cookie

          console.log('[Tuyau SSR] Request URL:', url)
          console.log('[Tuyau SSR] Cookie from request:', cookieHeader ? 'Present' : 'Missing')

          if (cookieHeader) {
            headers['cookie'] = cookieHeader
            console.log('[Tuyau SSR] Cookie forwarded to API')
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
