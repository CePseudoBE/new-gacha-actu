import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArticleCategoryService from '#services/article_category_service'
import ResponseService from '#services/response_service'
import {
  articleCategoryParamsValidator,
  createArticleCategoryValidator,
  updateArticleCategoryValidator,
} from '#validators/article_category'

@inject()
export default class ArticleCategoriesController {
  constructor(private articleCategoryService: ArticleCategoryService) {}

  async index(ctx: HttpContext) {
    const categories = await this.articleCategoryService.getArticleCategories()
    return ResponseService.ok(ctx, categories)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(
      articleCategoryParamsValidator
    )
    const category = await this.articleCategoryService.getArticleCategoryById(validatedParams.id)
    return ResponseService.ok(ctx, category)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createArticleCategoryValidator)
    const category = await this.articleCategoryService.createArticleCategory(payload)
    return ResponseService.created(ctx, category, "Catégorie d'article créée avec succès")
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } = await ctx.request.validateUsing(
      updateArticleCategoryValidator
    )
    const category = await this.articleCategoryService.updateArticleCategory(
      validatedParams.id,
      payload
    )
    return ResponseService.ok(ctx, category, "Catégorie d'article mise à jour avec succès")
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(
      articleCategoryParamsValidator
    )
    await this.articleCategoryService.deleteArticleCategory(validatedParams.id)
    return ResponseService.success(ctx, "Catégorie d'article supprimée avec succès")
  }
}
