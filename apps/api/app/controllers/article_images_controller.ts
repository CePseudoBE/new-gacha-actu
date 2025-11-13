import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Article from '#models/article'
import ImageService from '#services/image_service'
import ResponseService from '#services/response_service'
import vine from '@vinejs/vine'

const articleIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      articleId: vine.number().exists({ table: 'articles', column: 'id' }),
    }),
  })
)

const imageIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      articleId: vine.number().exists({ table: 'articles', column: 'id' }),
      imageId: vine.number().exists({ table: 'images', column: 'id' }),
    }),
  })
)

const uploadImageValidator = vine.compile(
  vine.object({
    params: vine.object({
      articleId: vine.number().exists({ table: 'articles', column: 'id' }),
    }),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
  })
)

@inject()
export default class ArticleImagesController {
  constructor(private imageService: ImageService) {}

  /**
   * GET /api/admin/articles/:articleId/images
   * Liste toutes les images d'un article
   */
  async index(ctx: HttpContext) {
    const { params } = await ctx.request.validateUsing(articleIdValidator)

    const article = await Article.query()
      .where('id', params.articleId)
      .preload('galleryImages')
      .firstOrFail()

    const images = article.galleryImages.map((image) => ({
      id: image.id,
      filename: image.filename,
      url: `/uploads/${image.path}`,
      altText: image.altText,
      size: image.size,
      mimeType: image.mimeType,
      createdAt: image.createdAt,
    }))

    ResponseService.ok(ctx, images)
  }

  /**
   * POST /api/admin/articles/:articleId/images
   * Upload et attache une nouvelle image à l'article
   */
  async store(ctx: HttpContext) {
    const { params, image } = await ctx.request.validateUsing(uploadImageValidator)

    const article = await Article.findOrFail(params.articleId)

    // Upload l'image via ImageService
    const uploadedImage = await this.imageService.uploadImage(image)

    // Attache l'image à l'article via la table pivot
    await article.related('galleryImages').attach([uploadedImage.id])

    const imageData = {
      id: uploadedImage.id,
      filename: uploadedImage.filename,
      url: uploadedImage.url,
      altText: uploadedImage.altText,
      size: uploadedImage.size,
      mimeType: uploadedImage.mimeType,
      createdAt: uploadedImage.createdAt,
    }

    ResponseService.created(ctx, imageData, 'Image ajoutée avec succès')
  }

  /**
   * DELETE /api/admin/articles/:articleId/images/:imageId
   * Détache une image de l'article (et la supprime si elle n'est plus utilisée)
   */
  async destroy(ctx: HttpContext) {
    const { params } = await ctx.request.validateUsing(imageIdValidator)

    const article = await Article.findOrFail(params.articleId)

    // Détache l'image de l'article
    await article.related('galleryImages').detach([params.imageId])

    // TODO: Vérifier si l'image est encore utilisée ailleurs avant de la supprimer physiquement
    // Pour l'instant on la détache simplement de la galerie

    ResponseService.success(ctx, 'Image retirée de la galerie')
  }
}
