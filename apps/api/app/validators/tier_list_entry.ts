import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createTierListEntryValidator = vine.compile(
  vine.object({
    tierListId: vine.number().exists({ table: 'tier_lists', column: 'id' }),

    categoryId: vine
      .number()
      .exists({ table: 'tier_list_categories', column: 'id' })
      .optional()
      .nullable(),

    characterId: vine.number().exists({ table: 'characters', column: 'id' }),

    tierId: vine.number().exists({ table: 'tiers', column: 'id' }),

    notes: vine.string().trim().maxLength(1000).optional().nullable(),

    order: vine.number().min(0).optional(),
  })
)

const updateTierListEntryValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_list_entries', column: 'id' }),
    }),

    categoryId: vine
      .number()
      .exists({ table: 'tier_list_categories', column: 'id' })
      .optional()
      .nullable(),

    tierId: vine.number().exists({ table: 'tiers', column: 'id' }).optional(),

    notes: vine.string().trim().maxLength(1000).optional().nullable(),

    order: vine.number().min(0).optional(),
  })
)

updateTierListEntryValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateTierListEntryValidator = updateTierListEntryValidatorBase

const tierListEntryParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tier_list_entries', column: 'id' }),
    }),
  })
)

tierListEntryParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const tierListEntryParamsValidator = tierListEntryParamsValidatorBase

export const bulkUpdateTierListEntriesValidator = vine.compile(
  vine.object({
    entries: vine
      .array(
        vine.object({
          id: vine.number().exists({ table: 'tier_list_entries', column: 'id' }),
          tierId: vine.number().exists({ table: 'tiers', column: 'id' }).optional(),
          categoryId: vine
            .number()
            .exists({ table: 'tier_list_categories', column: 'id' })
            .optional()
            .nullable(),
          order: vine.number().min(0).optional(),
        })
      )
      .minLength(1)
      .maxLength(200),
  })
)
