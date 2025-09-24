import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import GameService from '#services/game_service'
import QueryValidationService from '#services/query_validation_service'
import {
  createGameValidator,
  updateGameValidator,
  gameParamsValidator,
  gameSlugParamsValidator
} from '#validators/game'

@inject()
export default class GamesController {
  constructor(private gameService: GameService) {}

  async index(ctx: HttpContext) {
    const { page, perPage, filters } = await QueryValidationService.validateGameFilters(ctx)
    const result = await this.gameService.getGames(filters, page, perPage)

    return ctx.response.ok({
      success: true,
      data: result.data,
      meta: {
        pagination: result.meta,
      },
    })
  }

  async popular(ctx: HttpContext) {
    const { limit } = await QueryValidationService.validateLimit(ctx)
    const games = await this.gameService.getPopularGames(limit)

    return ctx.response.ok({
      success: true,
      data: games,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(gameSlugParamsValidator)
    const game = await this.gameService.getGameBySlug(validatedParams.slug)

    if (!game) {
      return response.notFound({
        success: false,
        error: 'Jeu non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: game,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGameValidator)

    // Convert Date to DateTime for Luxon compatibility and handle relations
    const {
      genreId,
      platformId,
      tagId,
      genreIds,
      platformIds,
      tagIds,
      releaseDate,
      ...restPayload
    } = payload

    const gameData = {
      ...restPayload,
      releaseDate: DateTime.fromJSDate(releaseDate),
      // Ensure we use the arrays from the validator (which already transformed single to array)
      genreIds: genreId || genreIds || undefined,
      platformIds: platformId || platformIds || undefined,
      tagIds: tagId || tagIds || undefined,
    }

    const game = await this.gameService.createGame(gameData)

    return response.created({
      success: true,
      data: game,
      message: 'Jeu créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(updateGameValidator)

    const {
      genreId,
      platformId,
      tagId,
      genreIds,
      platformIds,
      tagIds,
      releaseDate,
      officialSite,
      wiki,
      ...restPayload
    } = payload

    const gameData = {
      ...restPayload,
      releaseDate: releaseDate ? DateTime.fromJSDate(releaseDate) : undefined,
      officialSite: officialSite === null ? undefined : officialSite,
      wiki: wiki === null ? undefined : wiki,
      // Handle relations
      genreIds: genreId || genreIds || undefined,
      platformIds: platformId || platformIds || undefined,
      tagIds: tagId || tagIds || undefined,
    }

    const game = await this.gameService.updateGame(validatedParams.id, gameData)

    return response.ok({
      success: true,
      data: game,
      message: 'Jeu mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(gameParamsValidator)
    await this.gameService.deleteGame(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Jeu supprimé avec succès',
    })
  }

  async stats({ response }: HttpContext) {
    const stats = await this.gameService.getGameStats()

    return response.ok({
      success: true,
      data: stats,
    })
  }
}
