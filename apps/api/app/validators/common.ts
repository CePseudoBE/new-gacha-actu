import vine from '@vinejs/vine'

export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
  })
)

export const limitValidator = vine.compile(
  vine.object({
    limit: vine.number().min(1).max(50).optional(),
  })
)

export const searchValidator = vine.compile(
  vine.object({
    search: vine.string().trim().minLength(1).optional(),
  })
)

export const paginationWithSearchValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    search: vine.string().trim().minLength(1).optional(),
  })
)

// Query filters validators
export const gameFiltersValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    search: vine.string().trim().minLength(1).optional(),
    isPopular: vine.boolean().optional(),
    genreIds: vine.array(vine.number().min(1)).optional(),
    platformIds: vine.array(vine.number().min(1)).optional(),
  })
)

export const simpleFiltersValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),
    search: vine.string().trim().minLength(1).optional(),
  })
)
