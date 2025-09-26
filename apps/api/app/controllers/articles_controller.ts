import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArticleService from '#services/article_service'
import ResponseService from '#services/response_service'
import {
  createArticleValidator,
  updateArticleValidator,
  articleParamsValidator,
  articleSlugValidator,
} from '#validators/article'

@inject()
export default class ArticlesController {
  constructor(private articleService: ArticleService) {}

  async index(ctx: HttpContext) {
    const articles = await this.articleService.getArticles()
    ResponseService.ok(ctx, articles)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(articleParamsValidator)
    const article = await this.articleService.getArticleById(validatedParams.id)
    ResponseService.ok(ctx, article)
  }

  async showBySlug(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(articleSlugValidator)
    const article = await this.articleService.getArticleBySlug(validatedParams.slug)
    ResponseService.ok(ctx, article)
  }

  async popular(ctx: HttpContext) {
    const articles = await this.articleService.getPopularArticles()
    ResponseService.ok(ctx, articles)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createArticleValidator)
    const { image, ...articleData } = payload
    const article = await this.articleService.createArticle(articleData, image)
    ResponseService.created(ctx, article, 'Article créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateArticleValidator)
    const { image, ...articleData } = payload
    const article = await this.articleService.updateArticle(validatedParams.id, articleData, image)
    ResponseService.ok(ctx, article, 'Article mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(articleParamsValidator)
    await this.articleService.deleteArticle(validatedParams.id)
    ResponseService.success(ctx, 'Article supprimé avec succès')
  }
}
