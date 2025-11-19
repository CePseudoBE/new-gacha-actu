import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

// Create Character Validator
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

// Update Character Validator
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

// Character Params Validator
const characterParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'characters', column: 'id' }),
    }),
  })
)

characterParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const characterParamsValidator = characterParamsValidatorBase

// Character Slug Params Validator
const characterSlugParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

characterSlugParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const characterSlugParamsValidator = characterSlugParamsValidatorBase

// Character Filters Validator (for query params)
export const characterFiltersValidator = vine.compile(
  vine.object({
    gameId: vine.number().optional(),
    rarity: vine.string().trim().optional(),
    element: vine.string().trim().optional(),
    role: vine.string().trim().optional(),
    isLimited: vine.string().in(['true', 'false']).optional(),
    limit: vine.number().min(1).max(100).optional(),
    page: vine.number().min(1).optional(),
  })
)
