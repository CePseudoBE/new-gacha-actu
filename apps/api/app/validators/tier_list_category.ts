import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

// Create Tier List Category Validator
export const createTierListCategoryValidator = vine.compile(
  vine.object({
    tierListId: vine.number().exists({ table: 'tier_lists', column: 'id' }),

    name: vine.string().trim().minLength(2).maxLength(100),

    description: vine.string().trim().maxLength(500).optional().nullable(),

    icon: vine.string().trim().maxLength(50).optional().nullable(),

    order: vine.number().min(0).optional(),
  })
)

// Update Tier List Category Validator
const updateTierListCategoryValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_list_categories', column: 'id' }),
    }),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),

    description: vine.string().trim().maxLength(500).optional().nullable(),

    icon: vine.string().trim().maxLength(50).optional().nullable(),

    order: vine.number().min(0).optional(),
  })
)

updateTierListCategoryValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateTierListCategoryValidator = updateTierListCategoryValidatorBase

// Tier List Category Params Validator
const tierListCategoryParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_list_categories', column: 'id' }),
    }),
  })
)

tierListCategoryParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListCategoryParamsValidator = tierListCategoryParamsValidatorBase
