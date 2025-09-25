import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GuideService from '#services/guide_service'
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

  async index({ request, response }: HttpContext) {
    try {
      const filters = await request.validateUsing(guideFiltersValidator)

      const result = await this.guideService.getGuidesWithFilters({
        gameSlug: filters.game,
        guideTypeId: filters.guideTypeId,
        difficultyId: filters.difficultyId,
        isPopular:
          filters.popular === 'true' ? true : filters.popular === 'false' ? false : undefined,
        limit: filters.limit,
        page: filters.page,
      })

      return response.ok({
        success: true,
        data: result.guides,
        ...(result.pagination && { pagination: result.pagination }),
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        error: 'Erreur lors de la récupération des guides',
        details: error.message,
      })
    }
  }

  async popular({ request, response }: HttpContext) {
    try {
      const filters = await request.validateUsing(guideFiltersValidator)
      const limit = filters.limit || 10

      const result = await this.guideService.getGuidesWithFilters({
        isPopular: true,
        limit,
      })

      return response.ok({
        success: true,
        data: result.guides,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        error: 'Erreur lors de la récupération des guides populaires',
        details: error.message,
      })
    }
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(guideParamsValidator)
    const guide = await this.guideService.getGuideById(validatedParams.id)

    if (!guide) {
      return response.notFound({
        success: false,
        error: 'Guide non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: guide,
    })
  }

  async showBySlug({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(guideSlugParamsValidator)

    // Get guide and increment view count
    const guide = await this.guideService.getGuideBySlugAndIncrementViews(validatedParams.slug)

    if (!guide) {
      return response.notFound({
        success: false,
        error: 'Guide non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: guide,
    })
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createGuideValidator)

      // Transform payload to match repository interface
      const guideData = {
        title: payload.title,
        summary: payload.summary,
        author: payload.author,
        publishedAt: payload.publishedAt,
        slug: payload.slug,
        imageUrl: payload.imageUrl || null,
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

      const guide = await this.guideService.createGuide(guideData)

      return response.created({
        success: true,
        data: guide,
        message: 'Guide créé avec succès',
      })
    } catch (error) {
      if (error.message === 'Guide must contain at least one section') {
        return response.badRequest({
          success: false,
          error: 'Le guide doit contenir au moins une section',
        })
      }

      return response.badRequest({
        success: false,
        error: 'Erreur lors de la création du guide',
        details: error.message,
      })
    }
  }

  async update({ request, response }: HttpContext) {
    try {
      const { params: validatedParams, ...payload } =
        await request.validateUsing(updateGuideValidator)

      // Transform payload to match repository interface
      const updateData = {
        ...(payload.title && { title: payload.title }),
        ...(payload.summary && { summary: payload.summary }),
        ...(payload.author && { author: payload.author }),
        ...(payload.publishedAt && { publishedAt: payload.publishedAt }),
        ...(payload.slug && { slug: payload.slug }),
        ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
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

      const guide = await this.guideService.updateGuide(validatedParams.id, updateData)

      if (!guide) {
        return response.notFound({
          success: false,
          error: 'Guide non trouvé',
        })
      }

      return response.ok({
        success: true,
        data: guide,
        message: 'Guide mis à jour avec succès',
      })
    } catch (error) {
      if (error.message === 'Guide must contain at least one section') {
        return response.badRequest({
          success: false,
          error: 'Le guide doit contenir au moins une section',
        })
      }

      return response.badRequest({
        success: false,
        error: 'Erreur lors de la mise à jour du guide',
        details: error.message,
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(guideParamsValidator)
    const success = await this.guideService.deleteGuide(validatedParams.id)

    if (!success) {
      return response.notFound({
        success: false,
        error: 'Guide non trouvé',
      })
    }

    return response.ok({
      success: true,
      message: 'Guide supprimé avec succès',
    })
  }

  // Utility endpoint to get guides by game
  async byGame({ request, response }: HttpContext) {
    try {
      const gameId = request.param('gameId')

      if (!gameId || Number.isNaN(Number(gameId))) {
        return response.badRequest({
          success: false,
          error: 'ID du jeu invalide',
        })
      }

      const guides = await this.guideService.getGuidesByGame(Number(gameId))

      return response.ok({
        success: true,
        data: guides,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        error: 'Erreur lors de la récupération des guides du jeu',
        details: error.message,
      })
    }
  }
}
