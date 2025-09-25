import type { HttpContext } from '@adonisjs/core/http'

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  message?: string
  meta?: {
    pagination?: PaginationMeta
    [key: string]: any
  }
}

export default class ResponseService {
  static ok<T>(ctx: HttpContext, data: T, message?: string): void {
    ctx.response.ok({
      success: true,
      data,
      ...(message && { message }),
    })
  }

  static okWithPagination<T>(
    ctx: HttpContext,
    data: T,
    pagination: PaginationMeta,
    message?: string
  ): void {
    ctx.response.ok({
      success: true,
      data,
      meta: { pagination },
      ...(message && { message }),
    })
  }

  static created<T>(ctx: HttpContext, data: T, message?: string): void {
    ctx.response.created({
      success: true,
      data,
      message: message || 'Ressource créée avec succès',
    })
  }

  static success(ctx: HttpContext, message: string): void {
    ctx.response.ok({
      success: true,
      message,
    })
  }

  static notFound(ctx: HttpContext, message: string = 'Ressource non trouvée'): void {
    ctx.response.notFound({
      success: false,
      error: message,
    })
  }

  static badRequest(ctx: HttpContext, message: string = 'Requête invalide'): void {
    ctx.response.badRequest({
      success: false,
      error: message,
    })
  }

  static conflict(ctx: HttpContext, message: string = "Conflit lors de l'opération"): void {
    ctx.response.conflict({
      success: false,
      error: message,
    })
  }

  static unprocessableEntity(ctx: HttpContext, message: string = 'Données non traitables'): void {
    ctx.response.unprocessableEntity({
      success: false,
      error: message,
    })
  }

  static internalServerError(
    ctx: HttpContext,
    message: string = 'Erreur interne du serveur'
  ): void {
    ctx.response.internalServerError({
      success: false,
      error: message,
    })
  }
}
