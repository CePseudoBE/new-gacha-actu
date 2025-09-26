import vine from '@vinejs/vine'
import { CustomErrorReporter } from '#validators/custom_error_reporter'

// Create Guide Section Validator
export const createGuideSectionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(200),
    content: vine.string().trim().minLength(10).maxLength(10000),
    order: vine.number().min(0),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
  })
)

// Update Guide Section Validator
const updateGuideSectionValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guide_sections', column: 'id' }),
    }),
    title: vine.string().trim().minLength(1).maxLength(200).optional(),
    content: vine.string().trim().minLength(10).maxLength(10000).optional(),
    order: vine.number().min(0).optional(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
      .optional(),
  })
)

updateGuideSectionValidatorBase.errorReporter = () => new CustomErrorReporter()
export const updateGuideSectionValidator = updateGuideSectionValidatorBase

// Guide Section Params Validator
const guideSectionParamsValidatorBase = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'guide_sections', column: 'id' }),
    }),
  })
)

guideSectionParamsValidatorBase.errorReporter = () => new CustomErrorReporter()
export const guideSectionParamsValidator = guideSectionParamsValidatorBase
