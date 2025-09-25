import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import CacheService from '#services/cache_service'

export default class CacheMiddleware {
  constructor(private cacheService: CacheService = new CacheService()) {}

  async handle(
    { request, response, route }: HttpContext,
    next: NextFn,
    options: { ttl?: number; key?: string } = {}
  ) {
    // Only cache GET requests
    if (request.method() !== 'GET') {
      return next()
    }

    // Skip caching for admin routes
    if (request.url().startsWith('/api/admin')) {
      return next()
    }

    // Generate cache key
    const cacheKey = options.key || this.generateCacheKey(request, route)
    const ttl = options.ttl || CacheService.TTL.MEDIUM

    try {
      // Try to get cached response
      const cachedResponse = await this.cacheService.get<{
        status: number
        body: any
        headers?: Record<string, string>
      }>(cacheKey)

      if (cachedResponse) {
        // Return cached response
        response.status(cachedResponse.status)

        if (cachedResponse.headers) {
          Object.entries(cachedResponse.headers).forEach(([key, value]) => {
            response.header(key, value)
          })
        }

        // Add cache hit header for debugging
        response.header('X-Cache', 'HIT')
        response.header('X-Cache-Key', cacheKey)

        return response.send(cachedResponse.body)
      }

      // Execute the request
      await next()

      // Cache successful responses (200-299)
      if (response.getStatus() >= 200 && response.getStatus() < 300) {
        const responseBody = response.getBody()
        const responseHeaders = response.getHeaders()

        const cacheData = {
          status: response.getStatus(),
          body: responseBody,
          headers: {
            'Content-Type': responseHeaders['content-type'] || 'application/json',
          }
        }

        await this.cacheService.set(cacheKey, cacheData, ttl)

        // Add cache miss header for debugging
        response.header('X-Cache', 'MISS')
        response.header('X-Cache-Key', cacheKey)
      }

    } catch (error) {
      // If caching fails, continue without caching
      console.error('Cache middleware error:', error)
      return next()
    }
  }

  private generateCacheKey(request: any, route: any): string {
    const url = request.url()
    const query = request.qs()

    // Create a deterministic cache key
    const queryString = Object.keys(query).length > 0
      ? `?${new URLSearchParams(query).toString()}`
      : ''

    return `route:${url}${queryString}`
  }
}