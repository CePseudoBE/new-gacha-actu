import { BaseModelDto } from '@adocasts.com/dto/base'
import Game from '#models/game'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'
import YoutubeVideoDto from '#dtos/youtube_video'
import GenreDto from '#dtos/genre'
import TagDto from '#dtos/tag'
import PlatformDto from '#dtos/platform'

export default class GameDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string
  declare releaseDate: string
  declare isPopular: boolean
  declare officialSite: string | null
  declare wiki: string | null
  declare createdAt: string
  declare updatedAt: string
  declare articles: ArticleDto[]
  declare guides: GuideDto[]
  declare youtubeVideos: YoutubeVideoDto[]
  declare genres: GenreDto[]
  declare tags: TagDto[]
  declare platforms: PlatformDto[]

  constructor(game?: Game) {
    super()

    if (!game) return
    this.id = game.id
    this.name = game.name
    this.slug = game.slug
    this.description = game.description
    this.releaseDate = game.releaseDate.toISO()!
    this.isPopular = game.isPopular
    this.officialSite = game.officialSite
    this.wiki = game.wiki
    this.createdAt = game.createdAt.toISO()!
    this.updatedAt = game.updatedAt.toISO()!

    // Relations (seulement si chargées)
    this.articles = game.articles ? ArticleDto.fromArray(game.articles) : []
    this.guides = game.guides ? GuideDto.fromArray(game.guides) : []
    this.youtubeVideos = game.youtubeVideos ? YoutubeVideoDto.fromArray(game.youtubeVideos) : []
    this.genres = game.genres ? GenreDto.fromArray(game.genres) : []
    this.tags = game.tags ? TagDto.fromArray(game.tags) : []
    this.platforms = game.platforms ? PlatformDto.fromArray(game.platforms) : []
  }
}
