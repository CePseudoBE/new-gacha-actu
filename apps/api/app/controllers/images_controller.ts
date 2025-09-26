import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ImageService from '#services/image_service'
import ResponseService from '#services/response_service'
import vine from '@vinejs/vine'

const imageParamsValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'images', column: 'id' }),
    }),
  })
)

@inject()
export default class ImagesController {
  constructor(private imageService: ImageService) {}

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(imageParamsValidator)
    const image = await this.imageService.getImageById(validatedParams.id)
    ResponseService.ok(ctx, image)
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(imageParamsValidator)
    await this.imageService.deleteImage(validatedParams.id)
    ResponseService.success(ctx, 'Image supprimée avec succès')
  }
}
