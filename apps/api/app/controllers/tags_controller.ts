import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TagService from '#services/tag_service'
import ResponseService from '#services/response_service'
import { createTagValidator, updateTagValidator, tagParamsValidator } from '#validators/tag'

@inject()
export default class TagsController {
  constructor(private tagService: TagService) {}

  async index(ctx: HttpContext) {
    const tags = await this.tagService.getAllTags()
    ResponseService.ok(ctx, tags)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tagParamsValidator)
    const tag = await this.tagService.getTagById(validatedParams.id)
    ResponseService.ok(ctx, tag)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createTagValidator)
    const tag = await this.tagService.createTag(payload)
    ResponseService.created(ctx, tag, 'Tag créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(updateTagValidator)
    const tag = await this.tagService.updateTag(validatedParams.id, payload)
    ResponseService.ok(ctx, tag, 'Tag mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(tagParamsValidator)
    await this.tagService.deleteTag(validatedParams.id)
    ResponseService.success(ctx, 'Tag supprimé avec succès')
  }
}
