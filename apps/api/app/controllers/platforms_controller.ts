import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PlatformService from '#services/platform_service'
import ResponseService from '#services/response_service'
import {
  createPlatformValidator,
  updatePlatformValidator,
  platformParamsValidator,
} from '#validators/platform'

@inject()
export default class PlatformsController {
  constructor(private platformService: PlatformService) {}

  async index(ctx: HttpContext) {
    const platforms = await this.platformService.getAllPlatforms()
    ResponseService.ok(ctx, platforms)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(platformParamsValidator)
    const platform = await this.platformService.getPlatformById(validatedParams.id)
    ResponseService.ok(ctx, platform)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createPlatformValidator)
    const platform = await this.platformService.createPlatform(payload)
    ResponseService.created(ctx, platform, 'Platform créée avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updatePlatformValidator)
    const platform = await this.platformService.updatePlatform(validatedParams.id, payload)
    ResponseService.ok(ctx, platform, 'Platform mise à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(platformParamsValidator)
    await this.platformService.deletePlatform(validatedParams.id)
    ResponseService.success(ctx, 'Platform supprimée avec succès')
  }
}
