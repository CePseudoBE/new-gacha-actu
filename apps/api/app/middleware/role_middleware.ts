import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      roles?: string[]
    } = {}
  ) {
    const user = ctx.auth.use('web').user

    if (!user) {
      return ctx.response.unauthorized({
        success: false,
        error: 'Utilisateur non authentifié',
      })
    }

    // Load role if not already loaded
    if (!user.role) {
      await user.load('role')
    }

    // If no roles specified, just check that user is authenticated
    if (!options.roles || options.roles.length === 0) {
      return next()
    }

    // Check if user has one of the required roles
    const hasRole = options.roles.includes(user.role.slug)

    if (!hasRole) {
      return ctx.response.forbidden({
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
      })
    }

    return next()
  }
}
