import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

export const createSeoKeywordValidator = vine.compile(
  vine.object({
    keyword: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique({ table: 'seo_keywords', column: 'keyword' }),
  })
)

const updateSeoKeywordValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'seo_keywords', column: 'id' }),
    }),

    keyword: vine.string().trim().minLength(2).maxLength(100).optional(),
  })
)

updateSeoKeywordValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateSeoKeywordValidator = updateSeoKeywordValidatorBase

const seoKeywordParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'seo_keywords', column: 'id' }),
    }),
  })
)

seoKeywordParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const seoKeywordParamsValidator = seoKeywordParamsValidatorBase
