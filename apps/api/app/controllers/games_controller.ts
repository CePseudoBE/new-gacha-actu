import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import GameService from '#services/game_service'
import QueryValidationService from '#services/query_validation_service'
import { createGameValidator, updateGameValidator } from '#validators/game'

@inject()
export default class GamesController {
  constructor(private gameService: GameService) {}

  /**
   * GET /games
   * Liste des jeux avec pagination et filtres
   */
  async index(ctx: HttpContext) {
    const { page, perPage, filters } = await QueryValidationService.validateGameFilters(ctx)

    const games = await this.gameService.getGames(filters, page, perPage)

    return ctx.response.ok({
      success: true,
      data: games.serialize(),
      meta: {
        pagination: games.getMeta(),
      },
    })
  }

  /**
   * GET /games/popular
   * Jeux populaires
   */
  async popular(ctx: HttpContext) {
    const { limit } = await QueryValidationService.validateLimit(ctx)
    const games = await this.gameService.getPopularGames(limit)

    return ctx.response.ok({
      success: true,
      data: games,
    })
  }

  /**
   * GET /games/:slug
   * Affichage d'un jeu par son slug
   */
  async show({ params, response }: HttpContext) {
    const game = await this.gameService.getGameBySlug(params.slug)

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

  /**
   * POST /admin/games
   * Création d'un jeu (admin uniquement)
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGameValidator)

    // Convertir Date en DateTime pour Luxon
    const gameData = {
      ...payload,
      releaseDate: DateTime.fromJSDate(payload.releaseDate),
    }

    const game = await this.gameService.createGame(gameData)

    return response.created({
      success: true,
      data: game,
      message: 'Jeu créé avec succès',
    })
  }

  /**
   * PUT /admin/games/:id
   * Mise à jour d'un jeu (admin uniquement)
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateGameValidator)

    // Convertir Date en DateTime et gérer les null
    const gameData = {
      ...payload,
      releaseDate: payload.releaseDate ? DateTime.fromJSDate(payload.releaseDate) : undefined,
      officialSite: payload.officialSite === null ? undefined : payload.officialSite,
      wiki: payload.wiki === null ? undefined : payload.wiki,
    }

    const game = await this.gameService.updateGame(params.id, gameData)

    return response.ok({
      success: true,
      data: game,
      message: 'Jeu mis à jour avec succès',
    })
  }

  /**
   * DELETE /admin/games/:id
   * Suppression d'un jeu (admin uniquement)
   */
  async destroy({ params, response }: HttpContext) {
    await this.gameService.deleteGame(params.id)

    return response.ok({
      success: true,
      message: 'Jeu supprimé avec succès',
    })
  }

  /**
   * GET /admin/games/stats
   * Statistiques des jeux (admin uniquement)
   */
  async stats({ response }: HttpContext) {
    const stats = await this.gameService.getGameStats()

    return response.ok({
      success: true,
      data: stats,
    })
  }
}
