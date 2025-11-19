import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TierService from '#services/tier_service'
import ResponseService from '#services/response_service'
import { updateTierValidator, tierParamsValidator } from '#validators/tier'

@inject()
export default class TiersController {
  constructor(private tierService: TierService) {}

  async index(ctx: HttpContext) {
    const tiers = await this.tierService.getAllTiers()
    ResponseService.ok(ctx, tiers)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tierParamsValidator)
    const tier = await this.tierService.getTierById(validatedParams.id)
    ResponseService.ok(ctx, tier)
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateTierValidator)

    const updateData = {
      ...(payload.label && { label: payload.label }),
      ...(payload.color && { color: payload.color }),
      ...(payload.description !== undefined && { description: payload.description }),
    }

    const tier = await this.tierService.updateTier(validatedParams.id, updateData)
    ResponseService.ok(ctx, tier, 'Tier mis à jour avec succès')
  }
}
