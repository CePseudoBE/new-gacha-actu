import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SeoKeywordService from '#services/seo_keyword_service'
import {
  createSeoKeywordValidator,
  updateSeoKeywordValidator,
  seoKeywordParamsValidator,
} from '#validators/seo_keyword'

@inject()
export default class SeoKeywordsController {
  constructor(private seoKeywordService: SeoKeywordService) {}

  async index({ response }: HttpContext) {
    const seoKeywords = await this.seoKeywordService.getSeoKeywords()

    return response.ok({
      success: true,
      data: seoKeywords,
    })
  }

  async show({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(seoKeywordParamsValidator)
    const seoKeyword = await this.seoKeywordService.getSeoKeywordById(validatedParams.id)

    if (!seoKeyword) {
      return response.notFound({
        success: false,
        error: 'Mot-clé SEO non trouvé',
      })
    }

    return response.ok({
      success: true,
      data: seoKeyword,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSeoKeywordValidator)
    const seoKeyword = await this.seoKeywordService.createSeoKeyword(payload)

    return response.created({
      success: true,
      data: seoKeyword,
      message: 'Mot-clé SEO créé avec succès',
    })
  }

  async update({ request, response }: HttpContext) {
    const { params: validatedParams, ...payload } =
      await request.validateUsing(updateSeoKeywordValidator)
    const seoKeyword = await this.seoKeywordService.updateSeoKeyword(validatedParams.id, payload)

    return response.ok({
      success: true,
      data: seoKeyword,
      message: 'Mot-clé SEO mis à jour avec succès',
    })
  }

  async destroy({ request, response }: HttpContext) {
    const { params: validatedParams } = await request.validateUsing(seoKeywordParamsValidator)
    await this.seoKeywordService.deleteSeoKeyword(validatedParams.id)

    return response.ok({
      success: true,
      message: 'Mot-clé SEO supprimé avec succès',
    })
  }
}
