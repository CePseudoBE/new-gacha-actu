import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export class NotFoundException extends Exception {
  static status = 404
  static code = 'NOT_FOUND'

  constructor(message: string = 'Ressource non trouvée') {
    super(message, { status: 404, code: 'NOT_FOUND' })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.notFound({
      success: false,
      error: error.message,
      code: error.code,
    })
  }
}

export class ConflictException extends Exception {
  static status = 409
  static code = 'CONFLICT'

  constructor(message: string = "Conflit lors de l'opération") {
    super(message, { status: 409, code: 'CONFLICT' })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.conflict({
      success: false,
      error: error.message,
      code: error.code,
    })
  }
}

export class BadRequestException extends Exception {
  static status = 400
  static code = 'BAD_REQUEST'

  constructor(message: string = 'Requête invalide') {
    super(message, { status: 400, code: 'BAD_REQUEST' })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.badRequest({
      success: false,
      error: error.message,
      code: error.code,
    })
  }
}

export class UnprocessableEntityException extends Exception {
  static status = 422
  static code = 'UNPROCESSABLE_ENTITY'

  constructor(message: string = 'Données non traitables') {
    super(message, { status: 422, code: 'UNPROCESSABLE_ENTITY' })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.unprocessableEntity({
      success: false,
      error: error.message,
      code: error.code,
    })
  }
}
