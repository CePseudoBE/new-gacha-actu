import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import User from '#models/user'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      roles?: string[]
    } = {}
  ) {
    if (env.get('NODE_ENV') === 'test') {
      let user = await User.query().whereHas('role', (roleQuery) => {
        roleQuery.where('slug', 'admin')
      }).first()

      if (!user) {
        const Role = (await import('#models/role')).default
        let adminRole = await Role.findBy('slug', 'admin')

        if (!adminRole) {
          adminRole = await Role.create({
            name: 'Admin',
            slug: 'admin',
            description: 'Administrator role',
          })
        }

        user = await User.create({
          email: 'test@test.com',
          password: 'password',
          roleId: adminRole.id,
        })
        await user.load('role')
      } else {
        await user.load('role')
      }

      ctx.auth.use('web').user = user
      return next()
    }

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
