import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TagService from '#services/tag_service'
import QueryValidationService from '#services/query_validation_service'
import {
  createTagValidator,
  updateTagValidator,
  tagParamsValidator,
} from '#validators/tag'

@inject()
export default class TagsController {
  constructor(private tagService: TagService) {}

  async index(ctx: HttpContext) {
    const { page, perPage, filters } = await QueryValidationService.validateSimpleFilters(ctx)
    const result = await this.tagService.getTags(filters, page, perPage)

    return ctx.response.ok({
      success: true,
      data: result.data,
      meta: {
        pagination: result.meta,
      },
    })
  }

  async all({ response }: HttpContext) {
    const tags = await this.tagService.getAllTags()

    return response.ok({
      success: true,
      data: tags,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(tagParamsValidator)
    const tag = await this.tagService.getTagById(validatedParams.id)

    if (!tag) {
      return response.notFound({
        success: false,
        error: 'Tag non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: tag,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTagValidator)
    const tag = await this.tagService.createTag(payload)

    return response.created({
      success: true,
      data: tag,
      message: 'Tag créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(updateTagValidator)
    const tag = await this.tagService.updateTag(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: tag,
      message: 'Tag mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(tagParamsValidator)
    await this.tagService.deleteTag(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Tag supprimé avec succès',
    })
  }
}