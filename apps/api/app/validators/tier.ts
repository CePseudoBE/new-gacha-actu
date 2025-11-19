import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

const updateTierValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tiers', column: 'id' }),
    }),

    label: vine.string().trim().minLength(2).maxLength(50).optional(),

    color: vine
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),

    description: vine.string().trim().maxLength(500).optional().nullable(),
  })
)

updateTierValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateTierValidator = updateTierValidatorBase

const tierParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tiers', column: 'id' }),
    }),
  })
)

tierParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierParamsValidator = tierParamsValidatorBase
