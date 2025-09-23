import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

export default class QueryValidationService {

  /**
   * Valide les paramètres de pagination
   */
  static async validatePagination(ctx: HttpContext) {
    const validator = vine.compile(
      vine.object({
        page: vine.number().min(1).optional(),
        perPage: vine.number().min(1).max(100).optional(),
      })
    )

    // Récupérer les query params et les valider
    const queryParams = ctx.request.qs()
    const validatedParams = await validator.validate(queryParams)

    return {
      page: validatedParams.page || 1,
      perPage: validatedParams.perPage || 20,
    }
  }

  /**
   * Valide les paramètres de recherche avec pagination
   */
  static async validateSearchWithPagination(ctx: HttpContext) {
    const validator = vine.compile(
      vine.object({
        page: vine.number().min(1).optional(),
        perPage: vine.number().min(1).max(100).optional(),
        search: vine.string().trim().minLength(1).optional(),
      })
    )

    const queryParams = ctx.request.qs()
    const validatedParams = await validator.validate(queryParams)

    return {
      page: validatedParams.page || 1,
      perPage: validatedParams.perPage || 20,
      search: validatedParams.search,
    }
  }

  /**
   * Valide les paramètres de limite
   */
  static async validateLimit(ctx: HttpContext) {
    const validator = vine.compile(
      vine.object({
        limit: vine.number().min(1).max(50).optional(),
      })
    )

    const queryParams = ctx.request.qs()
    const validatedParams = await validator.validate(queryParams)

    return {
      limit: validatedParams.limit || 10,
    }
  }

  /**
   * Valide les filtres spécifiques aux jeux
   */
  static async validateGameFilters(ctx: HttpContext) {
    const validator = vine.compile(
      vine.object({
        page: vine.number().min(1).optional(),
        perPage: vine.number().min(1).max(100).optional(),
        search: vine.string().trim().minLength(1).optional(),
        isPopular: vine.boolean().optional(),
        genreIds: vine.array(vine.number().min(1)).optional(),
        platformIds: vine.array(vine.number().min(1)).optional(),
      })
    )

    const queryParams = ctx.request.qs()
    const validatedParams = await validator.validate(queryParams)

    return {
      page: validatedParams.page || 1,
      perPage: validatedParams.perPage || 20,
      filters: {
        search: validatedParams.search,
        isPopular: validatedParams.isPopular,
        genreIds: validatedParams.genreIds,
        platformIds: validatedParams.platformIds,
      }
    }
  }
}