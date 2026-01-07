import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import DifficultyLevelService from '#services/difficulty_level_service'
import ResponseService from '#services/response_service'
import {
  createDifficultyLevelValidator,
  updateDifficultyLevelValidator,
  difficultyLevelParamsValidator,
} from '#validators/difficulty_level'

@inject()
export default class DifficultyLevelsController {
  constructor(private difficultyLevelService: DifficultyLevelService) {}

  async index(ctx: HttpContext) {
    const difficultyLevels = await this.difficultyLevelService.getDifficultyLevels()
    return ResponseService.ok(ctx, difficultyLevels)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(
      difficultyLevelParamsValidator
    )
    const difficultyLevel = await this.difficultyLevelService.getDifficultyLevelById(
      validatedParams.id
    )
    return ResponseService.ok(ctx, difficultyLevel)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createDifficultyLevelValidator)
    const difficultyLevel = await this.difficultyLevelService.createDifficultyLevel(payload)
    return ResponseService.created(ctx, difficultyLevel, 'Niveau de difficulté créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(
      updateDifficultyLevelValidator
    )
    const difficultyLevel = await this.difficultyLevelService.updateDifficultyLevel(
      validatedParams.id,
      payload
    )
    return ResponseService.ok(ctx, difficultyLevel, 'Niveau de difficulté mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(
      difficultyLevelParamsValidator
    )
    await this.difficultyLevelService.deleteDifficultyLevel(validatedParams.id)
    return ResponseService.success(ctx, 'Niveau de difficulté supprimé avec succès')
  }
}
