import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

// Guide Section Validator
const guideSectionSchema = vine.object({
  title: vine.string().trim().minLength(1).maxLength(200),
  content: vine.string().trim().minLength(10).maxLength(10000),
  order: vine.number().min(0),
  image: vine.file({
    size: '2mb',
    extnames: ['jpg', 'jpeg', 'png', 'webp']
  }).optional(),
})

// Guide Prerequisite Validator
const guidePrerequisiteSchema = vine.object({
  description: vine.string().trim().minLength(5).maxLength(500),
})

// Create Guide Validator
export const createGuideValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(5)
      .maxLength(200)
      .unique({ table: 'guides', column: 'title' }),

    summary: vine.string().trim().minLength(50).maxLength(500),

    author: vine.string().trim().minLength(2).maxLength(100),

    publishedAt: vine.date({
      formats: ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'iso'],
    }),

    slug: vine
      .string()
      .trim()
      .minLength(5)
      .maxLength(200)
      .unique({ table: 'guides', column: 'slug' })
      .optional(),

    imageUrl: vine.string().trim().url().optional().nullable(),

    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp']
    }).optional(),

    readingTime: vine.number().min(1).optional().nullable(),

    difficultyId: vine.number().exists({ table: 'difficulty_levels', column: 'id' }),

    guideTypeId: vine.number().exists({ table: 'guide_types', column: 'id' }),

    isPopular: vine.boolean().optional(),

    gameId: vine.number().exists({ table: 'games', column: 'id' }),

    metaDescription: vine.string().trim().maxLength(160).optional().nullable(),

    sections: vine.array(guideSectionSchema).minLength(1).maxLength(20),

    prerequisites: vine.array(guidePrerequisiteSchema).maxLength(10).optional(),

    tagIds: vine.array(vine.number().exists({ table: 'tags', column: 'id' })).optional(),

    seoKeywordIds: vine
      .array(vine.number().exists({ table: 'seo_keywords', column: 'id' }))
      .optional(),
  })
)

// Update Guide Validator
const updateGuideValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guides', column: 'id' }),
    }),

    title: vine.string().trim().minLength(5).maxLength(200).optional(),

    summary: vine.string().trim().minLength(50).maxLength(500).optional(),

    author: vine.string().trim().minLength(2).maxLength(100).optional(),

    publishedAt: vine
      .date({
        formats: ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'iso'],
      })
      .optional(),

    slug: vine.string().trim().minLength(5).maxLength(200).optional(),

    imageUrl: vine.string().trim().url().optional().nullable(),

    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp']
    }).optional(),

    readingTime: vine.number().min(1).optional().nullable(),

    difficultyId: vine.number().exists({ table: 'difficulty_levels', column: 'id' }).optional(),

    guideTypeId: vine.number().exists({ table: 'guide_types', column: 'id' }).optional(),

    isPopular: vine.boolean().optional(),

    gameId: vine.number().exists({ table: 'games', column: 'id' }).optional(),

    metaDescription: vine.string().trim().maxLength(160).optional().nullable(),

    sections: vine.array(guideSectionSchema).minLength(1).maxLength(20).optional(),

    prerequisites: vine.array(guidePrerequisiteSchema).maxLength(10).optional(),

    tagIds: vine.array(vine.number().exists({ table: 'tags', column: 'id' })).optional(),

    seoKeywordIds: vine
      .array(vine.number().exists({ table: 'seo_keywords', column: 'id' }))
      .optional(),
  })
)

updateGuideValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateGuideValidator = updateGuideValidatorBase

// Guide Params Validator
const guideParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guides', column: 'id' }),
    }),
  })
)

guideParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const guideParamsValidator = guideParamsValidatorBase

// Guide Slug Params Validator
const guideSlugParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

guideSlugParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const guideSlugParamsValidator = guideSlugParamsValidatorBase

// Guide Filters Validator (for query params)
export const guideFiltersValidator = vine.compile(
  vine.object({
    game: vine.string().trim().optional(), // game slug
    guideTypeId: vine.number().optional(),
    difficultyId: vine.number().optional(),
    popular: vine.string().in(['true', 'false']).optional(),
    limit: vine.number().min(1).max(100).optional(),
    page: vine.number().min(1).optional(),
  })
)
