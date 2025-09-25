import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createPlatformValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'platforms', column: 'name' }),
  })
)

const updatePlatformValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'platforms', column: 'id' }),
    }),

    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'platforms', column: 'name' })
      .optional(),
  })
)

updatePlatformValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updatePlatformValidator = updatePlatformValidatorBase

const platformParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'platforms', column: 'id' }),
    }),
  })
)

platformParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const platformParamsValidator = platformParamsValidatorBase
