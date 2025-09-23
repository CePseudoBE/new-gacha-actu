import vine from '@vinejs/vine'

/**
 * Validator pour la création d'un jeu
 */
export const createGameValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),

    description: vine.string().trim().minLength(10).maxLength(1000),

    releaseDate: vine.date({
      formats: {
        utc: true,
      },
    }),

    isPopular: vine.boolean().optional(),

    officialSite: vine.string().trim().url().optional(),

    wiki: vine.string().trim().url().optional(),

    // Relations - IDs des entités liées
    genreIds: vine.array(vine.number().min(1)).optional(),

    platformIds: vine.array(vine.number().min(1)).optional(),

    tagIds: vine.array(vine.number().min(1)).optional(),
  })
)

/**
 * Validator pour la mise à jour d'un jeu
 */
export const updateGameValidator = vine.compile(
  vine.object({
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

    // Relations - IDs des entités liées
    genreIds: vine.array(vine.number().min(1)).optional(),

    platformIds: vine.array(vine.number().min(1)).optional(),

    tagIds: vine.array(vine.number().min(1)).optional(),
  })
)

