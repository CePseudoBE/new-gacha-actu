import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArticleService from '#services/article_service'
import {
  createArticleValidator,
  updateArticleValidator,
  articleParamsValidator,
  articleSlugValidator,
} from '#validators/article'

@inject()
export default class ArticlesController {
  constructor(private articleService: ArticleService) {}

  async index({ response }: HttpContext) {
    const articles = await this.articleService.getArticles()

    return response.ok({
      success: true,
      data: articles,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(articleParamsValidator)
    const article = await this.articleService.getArticleById(validatedParams.id)

    if (!article) {
      return response.notFound({
        success: false,
        error: 'Article non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: article,
    })
  }

  async showBySlug({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(articleSlugValidator)
    const article = await this.articleService.getArticleBySlug(validatedParams.slug)

    if (!article) {
      return response.notFound({
        success: false,
        error: 'Article non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: article,
    })
  }

  async popular({ response }: HttpContext) {
    const articles = await this.articleService.getPopularArticles()

    return response.ok({
      success: true,
      data: articles,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createArticleValidator)
    const article = await this.articleService.createArticle(payload)

    return response.created({
      success: true,
      data: article,
      message: 'Article créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } =
      await request.validateUsing(updateArticleValidator)
    const article = await this.articleService.updateArticle(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: article,
      message: 'Article mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(articleParamsValidator)
    await this.articleService.deleteArticle(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Article supprimé avec succès',
    })
  }
}
