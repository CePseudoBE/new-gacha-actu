import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GuideTypeService from '#services/guide_type_service'
import ResponseService from '#services/response_service'
import {
  createGuideTypeValidator,
  guideTypeParamsValidator,
  updateGuideTypeValidator,
} from '#validators/guide_type'

@inject()
export default class GuideTypesController {
  constructor(private guideTypeService: GuideTypeService) {}

  async index(ctx: HttpContext) {
    const guideTypes = await this.guideTypeService.getGuideTypes()
    ResponseService.ok(ctx, guideTypes)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideTypeParamsValidator)
    const guideType = await this.guideTypeService.getGuideTypeById(validatedParams.id)
    ResponseService.ok(ctx, guideType)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createGuideTypeValidator)
    const guideType = await this.guideTypeService.createGuideType(payload)
    ResponseService.created(ctx, guideType, 'Type de guide créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateGuideTypeValidator)
    const guideType = await this.guideTypeService.updateGuideType(validatedParams.id, payload)
    ResponseService.ok(ctx, guideType, 'Type de guide mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(guideTypeParamsValidator)
    await this.guideTypeService.deleteGuideType(validatedParams.id)
    ResponseService.success(ctx, 'Type de guide supprimé avec succès')
  }
}
