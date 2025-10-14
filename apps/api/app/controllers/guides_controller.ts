import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GuideService from '#services/guide_service'
import ResponseService from '#services/response_service'
import {
  createGuideValidator,
  guideFiltersValidator,
  guideParamsValidator,
  guideSlugParamsValidator,
  updateGuideValidator,
} from '#validators/guide'

@inject()
export default class GuidesController {
  constructor(private guideService: GuideService) {}

  async index(ctx: HttpContext) {
    const filters = await ctx.request.validateUsing(guideFiltersValidator)

    const result = await this.guideService.getGuidesWithFilters({
      gameSlug: filters.game,
      guideTypeId: filters.guideTypeId,
      difficultyId: filters.difficultyId,
      isPopular:
        filters.popular === 'true' ? true : filters.popular === 'false' ? false : undefined,
      limit: filters.limit,
      page: filters.page,
    })

    if (result.pagination) {
      ResponseService.okWithPagination(ctx, result.guides, ResponseService.adaptPaginationMeta(result.pagination))
    } else {
      ResponseService.ok(ctx, result.guides)
    }
  }

  async popular(ctx: HttpContext) {
    const filters = await ctx.request.validateUsing(guideFiltersValidator)
    const limit = filters.limit || 10

    const result = await this.guideService.getGuidesWithFilters({
      isPopular: true,
      limit,
    })

    ResponseService.ok(ctx, result.guides)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideParamsValidator)
    const guide = await this.guideService.getGuideById(validatedParams.id)
    ResponseService.ok(ctx, guide)
  }

  async showBySlug(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideSlugParamsValidator)
    const guide = await this.guideService.getGuideBySlugAndIncrementViews(validatedParams.slug)
    ResponseService.ok(ctx, guide)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createGuideValidator)

    // Transform payload to match repository interface
    const guideData = {
      title: payload.title,
      summary: payload.summary,
      author: payload.author,
      publishedAt: payload.publishedAt,
      slug: payload.slug,
      readingTime: payload.readingTime || null,
      difficultyId: payload.difficultyId,
      guideTypeId: payload.guideTypeId,
      isPopular: payload.isPopular || false,
      gameId: payload.gameId,
      metaDescription: payload.metaDescription || null,
      sections: payload.sections || [],
      prerequisites: payload.prerequisites || [],
      tagIds: payload.tagIds || [],
      seoKeywordIds: payload.seoKeywordIds || [],
    }

    const guide = await this.guideService.createGuide(guideData, payload.image)
    ResponseService.created(ctx, guide, 'Guide créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateGuideValidator)

    // Transform payload to match repository interface
    const updateData = {
      ...(payload.title && { title: payload.title }),
      ...(payload.summary && { summary: payload.summary }),
      ...(payload.author && { author: payload.author }),
      ...(payload.publishedAt && { publishedAt: payload.publishedAt }),
      ...(payload.slug && { slug: payload.slug }),
      ...(payload.readingTime !== undefined && { readingTime: payload.readingTime }),
      ...(payload.difficultyId && { difficultyId: payload.difficultyId }),
      ...(payload.guideTypeId && { guideTypeId: payload.guideTypeId }),
      ...(payload.isPopular !== undefined && { isPopular: payload.isPopular }),
      ...(payload.gameId && { gameId: payload.gameId }),
      ...(payload.metaDescription !== undefined && { metaDescription: payload.metaDescription }),
      ...(payload.sections !== undefined && { sections: payload.sections }),
      ...(payload.prerequisites !== undefined && { prerequisites: payload.prerequisites }),
      ...(payload.tagIds !== undefined && { tagIds: payload.tagIds }),
      ...(payload.seoKeywordIds !== undefined && { seoKeywordIds: payload.seoKeywordIds }),
    }

    const guide = await this.guideService.updateGuide(validatedParams.id, updateData, payload.image)
    ResponseService.ok(ctx, guide, 'Guide mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideParamsValidator)
    await this.guideService.deleteGuide(validatedParams.id)
    ResponseService.success(ctx, 'Guide supprimé avec succès')
  }

  // Utility endpoint to get guides by game
  async byGame(ctx: HttpContext) {
    const gameId = ctx.request.param('gameId')

    if (!gameId || Number.isNaN(Number(gameId))) {
      ResponseService.badRequest(ctx, 'ID du jeu invalide')
      return
    }

    const guides = await this.guideService.getGuidesByGame(Number(gameId))
    ResponseService.ok(ctx, guides)
  }
}
