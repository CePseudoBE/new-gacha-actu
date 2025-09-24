import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createTagValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'tags', column: 'name' }),
  })
)

const updateTagValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tags', column: 'id' }),
    }),

    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'tags', column: 'name' })
      .optional(),
  })
)

updateTagValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateTagValidator = updateTagValidatorBase

const tagParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tags', column: 'id' }),
    }),
  })
)

tagParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tagParamsValidator = tagParamsValidatorBase