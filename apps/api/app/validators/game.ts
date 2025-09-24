import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createGameValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'games', column: 'name' }),

    description: vine.string().trim().minLength(10).maxLength(1000),

    releaseDate: vine.date({
      formats: {
        utc: true,
      },
    }),

    isPopular: vine.boolean().optional(),

    officialSite: vine.string().trim().url().optional(),

    wiki: vine.string().trim().url().optional(),

    genreId: vine
      .array(vine.number().min(1).exists({ table: 'genres', column: 'id' }))
      .minLength(1)
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      }),

    genreIds: vine
      .array(vine.number().min(1).exists({ table: 'genres', column: 'id' }))
      .minLength(1)
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    platformId: vine
      .array(vine.number().min(1).exists({ table: 'platforms', column: 'id' }))
      .minLength(1)
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    platformIds: vine
      .array(vine.number().min(1).exists({ table: 'platforms', column: 'id' }))
      .minLength(1)
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    tagId: vine
      .array(vine.number().min(1).exists({ table: 'tags', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    tagIds: vine
      .array(vine.number().min(1).exists({ table: 'tags', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),
  })
)

const updateGameValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'games', column: 'id' }),
    }),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),

    description: vine.string().trim().minLength(10).maxLength(1000).optional(),

    releaseDate: vine
      .date({
        formats: {
          utc: true,
        },
      })
      .optional(),

    isPopular: vine.boolean().optional(),

    officialSite: vine.string().trim().url().optional().nullable(),

    wiki: vine.string().trim().url().optional().nullable(),

    genreId: vine
      .array(vine.number().min(1).exists({ table: 'genres', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    genreIds: vine
      .array(vine.number().min(1).exists({ table: 'genres', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    platformId: vine
      .array(vine.number().min(1).exists({ table: 'platforms', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    platformIds: vine
      .array(vine.number().min(1).exists({ table: 'platforms', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    tagId: vine
      .array(vine.number().min(1).exists({ table: 'tags', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),

    tagIds: vine
      .array(vine.number().min(1).exists({ table: 'tags', column: 'id' }))
      .parse((value) => {
        if (value === null || value === undefined) return value
        return Array.isArray(value) ? value : [value]
      })
      .optional(),
  })
)

updateGameValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateGameValidator = updateGameValidatorBase

const gameParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'games', column: 'id' }),
    }),
  })
)

gameParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const gameParamsValidator = gameParamsValidatorBase

const gameSlugParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().exists({ table: 'games', column: 'slug' }),
    }),
  })
)

gameSlugParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const gameSlugParamsValidator = gameSlugParamsValidatorBase
