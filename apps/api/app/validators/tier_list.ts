import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

// Tier List Category Schema (nested in tier list creation/update)
const tierListCategorySchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  description: vine.string().trim().maxLength(500).optional().nullable(),
  icon: vine.string().trim().maxLength(50).optional().nullable(),
  order: vine.number().min(0).optional(),
})

// Tier List Entry Schema (nested in tier list creation/update)
const tierListEntrySchema = vine.object({
  categoryId: vine.number().optional().nullable(),
  characterId: vine.number().exists({ table: 'characters', column: 'id' }),
  tierId: vine.number().exists({ table: 'tiers', column: 'id' }),
  notes: vine.string().trim().maxLength(1000).optional().nullable(),
  order: vine.number().min(0).optional(),
})

// Create Tier List Validator
export const createTierListValidator = vine.compile(
  vine.object({
    gameId: vine.number().exists({ table: 'games', column: 'id' }),

    title: vine.string().trim().minLength(5).maxLength(200),

    description: vine.string().trim().maxLength(2000).optional().nullable(),

    version: vine.string().trim().maxLength(50).optional().nullable(),

    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),

    isPublished: vine.boolean().optional(),

    categories: vine.array(tierListCategorySchema).maxLength(10).optional(),

    entries: vine.array(tierListEntrySchema).minLength(1).maxLength(200).optional(),
  })
)

// Update Tier List Validator
const updateTierListValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_lists', column: 'id' }),
    }),

    gameId: vine.number().exists({ table: 'games', column: 'id' }).optional(),

    title: vine.string().trim().minLength(5).maxLength(200).optional(),

    description: vine.string().trim().maxLength(2000).optional().nullable(),

    version: vine.string().trim().maxLength(50).optional().nullable(),

    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),

    isPublished: vine.boolean().optional(),

    categories: vine.array(tierListCategorySchema).maxLength(10).optional(),

    entries: vine.array(tierListEntrySchema).minLength(1).maxLength(200).optional(),
  })
)

updateTierListValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateTierListValidator = updateTierListValidatorBase

// Tier List Params Validator
const tierListParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_lists', column: 'id' }),
    }),
  })
)

tierListParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListParamsValidator = tierListParamsValidatorBase

// Tier List Slug Params Validator
const tierListSlugParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

tierListSlugParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListSlugParamsValidator = tierListSlugParamsValidatorBase

// Tier List Filters Validator (for query params)
export const tierListFiltersValidator = vine.compile(
  vine.object({
    gameId: vine.number().optional(),
    isPublished: vine.string().in(['true', 'false']).optional(),
    limit: vine.number().min(1).max(100).optional(),
    page: vine.number().min(1).optional(),
  })
)

// Publish Tier List Validator
const publishTierListValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_lists', column: 'id' }),
    }),
  })
)

publishTierListValidatorBase.errorReporter = () => new CustomErrorReporter()
export const publishTierListValidator = publishTierListValidatorBase
