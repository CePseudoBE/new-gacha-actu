import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const err = error as any

    // 404 - Not Found
    if (err.code === 'E_NOT_FOUND' || err.status === 404) {
      return ctx.response.notFound({
        success: false,
        error: 'Ressource introuvable',
        code: 'E_NOT_FOUND',
      })
    }

    // 401 - Unauthorized
    if (err.code === 'E_UNAUTHORIZED' || err.status === 401) {
      return ctx.response.unauthorized({
        success: false,
        error: 'Non authentifié',
        code: 'E_UNAUTHORIZED',
      })
    }

    // 403 - Forbidden
    if (err.code === 'E_FORBIDDEN' || err.status === 403) {
      return ctx.response.forbidden({
        success: false,
        error: 'Accès refusé',
        code: 'E_FORBIDDEN',
      })
    }

    // 422 - Validation Error
    if (err.code === 'E_VALIDATION_ERROR' || err.status === 422) {
      return ctx.response.unprocessableEntity({
        success: false,
        error: 'Erreur de validation',
        code: 'E_VALIDATION_ERROR',
        messages: err.messages || [],
      })
    }

    // 429 - Too Many Requests
    if (err.code === 'E_TOO_MANY_REQUESTS' || err.status === 429) {
      return ctx.response.tooManyRequests({
        success: false,
        error: 'Trop de requêtes',
        code: 'E_TOO_MANY_REQUESTS',
      })
    }

    // 500 - Server Error
    if (!this.debug && err.status >= 500) {
      return ctx.response.internalServerError({
        success: false,
        error: 'Une erreur serveur est survenue',
        code: 'E_INTERNAL_SERVER_ERROR',
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    if (
      app.inTest &&
      error instanceof Error &&
      ((error as any).code === 'E_VALIDATION_ERROR' ||
        (error as any).code === 'E_NOT_FOUND' ||
        (error as any).code === 'NOT_FOUND')
    ) {
      return
    }

    return super.report(error, ctx)
  }
}
