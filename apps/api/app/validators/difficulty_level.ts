import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createDifficultyLevelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'difficulty_levels', column: 'name' }),

    description: vine.string().trim().minLength(10).maxLength(500).optional(),
  })
)

const updateDifficultyLevelValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'difficulty_levels', column: 'id' }),
    }),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),

    description: vine.string().trim().minLength(10).maxLength(500).optional().nullable(),
  })
)

updateDifficultyLevelValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateDifficultyLevelValidator = updateDifficultyLevelValidatorBase

const difficultyLevelParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'difficulty_levels', column: 'id' }),
    }),
  })
)

difficultyLevelParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const difficultyLevelParamsValidator = difficultyLevelParamsValidatorBase
