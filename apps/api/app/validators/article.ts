import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2).maxLength(200),
    summary: vine.string().trim().minLength(10).maxLength(500),
    author: vine.string().trim().minLength(2).maxLength(100),
    publishedAt: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }),
    imageUrl: vine.string().trim().url().optional(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
    content: vine.string().trim().minLength(50),
    metaDescription: vine.string().trim().minLength(10).maxLength(160).optional(),
    readingTime: vine.number().min(1).max(120).optional(),
    categoryId: vine.number().exists({ table: 'article_categories', column: 'id' }).optional(),
    isPopular: vine.boolean().optional(),
    gameId: vine.number().exists({ table: 'games', column: 'id' }),

    tagIds: vine.array(vine.number().min(1).exists({ table: 'tags', column: 'id' })).optional(),

    seoKeywordIds: vine
      .array(vine.number().min(1).exists({ table: 'seo_keywords', column: 'id' }))
      .optional(),
  })
)

const updateArticleValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'articles', column: 'id' }),
    }),

    title: vine.string().trim().minLength(2).maxLength(200).optional(),
    summary: vine.string().trim().minLength(10).maxLength(500).optional(),
    author: vine.string().trim().minLength(2).maxLength(100).optional(),
    publishedAt: vine.date({ formats: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD'] }).optional(),
    imageUrl: vine.string().trim().url().optional(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
    content: vine.string().trim().minLength(50).optional(),
    metaDescription: vine.string().trim().minLength(10).maxLength(160).optional(),
    readingTime: vine.number().min(1).max(120).optional(),
    categoryId: vine.number().exists({ table: 'article_categories', column: 'id' }).optional(),
    isPopular: vine.boolean().optional(),
    gameId: vine.number().exists({ table: 'games', column: 'id' }).optional(),

    tagIds: vine.array(vine.number().min(1).exists({ table: 'tags', column: 'id' })).optional(),

    seoKeywordIds: vine
      .array(vine.number().min(1).exists({ table: 'seo_keywords', column: 'id' }))
      .optional(),
  })
)

updateArticleValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateArticleValidator = updateArticleValidatorBase

const articleParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'articles', column: 'id' }),
    }),
  })
)

articleParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const articleParamsValidator = articleParamsValidatorBase

const articleSlugValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().trim().minLength(1),
    }),
  })
)

articleSlugValidatorBase.errorReporter = () => new CustomErrorReporter()
export const articleSlugValidator = articleSlugValidatorBase
