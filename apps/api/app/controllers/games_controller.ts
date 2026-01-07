import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import GameService from '#services/game_service'
import ResponseService from '#services/response_service'
import {
  createGameValidator,
  gameParamsValidator,
  updateGameValidator,
} from '#validators/game'
import { gameFiltersValidator, limitValidator } from '#validators/common'

@inject()
export default class GamesController {
  constructor(private gameService: GameService) {}

  async index(ctx: HttpContext) {
    const filters = await ctx.request.validateUsing(gameFiltersValidator)

    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const gameFilters = {
      search: filters.search,
      isPopular: filters.isPopular,
      genreIds: filters.genreIds,
      platformIds: filters.platformIds,
    }

    const result = await this.gameService.getGames(gameFilters, page, perPage)

    return ResponseService.okWithPagination(ctx, result.data, ResponseService.adaptPaginationMeta(result.meta))
  }

  async popular(ctx: HttpContext) {
    const query = await ctx.request.validateUsing(limitValidator)
    const limit = query.limit || 10
    const games = await this.gameService.getPopularGames(limit)

    return ResponseService.ok(ctx, games)
  }

  async show(ctx: HttpContext) {
    // Check if param is a number (ID) or string (slug)
    const param = ctx.params.slug || ctx.params.id

    if (!isNaN(Number(param))) {
      // It's an ID
      const game = await this.gameService.getGameById(Number(param))
      return ResponseService.ok(ctx, game)
    } else {
      // It's a slug
      const game = await this.gameService.getGameBySlug(param)
      return ResponseService.ok(ctx, game)
    }
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createGameValidator)

    // Convert Date to DateTime for Luxon compatibility and handle relations
    const {
      genreId,
      platformId,
      tagId,
      genreIds,
      platformIds,
      tagIds,
      releaseDate,
      image,
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

    const game = await this.gameService.createGame(gameData, image)
    return ResponseService.created(ctx, game, 'Jeu créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateGameValidator)

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
      image,
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

    const game = await this.gameService.updateGame(validatedParams.id, gameData, image)
    return ResponseService.ok(ctx, game, 'Jeu mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(gameParamsValidator)
    await this.gameService.deleteGame(validatedParams.id)
    return ResponseService.success(ctx, 'Jeu supprimé avec succès')
  }

  async stats(ctx: HttpContext) {
    const stats = await this.gameService.getGameStats()
    return ResponseService.ok(ctx, stats)
  }
}
