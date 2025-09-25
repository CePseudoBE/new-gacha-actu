import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createGenreValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'genres', column: 'name' }),

    description: vine.string().trim().minLength(10).maxLength(500),
  })
)

const updateGenreValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'genres', column: 'id' }),
    }),

    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'genres', column: 'name' })
      .optional(),

    description: vine.string().trim().minLength(10).maxLength(500).optional(),
  })
)

updateGenreValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateGenreValidator = updateGenreValidatorBase

const genreParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'genres', column: 'id' }),
    }),
  })
)

genreParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const genreParamsValidator = genreParamsValidatorBase
