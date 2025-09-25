import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SeoKeywordService from '#services/seo_keyword_service'
import ResponseService from '#services/response_service'
import {
  createSeoKeywordValidator,
  updateSeoKeywordValidator,
  seoKeywordParamsValidator,
} from '#validators/seo_keyword'

@inject()
export default class SeoKeywordsController {
  constructor(private seoKeywordService: SeoKeywordService) {}

  async index(ctx: HttpContext) {
    const seoKeywords = await this.seoKeywordService.getSeoKeywords()
    ResponseService.ok(ctx, seoKeywords)
  }

  async show(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(seoKeywordParamsValidator)
    const seoKeyword = await this.seoKeywordService.getSeoKeywordById(validatedParams.id)
    ResponseService.ok(ctx, seoKeyword)
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createSeoKeywordValidator)
    const seoKeyword = await this.seoKeywordService.createSeoKeyword(payload)
    ResponseService.created(ctx, seoKeyword, 'Mot-clé SEO créé avec succès')
  }

  async update(ctx: HttpContext) {
    const { params: validatedParams, ...payload } =
      await ctx.request.validateUsing(updateSeoKeywordValidator)
    const seoKeyword = await this.seoKeywordService.updateSeoKeyword(validatedParams.id, payload)
    ResponseService.ok(ctx, seoKeyword, 'Mot-clé SEO mis à jour avec succès')
  }

  async destroy(ctx: HttpContext) {
    const { params: validatedParams } = await ctx.request.validateUsing(seoKeywordParamsValidator)
    await this.seoKeywordService.deleteSeoKeyword(validatedParams.id)
    ResponseService.success(ctx, 'Mot-clé SEO supprimé avec succès')
  }
}
