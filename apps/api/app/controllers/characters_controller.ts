import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import CharacterService from '#services/character_service'
import ResponseService from '#services/response_service'
import {
  createCharacterValidator,
  updateCharacterValidator,
  characterParamsValidator,
  characterSlugValidator,
  characterFiltersValidator,
} from '#validators/character'
import { limitValidator } from '#validators/common'

@inject()
export default class CharactersController {
  constructor(private characterService: CharacterService) {}

  async index(ctx: HttpContext) {
    const filters = await ctx.request.validateUsing(characterFiltersValidator)

    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const characterFilters = {
      gameId: filters.gameId,
      rarity: filters.rarity,
      element: filters.element,
      role: filters.role,
      isLimited: filters.isLimited === 'true' ? true : filters.isLimited === 'false' ? false : undefined,
      search: filters.search,
    }

    const result = await this.characterService.getCharacters(characterFilters, page, perPage)

    return ResponseService.okWithPagination(ctx, result.data, ResponseService.adaptPaginationMeta(result.meta))
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(characterParamsValidator)
    const character = await this.characterService.getCharacterById(validatedParams.id)
    return ResponseService.ok(ctx, character)
  }

  async showBySlug(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(characterSlugValidator)
    const character = await this.characterService.getCharacterBySlug(validatedParams.slug)
    return ResponseService.ok(ctx, character)
  }

  async byGame(ctx: HttpContext) {
    const gameId = ctx.request.param('gameId')
    const query = await ctx.request.validateUsing(limitValidator)
    const limit = query.limit || 100

    if (!gameId || Number.isNaN(Number(gameId))) {
      ResponseService.badRequest(ctx, 'ID du jeu invalide')
      return
    }

    const characters = await this.characterService.getCharactersByGameId(Number(gameId), limit)
    return ResponseService.ok(ctx, characters)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createCharacterValidator)

    const { releaseDate, image, ...restPayload } = payload

    const characterData = {
      ...restPayload,
      releaseDate: releaseDate ? DateTime.fromJSDate(releaseDate) : undefined,
    }

    const character = await this.characterService.createCharacter(characterData, image)
    return ResponseService.created(ctx, character, 'Personnage créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateCharacterValidator)

    const { releaseDate, image, ...restPayload } = payload

    const updateData = {
      ...restPayload,
      releaseDate: releaseDate ? DateTime.fromJSDate(releaseDate) : undefined,
    }

    const character = await this.characterService.updateCharacter(
      validatedParams.id,
      updateData,
      image
    )
    return ResponseService.ok(ctx, character, 'Personnage mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(characterParamsValidator)
    await this.characterService.deleteCharacter(validatedParams.id)
    return ResponseService.success(ctx, 'Personnage supprimé avec succès')
  }
}
