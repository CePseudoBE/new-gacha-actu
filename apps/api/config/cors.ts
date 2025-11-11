import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: env.get('CORS_ENABLED', true),

  /**
   * In production, use the CORS_ORIGIN environment variable to specify allowed origins
   * In development, allow all origins
   */
  origin: (origin) => {
    const allowedOrigins = env.get('CORS_ORIGIN')

    if (!allowedOrigins) {
      return true // Allow all origins in development
    }

    const origins = allowedOrigins.split(',').map(o => o.trim())
    return origins.includes(origin || '') || true
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: true,
  exposeHeaders: [],
  credentials: env.get('CORS_CREDENTIALS', true),
  maxAge: 90,
})

export default corsConfig
