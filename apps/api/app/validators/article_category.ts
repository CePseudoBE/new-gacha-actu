import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createArticleCategoryValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'article_categories', column: 'name' }),
    description: vine.string().trim().minLength(2).maxLength(500).optional(),
  })
)

const updateArticleCategoryValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'article_categories', column: 'id' }),
    }),

    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    description: vine.string().trim().minLength(2).maxLength(500).optional(),
  })
)

updateArticleCategoryValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateArticleCategoryValidator = updateArticleCategoryValidatorBase

const articleCategoryParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'article_categories', column: 'id' }),
    }),
  })
)

articleCategoryParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const articleCategoryParamsValidator = articleCategoryParamsValidatorBase
