import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DifficultyLevelService from '#services/difficulty_level_service'
import {
  createDifficultyLevelValidator,
  updateDifficultyLevelValidator,
  difficultyLevelParamsValidator,
} from '#validators/difficulty_level'

@inject()
export default class DifficultyLevelsController {
  constructor(private difficultyLevelService: DifficultyLevelService) {}

  async index({ response }: HttpContext) {
    const difficultyLevels = await this.difficultyLevelService.getDifficultyLevels()

    return response.ok({
      success: true,
      data: difficultyLevels,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(difficultyLevelParamsValidator)
    const difficultyLevel = await this.difficultyLevelService.getDifficultyLevelById(
      validatedParams.id
    )

    if (!difficultyLevel) {
      return response.notFound({
        success: false,
        error: 'Niveau de difficulté non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: difficultyLevel,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createDifficultyLevelValidator)
    const difficultyLevel = await this.difficultyLevelService.createDifficultyLevel(payload)

    return response.created({
      success: true,
      data: difficultyLevel,
      message: 'Niveau de difficulté créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(
      updateDifficultyLevelValidator
    )
    const difficultyLevel = await this.difficultyLevelService.updateDifficultyLevel(
      validatedParams.id,
      payload
    )

    return response.ok({
      success: true,
      data: difficultyLevel,
      message: 'Niveau de difficulté mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(difficultyLevelParamsValidator)
    await this.difficultyLevelService.deleteDifficultyLevel(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Niveau de difficulté supprimé avec succès',
    })
  }
}
