import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createCharacterValidator = vine.compile(
  vine.object({
    gameId: vine.number().exists({ table: 'games', column: 'id' }),

    name: vine.string().trim().minLength(2).maxLength(100),

    rarity: vine.string().trim().maxLength(20).optional().nullable(),

    element: vine.string().trim().maxLength(50).optional().nullable(),

    role: vine.string().trim().maxLength(50).optional().nullable(),

    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),

    description: vine.string().trim().maxLength(1000).optional().nullable(),

    releaseDate: vine.date({ formats: ['YYYY-MM-DD', 'iso'] }).optional().nullable(),

    isLimited: vine.boolean().optional(),
  })
)

const updateCharacterValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'characters', column: 'id' }),
    }),

    gameId: vine.number().exists({ table: 'games', column: 'id' }).optional(),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),

    rarity: vine.string().trim().maxLength(20).optional().nullable(),

    element: vine.string().trim().maxLength(50).optional().nullable(),

    role: vine.string().trim().maxLength(50).optional().nullable(),

    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),

    description: vine.string().trim().maxLength(1000).optional().nullable(),

    releaseDate: vine.date({ formats: ['YYYY-MM-DD', 'iso'] }).optional().nullable(),

    isLimited: vine.boolean().optional(),
  })
)

updateCharacterValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateCharacterValidator = updateCharacterValidatorBase

const characterParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'characters', column: 'id' }),
    }),
  })
)

characterParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const characterParamsValidator = characterParamsValidatorBase

const characterSlugValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

characterSlugValidatorBase.errorReporter = () => new CustomErrorReporter()
export const characterSlugValidator = characterSlugValidatorBase

export const characterFiltersValidator = vine.compile(
  vine.object({
    gameId: vine.number().optional(),
    rarity: vine.string().trim().optional(),
    element: vine.string().trim().optional(),
    role: vine.string().trim().optional(),
    isLimited: vine.string().in(['true', 'false']).optional(),
    search: vine.string().trim().minLength(1).optional(),
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)
