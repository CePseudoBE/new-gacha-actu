import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GuideTypeService from '#services/guide_type_service'
import {
  createGuideTypeValidator,
  guideTypeParamsValidator,
  updateGuideTypeValidator,
} from '#validators/guide_type'

@inject()
export default class GuideTypesController {
  constructor(private guideTypeService: GuideTypeService) {}

  async index({ response }: HttpContext) {
    const guideTypes = await this.guideTypeService.getGuideTypes()

    return response.ok({
      success: true,
      data: guideTypes,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(guideTypeParamsValidator)
    const guideType = await this.guideTypeService.getGuideTypeById(validatedParams.id)

    if (!guideType) {
      return response.notFound({
        success: false,
        error: 'Type de guide non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: guideType,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createGuideTypeValidator)
    const guideType = await this.guideTypeService.createGuideType(payload)

    return response.created({
      success: true,
      data: guideType,
      message: 'Type de guide créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } =
      await request.validateUsing(updateGuideTypeValidator)
    const guideType = await this.guideTypeService.updateGuideType(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: guideType,
      message: 'Type de guide mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(guideTypeParamsValidator)
    await this.guideTypeService.deleteGuideType(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Type de guide supprimé avec succès',
    })
  }
}
