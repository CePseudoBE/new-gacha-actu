import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createGuideTypeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'guide_types', column: 'name' }),

    description: vine.string().trim().minLength(10).maxLength(500).optional(),
  })
)

const updateGuideTypeValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guide_types', column: 'id' }),
    }),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),

    description: vine.string().trim().minLength(10).maxLength(500).optional().nullable(),
  })
)

updateGuideTypeValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateGuideTypeValidator = updateGuideTypeValidatorBase

const guideTypeParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guide_types', column: 'id' }),
    }),
  })
)

guideTypeParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const guideTypeParamsValidator = guideTypeParamsValidatorBase
