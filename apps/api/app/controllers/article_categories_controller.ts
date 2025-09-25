import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArticleCategoryService from '#services/article_category_service'
import {
  createArticleCategoryValidator,
  updateArticleCategoryValidator,
  articleCategoryParamsValidator,
} from '#validators/article_category'

@inject()
export default class ArticleCategoriesController {
  constructor(private articleCategoryService: ArticleCategoryService) {}

  async index({ response }: HttpContext) {
    const categories = await this.articleCategoryService.getArticleCategories()

    return response.ok({
      success: true,
      data: categories,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(articleCategoryParamsValidator)
    const category = await this.articleCategoryService.getArticleCategoryById(validatedParams.id)

    if (!category) {
      return response.notFound({
        success: false,
        error: "Catégorie d'article non trouvée",
      })
    }

    return response.ok({
      success: true,
      data: category,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createArticleCategoryValidator)
    const category = await this.articleCategoryService.createArticleCategory(payload)

    return response.created({
      success: true,
      data: category,
      message: "Catégorie d'article créée avec succès",
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } = await request.validateUsing(
      updateArticleCategoryValidator
    )
    const category = await this.articleCategoryService.updateArticleCategory(
      validatedParams.id,
      payload
    )

    return response.ok({
      success: true,
      data: category,
      message: "Catégorie d'article mise à jour avec succès",
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(articleCategoryParamsValidator)
    await this.articleCategoryService.deleteArticleCategory(validatedParams.id)

    return response.ok({
      success: true,
      message: "Catégorie d'article supprimée avec succès",
    })
  }
}
