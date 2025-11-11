import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { throttle } from '#start/limiter'

/**
 * Wrapper middleware pour utiliser le throttle limiter comme named middleware
 */
export default class ThrottleMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    return throttle(ctx, next)
  }
}
