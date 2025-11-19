import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TierListCategoryRepository from '#repositories/tier_list_category_repository'
import ResponseService from '#services/response_service'
import {
  createTierListCategoryValidator,
  updateTierListCategoryValidator,
  tierListCategoryParamsValidator,
} from '#validators/tier_list_category'
import TierListCategoryDto from '#dtos/tier_list_category'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class TierListCategoriesController {
  constructor(private tierListCategoryRepository: TierListCategoryRepository) {}

  async index(ctx: HttpContext) {
    const tierListId = ctx.request.param('tierListId')

    if (!tierListId || Number.isNaN(Number(tierListId))) {
      ResponseService.badRequest(ctx, 'ID de la tier list invalide')
      return
    }

    const categories = await this.tierListCategoryRepository.findByTierListId(Number(tierListId))
    ResponseService.ok(ctx, TierListCategoryDto.fromArray(categories))
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListCategoryParamsValidator)
    const category = await this.tierListCategoryRepository.findById(validatedParams.id)

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée')
    }

    ResponseService.ok(ctx, new TierListCategoryDto(category))
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createTierListCategoryValidator)

    const category = await this.tierListCategoryRepository.create(payload)
    ResponseService.created(ctx, new TierListCategoryDto(category), 'Catégorie créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateTierListCategoryValidator)

    const updateData = {
      ...(payload.name && { name: payload.name }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.icon !== undefined && { icon: payload.icon }),
    }

    const category = await this.tierListCategoryRepository.update(validatedParams.id, updateData)

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée')
    }

    ResponseService.ok(ctx, new TierListCategoryDto(category), 'Catégorie mise à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListCategoryParamsValidator)
    const deleted = await this.tierListCategoryRepository.delete(validatedParams.id)

    if (!deleted) {
      throw new NotFoundException('Catégorie non trouvée')
    }

    ResponseService.success(ctx, 'Catégorie supprimée avec succès')
  }
}
