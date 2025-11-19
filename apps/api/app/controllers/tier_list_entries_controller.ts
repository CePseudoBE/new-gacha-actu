import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TierListService from '#services/tier_list_service'
import TierListEntryRepository from '#repositories/tier_list_entry_repository'
import ResponseService from '#services/response_service'
import {
  createTierListEntryValidator,
  updateTierListEntryValidator,
  tierListEntryParamsValidator,
  bulkUpdateTierListEntriesValidator,
} from '#validators/tier_list_entry'
import TierListEntryDto from '#dtos/tier_list_entry'
import { NotFoundException } from '#exceptions/http_exceptions'

@inject()
export default class TierListEntriesController {
  constructor(
    private tierListEntryRepository: TierListEntryRepository,
    private tierListService: TierListService
  ) {}

  async index(ctx: HttpContext) {
    const tierListId = ctx.request.param('tierListId')

    if (!tierListId || Number.isNaN(Number(tierListId))) {
      ResponseService.badRequest(ctx, 'ID de la tier list invalide')
      return
    }

    const entries = await this.tierListEntryRepository.findByTierListId(Number(tierListId))
    ResponseService.ok(ctx, TierListEntryDto.fromArray(entries))
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListEntryParamsValidator)
    const entry = await this.tierListEntryRepository.findById(validatedParams.id)

    if (!entry) {
      throw new NotFoundException('Entrée non trouvée')
    }

    ResponseService.ok(ctx, new TierListEntryDto(entry))
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createTierListEntryValidator)

    const entry = await this.tierListEntryRepository.create(payload)
    ResponseService.created(ctx, new TierListEntryDto(entry), 'Entrée créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateTierListEntryValidator)

    const updateData = {
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
      ...(payload.tierId && { tierId: payload.tierId }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
      ...(payload.order !== undefined && { order: payload.order }),
    }

    const entry = await this.tierListEntryRepository.update(validatedParams.id, updateData)

    if (!entry) {
      throw new NotFoundException('Entrée non trouvée')
    }

    ResponseService.ok(ctx, new TierListEntryDto(entry), 'Entrée mise à jour avec succès')
  }

  async bulkUpdate(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(bulkUpdateTierListEntriesValidator)

    await this.tierListService.bulkUpdateEntries(payload.entries)
    ResponseService.success(ctx, 'Entrées mises à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierListEntryParamsValidator)
    const deleted = await this.tierListEntryRepository.delete(validatedParams.id)

    if (!deleted) {
      throw new NotFoundException('Entrée non trouvée')
    }

    ResponseService.success(ctx, 'Entrée supprimée avec succès')
  }
}
