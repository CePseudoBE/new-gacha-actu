import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArticleCategoryService from '#services/article_category_service'
import ResponseService from '#services/response_service'
import {
  createArticleCategoryValidator,
  updateArticleCategoryValidator,
  articleCategoryParamsValidator,
} from '#validators/article_category'

@inject()
export default class ArticleCategoriesController {
  constructor(private articleCategoryService: ArticleCategoryService) {}

  async index(ctx: HttpContext) {
    const categories = await this.articleCategoryService.getArticleCategories()
    ResponseService.ok(ctx, categories)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(articleCategoryParamsValidator)
    const category = await this.articleCategoryService.getArticleCategoryById(validatedParams.id)
    ResponseService.ok(ctx, category)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createArticleCategoryValidator)
    const category = await this.articleCategoryService.createArticleCategory(payload)
    ResponseService.created(ctx, category, "Catégorie d'article créée avec succès")
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(
      updateArticleCategoryValidator
    )
    const category = await this.articleCategoryService.updateArticleCategory(
      validatedParams.id,
      payload
    )
    ResponseService.ok(ctx, category, "Catégorie d'article mise à jour avec succès")
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(articleCategoryParamsValidator)
    await this.articleCategoryService.deleteArticleCategory(validatedParams.id)
    ResponseService.success(ctx, "Catégorie d'article supprimée avec succès")
  }
}
