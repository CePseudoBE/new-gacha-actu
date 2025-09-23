import vine from '@vinejs/vine'

/**
 * Validator pour la pagination standard
 */
export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)

/**
 * Validator pour les limites (utilisé pour les listes courtes)
 */
export const limitValidator = vine.compile(
  vine.object({
    limit: vine.number().min(1).max(50).optional(),
  })
)

/**
 * Validator pour la recherche de base
 */
export const searchValidator = vine.compile(
  vine.object({
    search: vine.string().trim().minLength(1).optional(),
  })
)

/**
 * Validator combiné pagination + recherche
 */
export const paginationWithSearchValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    search: vine.string().trim().minLength(1).optional(),
  })
)