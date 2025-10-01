import { BaseModelDto } from '@adocasts.com/dto/base'
import Game from '#models/game'
import ArticleDto from '#dtos/article'
import GuideDto from '#dtos/guide'
import YoutubeVideoDto from '#dtos/youtube_video'
import GenreDto from '#dtos/genre'
import TagDto from '#dtos/tag'
import PlatformDto from '#dtos/platform'
import ImageDto from '#dtos/image'

export default class GameDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare slug: string
  declare description: string | null
  declare releaseDate: string | null
  declare isPopular: boolean
  declare officialSite: string | null
  declare wiki: string | null
  declare createdAt: string | null
  declare updatedAt: string | null
  declare articles: ArticleDto[]
  declare guides: GuideDto[]
  declare youtubeVideos: YoutubeVideoDto[]
  declare genres: GenreDto[]
  declare tags: TagDto[]
  declare platforms: PlatformDto[]
  declare image: ImageDto | null

  constructor(game?: Game) {
    super()

    if (!game) return
    this.id = game.id
    this.name = game.name
    this.slug = game.slug
    this.description = game.description ?? null
    this.releaseDate = game.releaseDate?.toISO() ?? null
    this.isPopular = game.isPopular ?? false
    this.officialSite = game.officialSite ?? null
    this.wiki = game.wiki ?? null
    this.createdAt = game.createdAt?.toISO() ?? null
    this.updatedAt = game.updatedAt?.toISO() ?? null

    // Relations (seulement si chargées)
    this.articles = game.articles !== undefined ? ArticleDto.fromArray(game.articles) : []
    this.guides = game.guides !== undefined ? GuideDto.fromArray(game.guides) : []
    this.youtubeVideos =
      game.youtubeVideos !== undefined ? YoutubeVideoDto.fromArray(game.youtubeVideos) : []
    this.genres = game.genres !== undefined ? GenreDto.fromArray(game.genres) : []
    this.tags = game.tags !== undefined ? TagDto.fromArray(game.tags) : []
    this.platforms = game.platforms !== undefined ? PlatformDto.fromArray(game.platforms) : []
    this.image = game.image !== undefined ? new ImageDto(game.image) : null
  }
}
