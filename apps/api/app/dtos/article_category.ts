import { BaseModelDto } from '@adocasts.com/dto/base'
import ArticleCategory from '#models/article_category'
import ArticleDto from '#dtos/article'

export default class ArticleCategoryDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare createdAt: string
  declare updatedAt: string
  declare articles: ArticleDto[]

  constructor(articleCategory?: ArticleCategory) {
    super()

    if (!articleCategory) return
    this.id = articleCategory.id
    this.name = articleCategory.name
    this.slug = articleCategory.slug
    this.description = articleCategory.description
    this.createdAt = articleCategory.createdAt.toISO()!
    this.updatedAt = articleCategory.updatedAt.toISO()!
    this.articles = articleCategory.articles ? ArticleDto.fromArray(articleCategory.articles) : []
  }
}
