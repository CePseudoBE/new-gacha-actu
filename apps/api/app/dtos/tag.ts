import { BaseModelDto } from '@adocasts.com/dto/base'
import Tag from '#models/tag'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'
import GameDto from '#dtos/game'

export default class TagDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare createdAt: string
  declare updatedAt: string
  declare articles: ArticleDto[]
  declare guides: GuideDto[]
  declare games: GameDto[]

  constructor(tag?: Tag) {
    super()

    if (!tag) return
    this.id = tag.id
    this.name = tag.name
    this.slug = tag.slug
    this.createdAt = tag.createdAt.toISO()!
    this.updatedAt = tag.updatedAt.toISO()!
    this.articles = ArticleDto.fromArray(tag.articles)
    this.guides = GuideDto.fromArray(tag.guides)
    this.games = GameDto.fromArray(tag.games)
  }
}
