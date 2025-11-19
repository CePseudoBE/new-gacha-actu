import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

const tierListCategorySchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  description: vine.string().trim().maxLength(500).optional().nullable(),
  icon: vine.string().trim().maxLength(50).optional().nullable(),
  order: vine.number().min(0).optional(),
})

const tierListEntrySchema = vine.object({
  categoryId: vine.number().optional().nullable(),
  characterId: vine.number().exists({ table: 'characters', column: 'id' }),
  tierId: vine.number().exists({ table: 'tiers', column: 'id' }),
  notes: vine.string().trim().maxLength(1000).optional().nullable(),
  order: vine.number().min(0).optional(),
})

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

const tierListParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_lists', column: 'id' }),
    }),
  })
)

tierListParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListParamsValidator = tierListParamsValidatorBase

const tierListSlugValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

tierListSlugValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListSlugValidator = tierListSlugValidatorBase

export const tierListFiltersValidator = vine.compile(
  vine.object({
    gameId: vine.number().optional(),
    isPublished: vine.string().in(['true', 'false']).optional(),
    search: vine.string().trim().minLength(1).optional(),
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)

const publishTierListValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_lists', column: 'id' }),
    }),
  })
)

publishTierListValidatorBase.errorReporter = () => new CustomErrorReporter()
export const publishTierListValidator = publishTierListValidatorBase
