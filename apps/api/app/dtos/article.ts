import { BaseModelDto } from '@adocasts.com/dto/base'
import Article from '#models/article'
import GameDto from '#dtos/game'
import ArticleCategoryDto from '#dtos/article_category'
import TagDto from '#dtos/tag'
import SeoKeywordDto from '#dtos/seo_keyword'

export default class ArticleDto extends BaseModelDto {
  declare id: number
  declare title: string
  declare summary: string
  declare author: string
  declare publishedAt: string
  declare slug: string
  declare imageUrl: string | null
  declare content: string
  declare metaDescription: string | null
  declare readingTime: number | null
  declare categoryId: number | null
  declare isPopular: boolean
  declare gameId: number
  declare createdAt: string
  declare updatedAt: string
  declare game: GameDto | null
  declare category: ArticleCategoryDto | null
  declare tags: TagDto[]
  declare seoKeywords: SeoKeywordDto[]

  constructor(article?: Article) {
    super()

    if (!article) return
    this.id = article.id
    this.title = article.title
    this.summary = article.summary
    this.author = article.author
    this.publishedAt = article.publishedAt.toISO()!
    this.slug = article.slug
    this.imageUrl = article.imageUrl
    this.content = article.content
    this.metaDescription = article.metaDescription
    this.readingTime = article.readingTime
    this.categoryId = article.categoryId
    this.isPopular = article.isPopular
    this.gameId = article.gameId
    this.createdAt = article.createdAt.toISO()!
    this.updatedAt = article.updatedAt.toISO()!
    this.game = article.game && new GameDto(article.game)
    this.category = article.category && new ArticleCategoryDto(article.category)
    this.tags = TagDto.fromArray(article.tags)
    this.seoKeywords = SeoKeywordDto.fromArray(article.seoKeywords)
  }
}
