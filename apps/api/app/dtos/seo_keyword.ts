import { BaseModelDto } from '@adocasts.com/dto/base'
import SeoKeyword from '#models/seo_keyword'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'

export default class SeoKeywordDto extends BaseModelDto {
  declare id: number
  declare keyword: string
  declare createdAt: string
  declare updatedAt: string
  declare articles: ArticleDto[]
  declare guides: GuideDto[]

  constructor(seoKeyword?: SeoKeyword) {
    super()

    if (!seoKeyword) return
    this.id = seoKeyword.id
    this.keyword = seoKeyword.keyword
    this.createdAt = seoKeyword.createdAt.toISO()!
    this.updatedAt = seoKeyword.updatedAt.toISO()!
    this.articles = ArticleDto.fromArray(seoKeyword.articles)
    this.guides = GuideDto.fromArray(seoKeyword.guides)
  }
}
