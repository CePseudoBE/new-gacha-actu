import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { throttle } from '#start/limiter'
import env from '#start/env'

/**
 * Wrapper middleware pour utiliser le throttle limiter comme named middleware
 */
export default class ThrottleMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (env.get('NODE_ENV') === 'test') {
      return next()
    }

    return throttle(ctx, next)
  }
}
