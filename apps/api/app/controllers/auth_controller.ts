import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import {
  loginValidator,
  registerValidator,
  changePasswordValidator,
} from '#validators/auth'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user
   */
  async register(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(registerValidator)

    const user = await this.authService.register(data)

    return ResponseService.created(ctx, user, 'Compte créé avec succès')
  }

  /**
   * Login user
   */
  async login(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(loginValidator)

    const user = await this.authService.login(ctx, data)

    return ResponseService.ok(ctx, user, 'Connexion réussie')
  }

  /**
   * Logout user
   */
  async logout(ctx: HttpContext) {
    await this.authService.logout(ctx)

    return ResponseService.success(ctx, 'Déconnexion réussie')
  }

  /**
   * Get current authenticated user
   */
  async me(ctx: HttpContext) {
    const user = await this.authService.getCurrentUser(ctx)

    return ResponseService.ok(ctx, user)
  }

  /**
   * Change user password
   */
  async changePassword(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(changePasswordValidator)

    await this.authService.changePassword(ctx, data)

    return ResponseService.success(ctx, 'Mot de passe modifié avec succès')
  }
}
