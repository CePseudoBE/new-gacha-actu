import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TierListService from '#services/tier_list_service'
import ResponseService from '#services/response_service'
import {
  createTierListValidator,
  updateTierListValidator,
  tierListParamsValidator,
  tierListSlugValidator,
  tierListFiltersValidator,
} from '#validators/tier_list'
import { limitValidator } from '#validators/common'

@inject()
export default class TierListsController {
  constructor(private tierListService: TierListService) {}

  async index(ctx: HttpContext) {
    const filters = await ctx.request.validateUsing(tierListFiltersValidator)

    const page = filters.page || 1
    const perPage = filters.perPage || 20
    const tierListFilters = {
      gameId: filters.gameId,
      isPublished: filters.isPublished === 'true' ? true : filters.isPublished === 'false' ? false : undefined,
      search: filters.search,
    }

    const result = await this.tierListService.getTierLists(tierListFilters, page, perPage)

    return ResponseService.okWithPagination(ctx, result.data, ResponseService.adaptPaginationMeta(result.meta))
  }

  async popular(ctx: HttpContext) {
    const query = await ctx.request.validateUsing(limitValidator)
    const limit = query.limit || 10
    const tierLists = await this.tierListService.getPopularTierLists(limit)

    return ResponseService.ok(ctx, tierLists)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListParamsValidator)
    const tierList = await this.tierListService.getTierListById(validatedParams.id)
    return ResponseService.ok(ctx, tierList)
  }

  async showBySlug(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListSlugValidator)
    const tierList = await this.tierListService.getTierListBySlugAndIncrementViews(validatedParams.slug)
    return ResponseService.ok(ctx, tierList)
  }

  async byGame(ctx: HttpContext) {
    const gameId = ctx.request.param('gameId')
    const query = await ctx.request.validateUsing(limitValidator)
    const limit = query.limit || 10

    if (!gameId || Number.isNaN(Number(gameId))) {
      ResponseService.badRequest(ctx, 'ID du jeu invalide')
      return
    }

    const tierLists = await this.tierListService.getTierListsByGameId(Number(gameId), limit)
    return ResponseService.ok(ctx, tierLists)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createTierListValidator)

    const { image, ...restPayload } = payload

    const tierListData = {
      ...restPayload,
      authorId: ctx.auth.user!.id,
    }

    const tierList = await this.tierListService.createTierList(tierListData, image)
    return ResponseService.created(ctx, tierList, 'Tier list créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateTierListValidator)

    const { image, ...restPayload } = payload

    const tierList = await this.tierListService.updateTierList(
      validatedParams.id,
      restPayload,
      image
    )
    return ResponseService.ok(ctx, tierList, 'Tier list mise à jour avec succès')
  }

  async publish(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListParamsValidator)
    const tierList = await this.tierListService.publishTierList(validatedParams.id)
    return ResponseService.ok(ctx, tierList, 'Tier list publiée avec succès')
  }

  async unpublish(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListParamsValidator)
    const tierList = await this.tierListService.unpublishTierList(validatedParams.id)
    return ResponseService.ok(ctx, tierList, 'Tier list dépubliée avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListParamsValidator)
    await this.tierListService.deleteTierList(validatedParams.id)
    return ResponseService.success(ctx, 'Tier list supprimée avec succès')
  }
}
