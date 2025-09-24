import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

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
    if (
      error instanceof Error &&
      (error as any).code === 'E_NOT_FOUND' &&
      (error as any).status === 404
    ) {
      return ctx.response.notFound({
        success: false,
        error: 'Resource not found',
        code: 'E_NOT_FOUND',
        messages: (error as any).messages || []
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
      ((error as any).code === 'E_VALIDATION_ERROR' || (error as any).code === 'E_NOT_FOUND')
    ) {
      return
    }

    return super.report(error, ctx)
  }
}
