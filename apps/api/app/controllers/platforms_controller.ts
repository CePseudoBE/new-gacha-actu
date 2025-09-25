import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PlatformService from '#services/platform_service'
import {
  createPlatformValidator,
  updatePlatformValidator,
  platformParamsValidator,
} from '#validators/platform'

@inject()
export default class PlatformsController {
  constructor(private platformService: PlatformService) {}

  async index({ response }: HttpContext) {
    const platforms = await this.platformService.getAllPlatforms()

    return response.ok({
      success: true,
      data: platforms,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(platformParamsValidator)
    const platform = await this.platformService.getPlatformById(validatedParams.id)

    if (!platform) {
      return response.notFound({
        success: false,
        error: 'Platform non trouvée',
      })
    }

    return response.ok({
      success: true,
      data: platform,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPlatformValidator)
    const platform = await this.platformService.createPlatform(payload)

    return response.created({
      success: true,
      data: platform,
      message: 'Platform créée avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } =
      await request.validateUsing(updatePlatformValidator)
    const platform = await this.platformService.updatePlatform(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: platform,
      message: 'Platform mise à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(platformParamsValidator)
    await this.platformService.deletePlatform(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Platform supprimée avec succès',
    })
  }
}
